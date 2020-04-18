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
import {View, ScrollView, Alert, TouchableOpacity, Image, BackHandler, AsyncStorage} from 'react-native'
import {Header, Spinner, CommonButton} from '@components'
import {ChefProfileService, PROFILE_DETAIL_EVENT, TabBarService,
   BookingHistoryService, BOOKING_HISTORY_LIST_EVENT,
   BasicProfileService, UPDATE_BASIC_PROFILE_EVENT,
   NotificationListService, NOTIFICATION_LIST_EVENT,
   CommonService, COMMON_LIST_NAME,
   BOOKING_HISTORY_UPDATING_VAlUE,
  } from '@services'
import {RouteNames, ResetStack} from '@navigation'
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
      isFetching: true,
      requestList: [],
      reviewCount: 0,
      earnings: 0,
      reviewList: [],
      reservationList: [],
      isEmailVerified: false,
      isMobileVerified: false,
      chefStatus: '',
      profile: {}
      
    }
  }

  async componentDidMount() {
    const {currentUser, isLoggedIn, getProfile, isChef} = this.context
    const {navigation} = this.props
    BookingHistoryService.on(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_UPDATING, this.reload)
    BookingHistoryService.on(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_UPDATING_VAlUE, this.reload)

    const profile = await getProfile()
    this.setState({profile})
    if (!profile.isRegistrationCompletedYn) {
      ResetStack(navigation, RouteNames.CHEF_REG_PROFILE)
      this.setState({isFetching: false})
    } else {
    ChefProfileService.on(PROFILE_DETAIL_EVENT.GET_CHEF_FULL_PROFILE_DETAIL, this.setList)
    BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updateInfo)
    NotificationListService.on(
      NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST,
      this.loadNotification()
    )
    this.onAddBackHandler()
    // this.loadData()
    if (isLoggedIn === true) {
      if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
        if (isLoggedIn && isChef && currentUser.chefId) {
          BookingHistoryService.bookingSubsByChef(currentUser.chefId)
          BasicProfileService.profileSubscriptionForChef(currentUser.chefId)
        } 
        this.setState(
          {
            chefIdValue: currentUser,
            isFetching: true,
          },
          async () => {
            this.fetchData()
          }
        )
         // opening notification
        await firebase
        .notifications()
        .getInitialNotification()
        .then(async notificationOpen => {
          console.log('notificationOpen', notificationOpen , await AsyncStorage.getItem('notificationId'))
          if (notificationOpen) {
            const {notification} = notificationOpen
            try {
              // get last seen notification
              const lastSeenNotificationId = await AsyncStorage.getItem('notificationId')
  
              // if some notification seen already
              if (lastSeenNotificationId !== null) {
                // check if old notification see to new notification
                if (lastSeenNotificationId === notification.notificationId) {
                  console.log('same notification id')
                  const notificationData = await AsyncStorage.getItem('notificationData')
                  if (notificationData !== null) {
                    const value = JSON.parse(notificationData)
                    console.log('value11111', value)
                    if (value) {
                      console.log('if notification id')
                      if (value.bookingHistId) {
                        NotificationListService.navigateAndMarkBookingNotification(
                          navigation,
                          value.bookingHistId,
                          value.seen,
                          value.data
                        )
                        await AsyncStorage.removeItem('notificationData')
                      } else if (value.conversationHistId) {
                        NotificationListService.navigateAndMarkMessageNotification(
                          navigation,
                          value.conversationHistId,
                          value.seen,
                          value.data,
                          value.name,
                          value.pic,
                          value.statusId,
                          value.bookingHistId,
                          value.fromTime,
                          value.toTime
                        )
                      }
                      await AsyncStorage.removeItem('notificationData')
                    }
                  } else {
                    console.log('else notification id')
                    return
                  }
                }
                await AsyncStorage.setItem('notificationId', notification.data.notificationHistId)
                this.navigateToNotification(notification)
              }
              // if no notification is seen last and this is 1st notification
              else {
                await AsyncStorage.setItem('notificationId', notification.data.notificationHistId)
                this.navigateToNotification(notification)
              }
            } catch (e) {
              // don't mind, this is a problem only if the current RN instance has been reloaded by a CP mandatory update
            }
  
            console.log('notification booking request', notification, notification.data.role)
            await AsyncStorage.setItem('notificationId', notification.notificationId)
          }
        })
        .catch((e) => {
          console.log('Notification error', e)
        })
      }

  

  
    }
  }
    console.log('currentUserFirebase', this.context)
  }

  navigateToNotification = async notification => {
    console.log('navigateToNotification', notification)
    const {currentUser, isLoggedIn, isChef} = this.context
    const {navigation} = this.props

    if (
      notification &&
      notification.data &&
      notification.data.role === 'CHEF' &&
      notification.data.notificationHistId
    ) {
      const data = {
        pChefId: isLoggedIn && isChef ? currentUser.chefId : null,
        pCustomerId: isLoggedIn && !isChef ? currentUser.customerId : null,
        pAdminId: null,
        pStatusId: 'SEEN',
        pNotificationId: notification.data.notificationHistId,
      }
      if (notification.data.bookingHistId) {
        NotificationListService.navigateAndMarkBookingNotification(
          navigation,
          notification.data.bookingHistId,
          true,
          data
        )
      } else if (notification.data.conversationHistId) {
        NotificationListService.navigateAndMarkMessageNotification(
          navigation,
          notification.data.conversationHistId,
          true,
          data,
          notification.data.name,
          notification.data.pic,
          notification.data.statusId,
          notification.data.bookingHistId,
          notification.data.fromTime,
          notification.data.toTime
        )
      }
    } else {
      console.log('notification else', notification)
      const data = {
        pChefId: isLoggedIn && isChef ? currentUser.chefId : null,
        pCustomerId: isLoggedIn && !isChef ? currentUser.customerId : null,
        pAdminId: null,
        pStatusId: 'SEEN',
        pNotificationId: notification.data.notificationHistId,
      }
      let obj = {}
      if (notification.data.bookingHistId) {
        obj = {
          navigation,
          bookingHistId: notification.data.bookingHistId,
          seen: true,
          data,
        }
      } else if (notification.data.conversationHistId) {
        obj = {
          navigation,
          conversationHistId: notification.data.conversationHistId,
          seen: true,
          data,
          name: notification.data.name,
          pic: notification.data.pic,
          statusId: notification.data.statusId,
        }
      }
      await AsyncStorage.setItem('notificationData', JSON.stringify(obj))
      Alert.alert(
        'Info',
        'Hi, you have recieved notification for your customer account. Please click ok to switch to customer and see the notification.',
        [
          {text: 'OK', onPress: () => this.onSwitchUser()},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false}
      )
    }
  }

  loadNotification = () => {
    const {isLoggedIn, currentUser, isChef} = this.context

    if (isLoggedIn) {
      if (isChef) {
        this.onLoadNotificationTotalCount(COMMON_LIST_NAME.CHEF_UNREAD_COUNT, {
          chefId: currentUser.chefId,
        })
      } else {
        this.onLoadNotificationTotalCount(COMMON_LIST_NAME.CUSTOMER_UNREAD_COUNT, {
          customerId: currentUser.customerId,
        })
      }
    }
  }

  onLoadNotificationTotalCount = (type, filter) => {
    const {isLoggedIn} = this.context
    if (isLoggedIn) {
      CommonService.getTotalCount(type, filter)
        .then(totalCount => {
          this.setState(
            {
              notificationCount: totalCount,
            },
            async () => {
              await firebase.notifications().setBadge(this.state.notificationCount)
            }
          )
        })
        .catch(e => {
          console.log('debugging error on setting the total count in notification screen', e)
          this.setState({
            notificationCount: 0,
          })
        })
    }
  }

  onAddBackHandler = () => {
    const {navigation} = this.props
    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.onHandleBackButton)
    })
    this.willBlurSubscription = navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.onHandleBackButton)
    })
  }

  onRemoveBackHandler = () => {
    if (this.willFocusSubscription) {
      this.willFocusSubscription.remove()
    }

    if (this.willBlurSubscription) {
      this.willBlurSubscription.remove()
    }
  }

  componentWillUnmount() {
    this.onRemoveBackHandler()
    ChefProfileService.off(PROFILE_DETAIL_EVENT.GET_CHEF_FULL_PROFILE_DETAIL, this.setList)
    BookingHistoryService.off(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_UPDATING, this.reload)
    BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updateInfo)
    BookingHistoryService.off(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_UPDATING_VAlUE, this.reload)
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
        chefStatus: details.chefStatusId.trim(),
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

  fetchData = () => {
    const {currentUser } = this.context
    if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
        ChefProfileService.getChefFullProfileDetail(
          currentUser.chefId,
          moment(new Date())
            .utc()
            .format('YYYY-MM-DDTHH:mm:ss')
        )
    }
  }

  reload = () => {
    this.setState(
      {
        isFetching: true,
      },
      () => {
        this.fetchData()
      }
    )
  }

  updateInfo = () => {
      this.setState(
        {
          isFetching: true,
        },
        () => {
          this.fetchData()
        }
      )
  }

  itemPressed = details => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.BOOKING_DETAIL_SCREEN, {
      bookingHistId: details.chefBookingHistId,
    })
  }

  submitForReview = () => {
    const {isChef, isLoggedIn, currentUser} = this.context

    if (isChef && isLoggedIn) {
      ChefProfileService.submitProfileForReview(currentUser.chefId).then(res => {
        if (res) {
          TabBarService.hideInfo()
          Toast.show({
            text: 'Profile submitted for review',
            duration: 5000,
          })
        } else {
          Alert.alert(
            Languages.customerProfile.alert.error_title,
            Languages.customerProfile.alert.error_2
          )
        }
      })
    }
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
      chefStatus,
      profile,
    } = this.state
    const {navigation} = this.props
    return (
      <View style={styles.mainView}>
        <Header title="Home" showBell={false} />
        {isFetching ? (
          <Spinner mode="full" />
        ) : (
          <ScrollView style={{marginHorizontal: '5%', paddingBottom: '10%'}}>
            <Card style={styles.cardStyle}>
              <Label style={styles.label}>Alerts</Label>
              <Text style={{color: '#08AB93', fontWeight: 'bold'}}>
                Your profile status :
              </Text>
              {chefStatus.trim() === 'SUBMITTED_FOR_REVIEW' && (
                <View style={styles.statusView}>
                  {/* <Button transparent> */}
                    <Text style={styles.statusTextColor}>
                      {Languages.customerProfile.label.submitted_for_review}
                    </Text>
                  {/* </Button> */}
                  <Text>{Languages.customerProfile.messages.submited_for_review_msg}</Text>
                </View>
              )}
              {chefStatus.trim() === 'PENDING' && (
                    <View style={styles.statusView}>
                  <CommonButton
                  btnText="Submit for Review"
                  textStyle={{fontSize: 15}}
                  containerStyle={styles.primaryBtn}
                  onPress={() => this.submitForReview()}
                />
                      <Text>{Languages.customerProfile.messages.review_pending_msg}</Text>
                    </View>
              )}
              {chefStatus.trim() === 'REJECTED' && (
                  <View style={styles.statusView}>
                 <CommonButton
                  btnText="Submit for Review"
                  textStyle={{fontSize: 15}}
                  containerStyle={styles.primaryBtn}
                  onPress={() => this.submitForReview()}
                />
                    <Text style={styles.statusTextColorReject}>
                      {Languages.customerProfile.messages.review_rejected_msg}{' '}
                    </Text>
                    <Text style={styles.reasonText}>Reason: {profile.chefRejectOrBlockReason}</Text>
                  </View>
              )}

              {chefStatus.trim() === 'APPROVED' && (
                          <View style={styles.statusView}>
                            <Text style={styles.statusTextColor}>
                              {Languages.customerProfile.label.profile_verified}
                            </Text>
                          </View>
              )}
              {/* {(chefStatus.trim() == 'PENDING' || chefStatus.trim() == 'REJECTED') && (
                <CommonButton
                  btnText="Submit for Review"
                  textStyle={{fontSize: 15}}
                  containerStyle={styles.primaryBtn}
                  onPress={() => this.submitForReview()}
                />
              )} */}
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
