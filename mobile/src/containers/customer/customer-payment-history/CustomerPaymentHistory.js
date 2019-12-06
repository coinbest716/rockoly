/** @format */
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
  CommonService,
  COMMON_LIST_NAME,
} from '@services'
import {GMTToLocal, DATE_TYPE} from '@utils'
import {Languages} from '@translations'
import {RouteNames} from '@navigation'
import styles from './styles'

class CustomerPaymentHistory extends PureComponent {
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
    PaymentHistoryService.on(PAYMENT_HISTORY_EVENT.CUSTOMER_PAYMENT_HISTORY, this.setPaymentHistory)
    this.onLoadData()
  }

  componentWillUnmount() {
    PaymentHistoryService.off(
      PAYMENT_HISTORY_EVENT.CUSTOMER_PAYMENT_HISTORY,
      this.setPaymentHistory
    )
  }

  reload = () => {
    this.setState(
      {
        totalCount: 0,
        first: 50,
        offset: 0,
        paymentHistoryList: [],
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
    CommonService.getTotalCount(COMMON_LIST_NAME.CUSTOMER_PAYMENTS, {
      customerId: currentUser.customerId,
    })
      .then(totalCount => {
        console.log('debugging totalCount', totalCount)
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
    const {first, offset} = this.state
    const {currentUser} = this.context
    PaymentHistoryService.getCustomerPaymentHistory(currentUser.customerId, first, offset)
  }

  setPaymentHistory = ({newCustomerPaymentHistory}) => {
    const {paymentHistoryList, totalCount} = this.state

    // const updatePaymentHistoryList = [...paymentHistoryList, ...newCustomerPaymentHistory]

    this.setState({
      isFetching: false,
      isFetchingMore: false,
      // paymentHistoryList: updatePaymentHistoryList,
      // canLoadMore: updatePaymentHistoryList.length < totalCount,
      paymentHistoryList: newCustomerPaymentHistory,
      canLoadMore: newCustomerPaymentHistory.length < totalCount,
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
    // const nextOffset = paymentHistoryList.length
    const nextFirst = paymentHistoryList.length + first
    this.setState(
      {
        //  offset: nextOffset,
        first: nextFirst,
        isFetchingMore: true,
      },
      () => {
        this.fetchData()
      }
    )
  }

  renderRow = ({item: details, index}) => {
    console.log('customer paymentHistory', details)
    let fullName
    let picId
    let paymentPrice
    let statusName = ''
    let bookingDate
    let bookingFromTime
    let bookingToTime
    let location

    if (
      details.chefProfileByPaymentDoneForChefId !== {} &&
      details.chefProfileByPaymentDoneForChefId !== undefined &&
      details.chefProfileByPaymentDoneForChefId !== null
    ) {
      const value = details.chefProfileByPaymentDoneForChefId
      if (value.fullName) {
        fullName = value.fullName
      }

      if (value.chefPicId) {
        picId = value.chefPicId
      }

      if (value.chefProfileExtendedsByChefId) {
        const chefLocation = value.chefProfileExtendedsByChefId
        if (chefLocation.nodes !== null && chefLocation.nodes !== undefined) {
          location = chefLocation.nodes[0].chefLocationAddress
        }
      }
    }
    if (
      details.hasOwnProperty('chefBookingHistoryByBookingHistId') &&
      details.chefBookingHistoryByBookingHistId
    ) {
      const bookingDetails = details.chefBookingHistoryByBookingHistId
      if (
        bookingDetails.hasOwnProperty('chefBookingTotalPriceValue') &&
        bookingDetails.chefBookingTotalPriceValue &&
        bookingDetails.chefBookingTotalPriceValue !== null
      ) {
        paymentPrice = bookingDetails.chefBookingTotalPriceValue
      }
      if (bookingDetails.chefBookingFromTime) {
        bookingDate = GMTToLocal(bookingDetails.chefBookingFromTime, DATE_TYPE.DATE)
        bookingFromTime = GMTToLocal(bookingDetails.chefBookingFromTime, DATE_TYPE.TIME)
      }
      if (bookingDetails.chefBookingToTime) {
        bookingToTime = GMTToLocal(bookingDetails.chefBookingToTime, DATE_TYPE.TIME)
      }
    }

    if (details.paymentStatusId.trim() === 'PAID') {
      statusName = Languages.Customer_Payment_History.buttonLabels.paid
    } else if (details.paymentStatusId.trim() === 'REFUND') {
      statusName = Languages.Customer_Payment_History.buttonLabels.refund
    }

    return (
      <TouchableOpacity
        onPress={() => this.onPaymentCardPress(details)}
        style={styles.CardContainer}>
        <View style={styles.infoView}>
          <Image
            style={styles.userImage}
            source={picId ? {uri: picId} : Images.common.defaultAvatar}
          />
          <View style={styles.nameView}>
            <View style={styles.iconNameView}>
              <Text style={styles.nameStyling}>{fullName}</Text>
              <Text style={styles.dateText}>
                {Languages.Customer_Payment_History.buttonLabels.dollar}
                {paymentPrice}
              </Text>
            </View>
            <Text style={styles.dateStyling}>{statusName}</Text>
            <View style={styles.locationView}>
              <Icon
                name="map-marker"
                type="MaterialCommunityIcons"
                style={{color: Theme.Colors.primary, fontSize: 18}}
              />
              <Text numberOfLines={1} style={styles.messageDescription}>
                {location}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: 5, marginVertical: 2}}>
              <Icon name="calendar" style={{color: Theme.Colors.primary, fontSize: 18}} />
              <Text style={styles.dateStyling}>{bookingDate}</Text>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: 5, marginVertical: 2}}>
              <Icon name="clock" style={{color: Theme.Colors.primary, fontSize: 18}} />
              <Text style={styles.itemHourText}>
                {' '}
                {bookingFromTime} {'-'} {bookingToTime}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const {paymentHistoryList, isFetching, isFetchingMore, canLoadMore} = this.state
    console.log('customer paymentHistoryList', paymentHistoryList)
    const {navigation} = this.props
    return (
      <View style={styles.container}>
        <Header
          showBack
          navigation={navigation}
          showTitle
          title={Languages.Customer_Payment_History.title}
        />
        <CommonList
          keyExtractor="paymentHistId"
          data={paymentHistoryList}
          renderItem={this.renderRow}
          isFetching={isFetching}
          isFetchingMore={isFetchingMore}
          loadMore={this.onLoadMore}
          canLoadMore={canLoadMore}
          reload={this.reload}
          emptyDataMessage={Languages.Customer_Payment_History.buttonLabels.no_payments_message}
        />
      </View>
    )
  }
}
CustomerPaymentHistory.contextType = AuthContext

export default CustomerPaymentHistory
