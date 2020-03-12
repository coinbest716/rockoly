/** @format */

// @flow
/**
 * Created by InspireUI on 19/02/2017.
 */
import React, {PureComponent} from 'react'
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
import {Images} from '@images'
import {Theme} from '@theme'
import {Header, Spinner, CommonList} from '@components'
import {AuthContext} from '../../../AuthContext'
import {
  PaymentHistoryService,
  PAYMENT_HISTORY_EVENT,
  COMMON_LIST_NAME,
  CommonService,
} from '@services'
import {GMTToLocal, DATE_TYPE} from '@utils'
import {RouteNames} from '@navigation'
import {Languages} from '@translations'
import styles from './styles'

class ChefPaymentHistory extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      paymentHistoryList: [],
      isFetching: false,
      isFetchingMore: false,
      totalCount: 0,
      first: 50,
      offset: 0,
    }
  }

  componentDidMount() {
    PaymentHistoryService.on(PAYMENT_HISTORY_EVENT.CHEF_PAYMENT_HISTORY, this.setPaymentHistory)
    PaymentHistoryService.on(PAYMENT_HISTORY_EVENT.UPDATING_PAYMENT_HISTORY, this.onLoadData)

    this.onLoadData()
    const {isLoggedIn, currentUser} = this.context
    if (isLoggedIn && currentUser) {
      PaymentHistoryService.chefPaymentSubs(currentUser.chefId)
    }
  }

  componentWillUnmount() {
    PaymentHistoryService.off(PAYMENT_HISTORY_EVENT.CHEF_PAYMENT_HISTORY, this.setPaymentHistory)
    PaymentHistoryService.off(PAYMENT_HISTORY_EVENT.UPDATING_PAYMENT_HISTORY, this.onLoadData)
  }

  reload = () => {
    this.setState(
      {
        paymentHistoryList: [],
        totalCount: 0,
        first: 50,
        offset: 0,
      },
      () => {
        this.onLoadData()
      }
    )
  }

  onLoadData = () => {
    const {isLoggedIn} = this.context
    if (isLoggedIn) {
      this.setState(
        {
          isFetching: true,
        },
        () => {
          this.fetchTotalCount()
        }
      )
    }
  }

  fetchTotalCount = () => {
    const {currentUser} = this.context
    CommonService.getTotalCount(COMMON_LIST_NAME.CHEF_PAYMENTS, {
      chefId: currentUser.chefId,
    })
      .then(totalCount => {
        this.setState(
          {
            totalCount,
          },
          () => {
            this.fetchData()
          }
        )
      })
      .catch(e => {
        console.log('ERROR on getting total count', e)
        this.setState({
          totalCount: 0,
          isFetching: false,
        })
      })
  }

  fetchData = () => {
    const {currentUser} = this.context
    const {first, offset} = this.state
    PaymentHistoryService.getChefPaymentHistory(currentUser.chefId, first, offset)
  }

  setPaymentHistory = ({newChefpaymentHistory}) => {
    const {paymentHistoryList, totalCount} = this.state
    // const updatePaymentHistoryList = [...paymentHistoryList, ...newChefpaymentHistory]
    this.setState({
      isFetching: false,
      isFetchingMore: false,
      // paymentHistoryList: updatePaymentHistoryList,
      // canLoadMore: updatePaymentHistoryList.length < totalCount,
      paymentHistoryList: newChefpaymentHistory,
      canLoadMore: newChefpaymentHistory.length < totalCount,
    })
  }

  onPaymentCardPress = details => {
    if (details.bookingHistId) {
      const {navigation} = this.props
      navigation.navigate(RouteNames.BOOKING_DETAIL_SCREEN, {bookingHistId: details.bookingHistId})
    }
  }

  onLoadMore = async () => {
    const {paymentHistoryList, canLoadMore, first} = this.state
    if (!canLoadMore) {
      return
    }
    // const newOffset = paymentHistoryList.length
    const newFirst = paymentHistoryList.length + first
    this.setState(
      {
        // offset: newOffset,
        first: newFirst,
        isFetchingMore: true,
      },
      () => {
        this.fetchData()
      }
    )
  }

  renderRow = ({item: details, index}) => {
    console.log('chef paymentHistory', details)
    let fullName
    let picId
    let paymentPrice
    let bookingDate
    let bookingFromTime
    let bookingToTime
    let location

    if (
      details.customerDetails !== {} &&
      details.customerDetails !== undefined &&
      details.customerDetails !== null
    ) {
      const value = details.customerDetails
      if (value.nodes !== null && value.nodes !== [] && value.nodes !== undefined) {
        if (value.nodes[0].fullName) {
          fullName = value.nodes[0].fullName
        }

        if (value.nodes[0].customerPicId) {
          picId = value.nodes[0].customerPicId
        }

        if (value.nodes[0].customerProfileExtendedsByCustomerId) {
          const customerLocation = value.nodes[0].customerProfileExtendedsByCustomerId
          if (customerLocation.nodes !== null && customerLocation.nodes !== undefined) {
            location = customerLocation.nodes[0].customerLocationAddress
          }
        }
      }
    }

    if (
      details.hasOwnProperty('chefBookingHistoryByBookingHistId') &&
      details.chefBookingHistoryByBookingHistId
    ) {
      const bookingDetails = details.chefBookingHistoryByBookingHistId
      if (
        bookingDetails.hasOwnProperty('chefBookingPriceValue') &&
        bookingDetails.chefBookingPriceValue &&
        bookingDetails.chefBookingPriceValue !== null
      ) {
        paymentPrice = bookingDetails.chefBookingPriceValue
      }
      if (bookingDetails.chefBookingFromTime) {
        bookingDate = GMTToLocal(bookingDetails.chefBookingFromTime, DATE_TYPE.DATE)
        bookingFromTime = GMTToLocal(bookingDetails.chefBookingFromTime, DATE_TYPE.TIME)
      }
      if (bookingDetails.chefBookingToTime) {
        bookingToTime = GMTToLocal(bookingDetails.chefBookingToTime, DATE_TYPE.TIME)
      }
    }
    return (
      <TouchableOpacity
        onPress={() => this.onPaymentCardPress(details)}
        style={styles.CardContainer}>
        <View style={styles.infoView}>
          <View style={styles.nameViewWrap}>
            <View style={styles.nameView}>
              <Image
                style={styles.userImage}
                source={picId ? {uri: picId} : Images.common.defaultAvatar}
              />

              <View style={styles.nameSpacing}>
                <Text style={styles.nameStyling}>{fullName}</Text>
                <Text>{Languages.payment_history.serviced_received}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="map-marker"
                    type="MaterialCommunityIcons"
                    style={{color: Theme.Colors.primary, fontSize: 18}}
                  />
                  <Text numberOfLines={1} style={styles.messageDescription}>
                    {location}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginVertical: 2}}>
                  <Icon name="calendar" style={{color: Theme.Colors.primary, fontSize: 18}} />
                  <Text style={styles.dateStyling}>{bookingDate}</Text>
                </View>
                <View style={{flexDirection: 'row', marginVertical: 2}}>
                  <Icon name="clock" style={{color: Theme.Colors.primary, fontSize: 18}} />
                  <Text style={styles.itemHourText}>
                    {' '}
                    {bookingFromTime} {'-'} {bookingToTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.dateView}>
            <Text style={styles.dateText}>${paymentPrice}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const {paymentHistoryList, isFetching, isFetchingMore, canLoadMore} = this.state
    console.log('chef paymentHistoryList', paymentHistoryList)
    const {navigation} = this.props
    return (
      <View style={{flex: 1}}>
        <Header
          showBack
          navigation={navigation}
          showTitle
          title={Languages.payment_history.title}
        />
        {/* <Text
          style={{
            padding: 10,
          }}>
          {Languages.payment_history.payment_received}
        </Text> */}
        <CommonList
          keyExtractor="bankTransferHistId"
          data={paymentHistoryList}
          renderItem={this.renderRow}
          isFetching={isFetching}
          isFetchingMore={isFetchingMore}
          canLoadMore={canLoadMore}
          loadMore={this.onLoadMore}
          reload={this.reload}
          emptyDataMessage="No Payments history found."
        />
      </View>
    )
  }
}
ChefPaymentHistory.contextType = AuthContext

export default ChefPaymentHistory
