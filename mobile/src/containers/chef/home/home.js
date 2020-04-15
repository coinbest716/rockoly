/** @format */
import React, {Component} from 'react'
import {
  Text,
  Item,
  Icon,
  Label,
  Card,
  CheckBox,
  Body,
  Button,
  Right,
  Input,
  Toast,
} from 'native-base'
import {Images} from '@images'
import moment from 'moment'
import firebase from 'react-native-firebase'
import {View, ScrollView, Alert, TouchableOpacity, Image} from 'react-native'
import {Header, Spinner} from '@components'
import {ChefProfileService, PROFILE_DETAIL_EVENT} from '@services'
import {RouteNames} from '@navigation'
import {Languages} from '@translations'
import {Theme} from '@theme'
import {
  GMTToLocal,
  fetchDate,
  DATE_TYPE,
  commonDateFormat,
  displayDateFormat,
  displayDateTimeFormat,
} from '@utils'
import {AuthContext} from '../../../AuthContext'
import styles from './styles'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chefIdValue: {},
      isFetching: false,
      requestList: [],
      reviewCount: 0,
      earnings: 0,
      reviewList: [],
      reservationList: [],
      isEmailVerified: false,
      isMobileVerified: false,
    }
  }

  async componentDidMount() {
    ChefProfileService.on(PROFILE_DETAIL_EVENT.GET_CHEF_FULL_PROFILE_DETAIL, this.setList)
    const {isLoggedIn, currentUser} = this.context
    // this.loadData()
    if (isLoggedIn === true) {
      if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
        this.setState(
          {
            chefIdValue: currentUser,
            isFetching: true,
          },
          () => {
            ChefProfileService.getChefFullProfileDetail(
              currentUser.chefId,
              moment(new Date())
                .utc()
                .format('YYYY-MM-DDTHH:mm:ss')
            )
          }
        )
      }
    }

    const {currentUserFirebase} = firebase.auth()
    console.log('currentUserFirebase', currentUserFirebase)
  }

  componentWillUnmount() {
    ChefProfileService.off(PROFILE_DETAIL_EVENT.GET_CHEF_FULL_PROFILE_DETAIL, this.setList)
  }

  setList = ({profileFullDetails}) => {
    this.setState({
      isFetching: false,
    })
    console.log('profileFullDetails', profileFullDetails)
    if (firebase.auth()._user.emailVerified === false) {
      this.setState({isEmailVerified: false})
    } else {
      this.setState({isEmailVerified: true})
    }
    if (firebase.auth()._user.phoneNumber) {
      this.setState({isMobileVerified: true})
    } else {
      this.setState({isMobileVerified: false})
    }
    if (profileFullDetails && profileFullDetails.chefProfileByChefId) {
      console.log('listData if', profileFullDetails.chefProfileByChefId)
      const details = profileFullDetails.chefProfileByChefId
      const request = details.outstandingRequests
      const review = details.reviews
      const reservations = details.futureReservations
      const requestList = request && request.nodes.length > 0 ? request.nodes : []
      const earnings = details.totalEarnings ? details.totalEarnings : 0.0
      const reviewCount = details.totalReviewCount ? details.totalReviewCount : 0
      const reviewList = review && review.nodes.length > 0 ? review.nodes : []
      const reservationsList =
        reservations && reservations.nodes.length > 0 ? reservations.nodes : []
      this.setState({
        requestList,
        earnings,
        reviewCount,
        reviewList,
        reservationsList,
      })
    } else {
      this.setState({
        requestList: [],
        earnings: 0,
        reviewCount: 0,
        reviewList: [],
        reservationsList: [],
      })
    }
  }

  itemPressed = details => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.BOOKING_DETAIL_SCREEN, {
      bookingHistId: details.chefBookingHistId,
    })
  }

  // async componentDidMount() {
  //   const {getProfile} = this.context
  //   const profile = await getProfile()
  //   if (
  //     profile.hasOwnProperty('defaultStripeUserId') &&
  //     profile.defaultStripeUserId &&
  //     profile.defaultStripeUserId !== null
  //   ) {
  //     this.setState({
  //       bankAccount: false,
  //       isFetching: false,
  //     })
  //   } else {
  //     this.setState({
  //       bankAccount: true,
  //       isFetching: false,
  //     })
  //   }
  // }
  render() {
    const {
      bankAccount,
      isFetching,
      reviewList,
      requestList,
      reservationsList,
      reviewCount,
      earnings,
      isMobileVerified,
      isEmailVerified,
    } = this.state
    const {navigation} = this.props
    return (
      <View style={styles.mainView}>
        <Header title="Home" showBell={false} />
        {isFetching ? (
          <Spinner mode="full" />
        ) : (
          <ScrollView style={{marginHorizontal: '5%', paddingBottom: '10%'}}>
            {/* {bankAccount === true && ( */}
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Alerts</Label>

              {isEmailVerified ? (
                <Text style={{color: '#08AB93', fontWeight: 'bold'}}>
                  Email address has been verified
                </Text>
              ) : (
                <Text style={{color: 'red', fontWeight: 'bold'}}>
                  You didn't verify your email address
                </Text>
              )}
              {isMobileVerified ? (
                <Text style={{color: '#08AB93', fontWeight: 'bold'}}>
                  Mobile Number has been verified
                </Text>
              ) : (
                <Text style={{color: 'red', fontWeight: 'bold'}}>
                  You didn't verify your mobile number
                </Text>
              )}
            </Card>
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Requests</Label>
              {requestList && requestList.length > 0 ? (
                <View>
                  {requestList.map((request, key) => {
                    let picId
                    if (request.customerProfileByCustomerId.customerPicId) {
                      picId = request.customerProfileByCustomerId.customerPicId
                    }
                    return (
                      <View>
                        {key < 4 && (
                          <Card style={styles.reviewCardStyle}>
                            <View style={styles.parentItem}>
                              <View style={styles.item}>
                                <TouchableOpacity
                                  style={styles.infoView}
                                  onPress={() => this.itemPressed(request)}>
                                  <View style={{flex: 1}}>
                                    <Image
                                      style={styles.userImage}
                                      source={picId ? {uri: picId} : Images.common.defaultAvatar}
                                    />
                                  </View>
                                  <View style={styles.nameSpacing}>
                                    <Text style={styles.itemTitleText}>
                                      {request.customerProfileByCustomerId.fullName}
                                    </Text>

                                    <View style={{flexDirection: 'row'}}>
                                      <Icon
                                        name="calendar"
                                        style={{color: Theme.Colors.primary, fontSize: 18}}
                                      />
                                      <Text style={styles.dateStyling}>
                                        {GMTToLocal(request.chefBookingFromTime, DATE_TYPE.DATE)}
                                      </Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                      <Icon
                                        name="clock"
                                        style={{color: Theme.Colors.primary, fontSize: 18}}
                                      />
                                      <Text>
                                        {' '}
                                        {GMTToLocal(
                                          request.chefBookingFromTime,
                                          DATE_TYPE.TIME
                                        )}{' '}
                                        {'-'}
                                        {GMTToLocal(request.chefBookingToTime, DATE_TYPE.TIME)}
                                      </Text>
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Card>
                        )}
                      </View>
                    )
                  })}
                  <View>
                    {requestList.length >= 4 && (
                      <Button
                        style={styles.moreBtn}
                        onPress={() => navigation.navigate(RouteNames.BOOKING_REQUEST_STACK)}>
                        <Text style={styles.moreText}>
                          {Languages.booking_History.buttonLabels.more}
                        </Text>
                      </Button>
                    )}
                  </View>
                </View>
              ) : (
                <Text style={styles.textStyle}>{Languages.home.bookingRequests.no_request}</Text>
              )}
            </Card>
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Reviews</Label>
              {reviewList && reviewList.length > 0 ? (
                <View>
                  {reviewList.map(review => {
                    let picId
                    if (review.customerProfileByCustomerId.customerPicId) {
                      picId = review.customerProfileByCustomerId.customerPicId
                    }
                    return (
                      <Card style={styles.reviewCardStyle}>
                        <View style={styles.parentItem}>
                          <View style={styles.item}>
                            <TouchableOpacity
                              style={styles.infoView}
                              onPress={() => this.itemPressed(review)}>
                              <View style={{flex: 1}}>
                                <Image
                                  style={styles.userImage}
                                  source={picId ? {uri: picId} : Images.common.defaultAvatar}
                                />
                              </View>
                              <View style={styles.nameSpacing}>
                                <Text style={styles.itemTitleText}>
                                  {review.customerProfileByCustomerId.fullName}
                                </Text>

                                <View style={{flexDirection: 'row'}}>
                                  <Icon
                                    name="calendar"
                                    style={{color: Theme.Colors.primary, fontSize: 18}}
                                  />
                                  <Text style={styles.dateStyling}>
                                    {GMTToLocal(review.chefBookingFromTime, DATE_TYPE.DATE)}
                                  </Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                  <Icon
                                    name="clock"
                                    style={{color: Theme.Colors.primary, fontSize: 18}}
                                  />
                                  <Text>
                                    {' '}
                                    {GMTToLocal(review.chefBookingFromTime, DATE_TYPE.TIME)} {'-'}
                                    {GMTToLocal(review.chefBookingToTime, DATE_TYPE.TIME)}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Card>
                    )
                  })}
                </View>
              ) : (
                <Text style={styles.textStyle}>{Languages.home.reviews.no_review}</Text>
              )}
            </Card>
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Stats</Label>
              {reviewCount > 0 && (
                <View>
                  <Text style={styles.statsStyle}>Review : {reviewCount}</Text>
                </View>
              )}
              {earnings > 0 && (
                <View>
                  <Text style={styles.statsStyle}>Total Earnings : {earnings.toFixed(2)}</Text>
                </View>
              )}
              {reviewCount == 0 && earnings == 0 && (
                <Text style={styles.textStyle}>{Languages.home.stats.no_stats}</Text>
              )}
            </Card>
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Reservations</Label>
              {reservationsList && reservationsList.length > 0 ? (
                <View>
                  {reservationsList.map((reservation, keys) => {
                    let picId
                    if (reservation.customerProfileByCustomerId.customerPicId) {
                      picId = reservation.customerProfileByCustomerId.customerPicId
                    }
                    return (
                      <View>
                        {keys < 4 && (
                          <Card style={styles.reviewCardStyle}>
                            <View style={styles.parentItem}>
                              <View style={styles.item}>
                                <TouchableOpacity
                                  style={styles.infoView}
                                  onPress={() => this.itemPressed(reservation)}>
                                  <View style={{flex: 1}}>
                                    <Image
                                      style={styles.userImage}
                                      source={picId ? {uri: picId} : Images.common.defaultAvatar}
                                    />
                                  </View>
                                  <View style={styles.nameSpacing}>
                                    <Text style={styles.itemTitleText}>
                                      {reservation.customerProfileByCustomerId.fullName}
                                    </Text>

                                    <View style={{flexDirection: 'row'}}>
                                      <Icon
                                        name="calendar"
                                        style={{color: Theme.Colors.primary, fontSize: 18}}
                                      />
                                      <Text style={styles.dateStyling}>
                                        {GMTToLocal(
                                          reservation.chefBookingFromTime,
                                          DATE_TYPE.DATE
                                        )}
                                      </Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                      <Icon
                                        name="clock"
                                        style={{color: Theme.Colors.primary, fontSize: 18}}
                                      />
                                      <Text>
                                        {' '}
                                        {GMTToLocal(
                                          reservation.chefBookingFromTime,
                                          DATE_TYPE.TIME
                                        )}{' '}
                                        {'-'}
                                        {GMTToLocal(reservation.chefBookingToTime, DATE_TYPE.TIME)}
                                      </Text>
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Card>
                        )}
                      </View>
                    )
                  })}
                  <View>
                    {reservationsList.length >= 4 && (
                      <Button
                        style={styles.moreBtn}
                        onPress={() => navigation.navigate(RouteNames.BOOKING_HISTORY)}>
                        <Text style={styles.moreText}>
                          {Languages.booking_History.buttonLabels.more}
                        </Text>
                      </Button>
                    )}
                  </View>
                </View>
              ) : (
                <Text style={styles.textStyle}>{Languages.home.reservations.no_reservations}</Text>
              )}
            </Card>
          </ScrollView>
        )}
      </View>
    )
  }
}
Home.contextType = AuthContext
export default Home
