/** @format */

import _ from 'lodash'
import React, {Component} from 'react'
import {
  Platform,
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Modal,
  BackHandler,
  AsyncStorage,
} from 'react-native'
import firebase from 'react-native-firebase'
import {Button, Icon} from 'native-base'
import {ExpandableCalendar, AgendaList, CalendarProvider} from 'react-native-calendars'
import moment from 'moment'
import {GQL, CONSTANTS} from '@common'
import {Theme} from '@theme'
import {Images} from '@images'
import {Spinner, CommonButton} from '@components'
import {Languages} from '@translations'
import {RouteNames, ResetStack} from '@navigation'
import {
  GMTToLocal,
  fetchDate,
  DATE_TYPE,
  commonDateFormat,
  displayDateFormat,
  displayDateTimeFormat,
} from '@utils'
import {
  BookingHistoryService,
  LoginService,
  BOOKING_HISTORY_LIST_EVENT,
  NotificationListService,
  TabBarService,
  SettingsService,
  SETTING_KEY_NAME,
  NOTIFICATION_LIST_EVENT,
  CommonService,
  COMMON_LIST_NAME,
} from '@services'
import {AuthContext} from '../../../AuthContext'
import BookingModal from '../../common/booking-modal/Modal'
import styles from './styles'

class BookingRequest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showInitalLoader: true,
      userRole: '',
      bookingRequest: [],
      group: [],
      bookingDates: [],
      marked: {},
      isFetching: false,
      acceptModal: false,
      rejectModal: false,
      cancelModal: false,
      completeModal: false,
      bookingItem: {},
      completeMsgModal: false,
      defaultStripeId: '',
      bookingCancelTime: 0,
      bookingStartTime: '',
    }
  }

  componentDidMount = async () => {
    const {currentUser, isLoggedIn, isChef, getProfile} = this.context
    const {navigation} = this.props

    if (isLoggedIn) {
      const profile = await getProfile()
      if (!profile.isRegistrationCompletedYn) {
        ResetStack(navigation, RouteNames.CHEF_REG_PROFILE)
      } else {
        this.setState({
          showInitalLoader: false,
        })
        BookingHistoryService.on(
          BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST,
          this.setBookingRequestList
        )
        BookingHistoryService.on(
          BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED,
          this.loadInitialData
        )
        // NotificationListService.on(NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST, this.updatedList)
        // Subscription call
        BookingHistoryService.on(
          BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_UPDATING,
          this.updatedList
        )
        NotificationListService.on(
          NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST,
          this.loadNotification()
        )
        BookingHistoryService.bookingSubsByChef(currentUser.chefId)
        this.onAddBackHandler()
        this.loadInitialData()
        this.checkProfileApproved()
        this.fetchBookingCancelTime()

        // opening notification
        await firebase
          .notifications()
          .getInitialNotification()
          .then(async notificationOpen => {
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
        // if (isLoggedIn) {
        //   const profile = await getProfile()
        //   if (isChef && profile.totalUnreadCount >= 0) {
        //     firebase.notifications().setBadge(profile.totalUnreadCount)
        //   }
        // }
      }
    }
  }

  componentWillUnmount() {
    this.onRemoveBackHandler()
    BookingHistoryService.off(
      BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST,
      this.setBookingRequestList
    )
    BookingHistoryService.off(
      BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED,
      this.loadInitialData
    )
    // NotificationListService.off(
    //   NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST,
    //   this.updatedList
    // )
  }

  onSwitchUser = async () => {
    console.log('onSwitchUser')
    const {navigation} = this.props
    const {isChef, getProfile, updateCurrentUser} = this.context
    const profile = await getProfile()

    this.setState({})

    let switchTo = ''
    let email = ''
    let switchFrom = ''
    if (isChef) {
      email = profile.chefEmail
      switchFrom = CONSTANTS.ROLE.CHEF
      switchTo = CONSTANTS.ROLE.CUSTOMER
    } else {
      email = profile.customerEmail
      switchFrom = CONSTANTS.ROLE.CUSTOMER
      switchTo = CONSTANTS.ROLE.CHEF
    }

    if (email !== '' && switchFrom !== '' && switchTo !== '') {
      LoginService.gqlSwitchRole({email, switchFrom, switchTo})
        .then(async gqlRes => {
          LoginService.onLogin({role: switchTo, gqlRes, updateCurrentUser, navigation})
        })
        .catch(e => {
          console.log('debugging e', e)
          Alert.alert(
            Languages.customerProfile.alert.could_not_switch_account,
            Languages.customerProfile.alert.try_again_to_switch
          )
        })
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

  fetchBookingCancelTime = () => {
    SettingsService.getSettings(SETTING_KEY_NAME.BOOKING_CANCEL_KEY)
      .then(cancelTime => {
        this.setState({
          bookingCancelTime: cancelTime,
        })
      })
      .catch(e => {
        console.log('debugging e', e)
      })
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

  onHandleBackButton = () => {
    Alert.alert(
      Languages.bookingHistory.booking_his_alrt_msg.exit_app,
      Languages.bookingHistory.booking_his_alrt_msg.exit_info,
      [
        {
          text: Languages.bookingHistory.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: Languages.bookingHistory.ok,
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      }
    )
    return true
  }

  checkProfileApproved = async () => {
    const {getProfile, isLoggedIn} = this.context
    const {navigation} = this.props
    if (isLoggedIn) {
      const profile = await getProfile()
      if (profile && profile.chefStatusId) {
        const status = profile.chefStatusId.trim()
        if (status && status !== 'APPROVED' && status !== 'SUBMITTED_FOR_REVIEW') {
          navigation.navigate(RouteNames.CHEF_SETTING_STACK)
          TabBarService.showInfo()
        }
      }
    }
  }

  loadInitialData = async () => {
    const {userRole, isLoggedIn} = this.context
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const startDate = moment([year, month - 1])
    const endDate = moment(startDate).endOf('month')
    const fromDate = startDate.toDate()
    const toDate = endDate.toDate()
    if (isLoggedIn === true) {
      if (userRole !== undefined && userRole !== '' && userRole !== null) {
        this.setState(
          {
            userRole,
          },
          () => {
            this.fetchData(fromDate, toDate)
          }
        )
      }
    }
  }

  updatedList = data => {
    // if (data !== null && data !== undefined && data !== '' && data !== {}) {
    console.log('debugging subscription listened data', data)
    this.loadInitialData()
    // }
  }

  fetchData = (fromDate, toDate) => {
    const {userRole, currentUser} = this.context
    const fromTime = fetchDate(fromDate)
    const toTime = fetchDate(toDate)
    let gqlValue

    if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
      if (userRole === 'CHEF') {
        if (
          currentUser.chefId !== undefined &&
          currentUser.chefId !== null &&
          currentUser.chefId !== ''
        ) {
          this.setState({isFetching: true})
          gqlValue = GQL.query.booking.listWithFiltersGQLTAG({
            pFromTime: fromTime,
            pToTime: toTime,
            chefId: currentUser.chefId,
            statusId: [
              '"CUSTOMER_REQUESTED"',
              '"CHEF_ACCEPTED"',
              '"AMOUNT_TRANSFER_SUCCESS"',
              '"CHEF_REJECTED"',
              '"CANCELLED_BY_CHEF"',
              '"CANCELLED_BY_CUSTOMER"',
              '"COMPLETED"',
              '"AMOUNT_TRANSFER_FAILED"',
              '"REFUND_AMOUNT_SUCCESS"',
              '"REFUND_AMOUNT_FAILED"',
              '"CHEF_REQUESTED_AMOUNT"',
            ],
          })

          BookingHistoryService.getBookingHistoryList(gqlValue)
        }
      }
    }
  }

  setBookingRequestList = ({bookingHistory}) => {
    // if (
    //   bookingHistory !== undefined &&
    //   bookingHistory !== null &&
    //   Object.keys(bookingHistory).length !== 0
    // ) {
    //   if (bookingHistory.hasOwnProperty('listBookingByDateRange')) {
    // const {nodes} = bookingHistory.listBookingByDateRange
    // if (nodes.length !== 0 && nodes !== null && nodes !== []) {
    if (bookingHistory.length > 0) {
      this.setState(
        {
          isFetching: false,
        },
        () => {
          this.onBookingRequest(bookingHistory)
        }
      )
    } else {
      this.setState({
        isFetching: false,
        group: [],
      })
    }
    // }
    // }
  }

  showDate = date => {
    if (date) {
      return moment(date).format(commonDateFormat)
    }
  }

  // showFromTime = fromTime => {
  //   if (fromTime) {
  //     return moment(moment.utc(fromTime).local()).format('hh:mm A')
  //   }
  // }

  // showToTime = toTime => {
  //   if (toTime) {
  //     return moment(moment.utc(toTime).local()).format('hh:mm A')
  //   }
  // }

  showName = detail => {
    if (
      detail &&
      detail.hasOwnProperty('customerProfileByCustomerId') &&
      Object.keys(detail.customerProfileByCustomerId).length !== 0
    ) {
      return detail.customerProfileByCustomerId.fullName
    }
  }

  onBookingRequest = async values => {
    // const temp = []
    const group = []
    // const mainValue = []
    const data = values
    const booking = []
    await data.map(item => {
      const obj = {
        chefBookingCompletedByChefYn: item.chefBookingCompletedByChefYn,
        chefBookingCompletedByCustomerYn: item.chefBookingCompletedByCustomerYn,
        chefBookingDate: moment(moment.utc(item.chefBookingFromTime).local()).format(
          commonDateFormat
        ),
        chefBookingFromTime: item.chefBookingFromTime,
        chefBookingHistId: item.chefBookingHistId,
        chefBookingPriceUnit: item.chefBookingPriceUnit,
        chefBookingPriceValue: item.chefBookingPriceValue,
        chefBookingStatusId: item.chefBookingStatusId,
        chefBookingToTime: item.chefBookingToTime,
        chefId: item.chefId,
        chefProfileByChefId: item.chefProfileByChefId,
        createdAt: item.createdAt,
        customerId: item.customerId,
        customerProfileByCustomerId: item.customerProfileByCustomerId,
        statusTypeMasterByChefBookingStatusId: item.statusTypeMasterByChefBookingStatusId,
        bookingNotes: item.bookingNotes,
        dishTypeDesc: item.dishTypeDesc,
      }
      group.push(obj)
    })
    const groupValue = _.groupBy(group, 'chefBookingDate')
    await Object.keys(groupValue).map((i, keys) => {
      Object.values(groupValue).map((value, key) => {
        if (key === keys) {
          const obj = {
            title: i,
            data: value,
          }
          booking.push(obj)
        }
      })
    })
    const bookingData = _.orderBy(booking, ['title'], ['asc'])
    this.setState({
      group: bookingData,
    })
    const bookingDatesArray = Object.keys(groupValue)
    this.setState(
      {
        bookingDates: bookingDatesArray,
      },
      async () => {
        await this.getMarkedDates()
      }
    )

    // const ITEMS = [
    //   {title: dates[0], data: [{hour: '12am', duration: '1h', title: 'Test data1'}]},
    //   {
    //     title: dates[1],
    //     data: [
    //       {hour: '4pm', duration: '1h', title: 'Test data'},
    //       {hour: '5pm', duration: '1h', title: 'Test data'},
    //     ],
    //   },
    // ]
    // peopleArray.map((value, key) => {

    // })
    // await values.map(item => {
    //   const obj = {
    //     title: this.showDate(item.chefBookingFromTime),
    //     data: [
    //       {
    //         fromTime: this.showFromTime(item.chefBookingFromTime),
    //         toTime: this.showToTime(item.chefBookingToTime),
    //         title: this.showName(item),
    //       },
    //     ],
    //   }
    //   temp.push(obj)
    //   console.log('ITEMS Value', obj)
    // })
    // this.setState({
    //   bookingRequest: temp,
    // })
    // this.setState({
    //   group: groupValue,
    // })
  }

  onDateChanged = (date, updateSource) => {
    // console.log('BookingRequest onDateChanged: ', date, updateSource)
    // fetch and set data for date + week ahead
  }

  onMonthChange = async (month, updateSource) => {
    const monthVal = month.month
    const {year} = month
    const startDate = moment([year, monthVal - 1])
    const endDate = moment(startDate).endOf('month')
    const fromDate = startDate.toDate()
    const toDate = endDate.toDate()
    await this.fetchData(fromDate, toDate)
  }

  getMarkedDates = () => {
    const {bookingDates} = this.state
    // const marked = {}
    // ITEMS.forEach(item => {
    //   // only mark dates with data
    //   // console.log('getMarkedDates', item)
    //   if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
    //     marked[item.title] = {marked: true}
    //   }
    // })
    // bookingRequest.forEach(item => {
    //   // only mark dates with data
    //   console.log('getMarkedDates bookingRequest', item)
    //   if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
    //     marked[item.title] = {marked: true}
    //   }
    // })

    const obj = {}
    bookingDates.map((date, keys) => {
      obj[date] = {marked: true}
    })

    this.setState({
      marked: obj,
    })

    // bookingDates.map((item, key) => {
    //   return {
    //     item: {marked: true},
    //   }
    // })
    // return {
    //   '2019-10-13': {marked: true},
    //   '2019-10-14': {marked: true},
    //   '2019-10-15': {disabled: true},
    // }
  }

  buttonPressed = () => {
    Alert.alert(Languages.bookingHistory.booking_his_alrt_msg.show_more)
  }

  itemPressed = details => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.BOOKING_DETAIL_SCREEN, {
      bookingHistId: details.chefBookingHistId,
    })
  }

  renderEmptyItem = () => {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>{Languages.bookingHistory.no_bookings}</Text>
      </View>
    )
  }

  onShowModal = (type, details) => {
    this.setState(
      {
        [type]: true,
        bookingItem: details,
      },
      () => {}
    )
  }

  onFeedBack = details => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.FEEDBACK_SCREEN, {
      bookingHistId: details.chefBookingHistId,
      bookingDetail: details,
    })
  }

  onCheckComplete = details => {
    const now = new Date()
    let stripeId
    let date = ''
    let bookingTime = ''
    let bookingDate = ''
    let completeTime = ''

    date = GMTToLocal(now, DATE_TYPE.DATE)
    bookingDate = GMTToLocal(details.chefBookingFromTime, DATE_TYPE.DATE)
    bookingTime = GMTToLocal(details.chefBookingFromTime, DATE_TYPE.TIME)

    completeTime = `${bookingDate} ${bookingTime}`

    const diffValue = moment(bookingDate, displayDateFormat).diff(
      moment(date, displayDateFormat),
      'minutes'
    )

    // if (diffValue <= 0) {

    Alert.alert(
      Languages.bookingDetail.alerts.info,
      Languages.bookingDetail.alerts.price_calculation,
      [
        {text: 'Yes', onPress: () => this.seePriceCalculation(details)},
        {text: 'No', onPress: () => this.onCompleteBooking(details)},
      ],
      {
        cancelable: false,
      }
    )
    // } else {
    //   this.setState(
    //     {
    //       completeMsgModal: true,
    //       bookingStartTime: completeTime,
    //     },
    //     () => {}
    //   )
    // }
  }

  seePriceCalculation = details => {
    const {navigation} = this.props
    const from = moment(details.chefBookingFromTime, displayDateTimeFormat)
    const to = moment(details.chefBookingToTime, displayDateTimeFormat)

    const obj = {
      chefId: details.chefId,
      customerId: details.customerId,
      chefBookingFromTime: from,
      chefBookingToTime: to,
      chefProfile: details.chefProfileByChefId,
      summary: details.chefBookingSummary,
      bookingHistId: details.chefBookingHistId,
    }
    console.log('seePriceCalculation', obj, details)

    navigation.navigate(RouteNames.BOOK_PRICE, {bookingData: obj})
  }

  onCompleteBooking = async details => {
    const {getProfile} = this.context
    const profile = await getProfile()

    console.log('onCompleteBooking', profile)
    let stripeId

    if (
      profile.hasOwnProperty('defaultStripeUserId') &&
      profile.defaultStripeUserId &&
      profile.defaultStripeUserId !== null
    ) {
      stripeId = profile.defaultStripeUserId
      this.setState({
        defaultStripeId: stripeId,
      })
    }

    if (stripeId !== undefined && stripeId) {
      this.onShowModal('completeModal', details)
    } else {
      Alert.alert(
        Languages.booking_History.alerts.info_title,
        Languages.booking_History.alerts.add_account_details
      )
    }
  }

  onCheckCancel = (details, cancelTime) => {
    const now = new Date()
    let bookingDate = ''
    let currentDate = ''
    bookingDate = GMTToLocal(details.chefBookingFromTime, DATE_TYPE.DATE)
    currentDate = GMTToLocal(now, DATE_TYPE.DATE)
    const diffValue = moment(bookingDate, displayDateFormat).diff(
      moment(currentDate, displayDateFormat),
      'minutes'
    )

    if (cancelTime < diffValue) {
      this.onShowModal('cancelModal', details)
    } else {
      Alert.alert(
        Languages.bookingHistory.booking_his_alrt_msg.info,
        Languages.bookingHistory.booking_his_alrt_msg.cannot_cancel
      )
    }
  }

  showStatus = (
    bookingStatus,
    customerCompleteStatus,
    chefCompleteStatus,
    details,
    bookingCancelTime
  ) => {
    const {userRole} = this.state
    if (userRole === 'CHEF') {
      if (bookingStatus.trim() === 'CUSTOMER_REQUESTED') {
        return (
          <Text style={styles.textStyle}>
            {'Status: '}
            {Languages.bookingHistory.tabs.request}
          </Text>
        )
      }
      if (bookingStatus.trim() === 'CHEF_ACCEPTED') {
        return (
          <Text style={styles.textStyle}>
            {'Status: '}
            {Languages.bookingHistory.tabs.accept}
          </Text>
        )
      }

      if (bookingStatus.trim() === 'AMOUNT_TRANSFER_SUCCESS') {
        return (
          <Text style={styles.textStyle}>
            {'Status: '}
            {Languages.bookingHistory.tabs.completed}
          </Text>
        )
      }

      if (bookingStatus.trim() === 'CHEF_REJECTED') {
        return (
          <View style={{justifyContent: 'center'}}>
            <Text adjustsFontSizeToFit style={styles.textStyle}>
              {'Status: '}
              {Languages.bookingHistory.tabs.rejected}
            </Text>
          </View>
        )
      }

      if (
        bookingStatus.trim() === 'CANCELLED_BY_CUSTOMER' ||
        bookingStatus.trim() === 'CANCELLED_BY_CHEF'
      ) {
        return (
          <View style={{justifyContent: 'center'}}>
            <Text adjustsFontSizeToFit style={styles.textStyle}>
              {'Status: '}
              {Languages.bookingHistory.tabs.canceled}
            </Text>
          </View>
        )
      }

      if (
        bookingStatus.trim() === 'REFUND_AMOUNT_SUCCESS' ||
        bookingStatus.trim() === 'REFUND_AMOUNT_FAILED'
      ) {
        return (
          <View style={{justifyContent: 'center'}}>
            <Text adjustsFontSizeToFit style={styles.textStyle}>
              {'Status: '}
              Cancelled / Rejected Booking
            </Text>
          </View>
        )
      }

      if (bookingStatus.trim() === 'COMPLETED') {
        return (
          <View>
            {chefCompleteStatus === false && (
              <Text style={styles.textStyle}>
                {'Status: '}
                {Languages.bookingHistory.tabs.completed}
              </Text>
            )}
            {chefCompleteStatus === true && (
              <Text style={styles.textStyle}>
                {'Status: '}
                {Languages.bookingHistory.tabs.reviewed}
              </Text>
            )}
          </View>
        )
      }

      if (bookingStatus.trim() === 'AMOUNT_TRANSFER_FAILED') {
        return (
          <View>
            <Text style={styles.textStyle}>
              {'Status: '}
              {Languages.bookingHistory.transfer_failed}
            </Text>
          </View>
        )
      }

      if (bookingStatus.trim() === 'CHEF_REQUESTED_AMOUNT') {
        return (
          <View>
            <Text style={styles.textStyle}>
              {'Status: '}
              {Languages.booking_History.buttonLabels.requested_amount}
            </Text>
          </View>
        )
      }
    }
  }

  showCompleteModal = () => {
    const {completeMsgModal, bookingItem} = this.state
    let bookingTime = ''
    bookingTime = GMTToLocal(bookingItem.chefBookingFromTime, DATE_TYPE.DATE)
    return (
      <Modal
        animationType="fade"
        transparent
        visible={completeMsgModal}
        onRequestClose={() => this.closeCompleteModal()}>
        <View style={styles.modelView}>
          <View style={styles.completeModelContainer}>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.contentTextStyle}>
                {Languages.bookingHistory.complete_booking} {bookingTime}
              </Text>
              <View style={styles.btnView}>
                <CommonButton
                  btnText={Languages.bookingHistory.ok}
                  textStyle={{fontSize: 12}}
                  containerStyle={styles.primaryBtn}
                  onPress={() => this.closeCompleteModal()}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  closeCompleteModal = () => {
    this.setState(
      {
        completeMsgModal: false,
      },
      () => {}
    )
  }

  renderItem = ({item}) => {
    const {userRole, bookingCancelTime} = this.state
    if (_.isEmpty(item)) {
      return this.renderEmptyItem()
    }
    let value
    let picId
    let location
    let statusId
    let fullName
    if (
      item.chefBookingStatusId !== undefined &&
      item.chefBookingStatusId !== null &&
      item.chefBookingStatusId !== ''
    ) {
      statusId = item.chefBookingStatusId
    }

    if (userRole === 'CHEF') {
      if (item.hasOwnProperty('customerProfileByCustomerId')) {
        if (
          item.customerProfileByCustomerId !== undefined &&
          item.customerProfileByCustomerId !== null &&
          Object.keys(item.customerProfileByCustomerId).length !== 0
        ) {
          value = item.customerProfileByCustomerId
          if (
            value.customerPicId !== undefined &&
            value.customerPicId !== null &&
            value.customerPicId !== ''
          ) {
            picId = value.customerPicId
          }

          if (value.fullName !== undefined && value.fullName !== null && value.fullName !== '') {
            fullName = value.fullName
          }

          if (
            value.customerProfileExtendedsByCustomerId !== undefined &&
            value.customerProfileExtendedsByCustomerId !== null &&
            value.customerProfileExtendedsByCustomerId !== ''
          ) {
            if (
              value.customerProfileExtendedsByCustomerId.hasOwnProperty('nodes') &&
              value.customerProfileExtendedsByCustomerId.nodes !== undefined &&
              value.customerProfileExtendedsByCustomerId.nodes.length !== 0 &&
              value.customerProfileExtendedsByCustomerId.nodes[0] !== null
            ) {
              location = value.customerProfileExtendedsByCustomerId.nodes[0].customerLocationAddress
            }
          }
        }
      }
    }

    return (
      <View style={styles.parentItem}>
        <View style={styles.item}>
          <TouchableOpacity onPress={() => this.itemPressed(item)} style={styles.infoView}>
            <View style={{flex: 1}}>
              <Image
                style={styles.userImage}
                source={picId ? {uri: picId} : Images.common.defaultAvatar}
              />
            </View>
            <View style={styles.nameSpacing}>
              <Text style={styles.itemTitleText}>{this.showName(item)}</Text>

              <View style={{flexDirection: 'row'}}>
                <Icon name="calendar" style={{color: Theme.Colors.primary, fontSize: 18}} />
                <Text style={styles.dateStyling}>
                  {GMTToLocal(item.chefBookingFromTime, DATE_TYPE.DATE)}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon name="clock" style={{color: Theme.Colors.primary, fontSize: 18}} />
                <Text style={styles.itemHourText}>
                  {' '}
                  {GMTToLocal(item.chefBookingFromTime, DATE_TYPE.TIME)} {'-'}
                  {GMTToLocal(item.chefBookingToTime, DATE_TYPE.TIME)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.itemButtonContainer}>
          {this.showStatus(
            statusId,
            item.chefBookingCompletedByCustomerYn,
            item.chefBookingCompletedByChefYn,
            item,
            bookingCancelTime
          )}
        </View>
        <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
          <Icon
            name="map-marker"
            type="MaterialCommunityIcons"
            style={{color: Theme.Colors.primary, fontSize: 18}}
          />
          <Text numberOfLines={2} style={styles.messageDescription}>
            {location}
          </Text>
        </View>
      </View>
    )
  }

  getTheme = () => {
    const themeColor = Theme.Colors.primary
    const lightThemeColor = '#e6efff'
    const disabledColor = '#a6acb1'
    const black = '#20303c'
    const white = '#ffffff'

    return {
      // arrows
      arrowColor: black,
      arrowStyle: {padding: 0},
      // month
      monthTextColor: black,
      textMonthFontSize: 16,
      textMonthFontFamily: 'HelveticaNeue',
      textMonthFontWeight: 'bold',
      // day names
      textSectionTitleColor: black,
      textDayHeaderFontSize: 12,
      textDayHeaderFontFamily: 'HelveticaNeue',
      textDayHeaderFontWeight: 'normal',
      // today
      todayBackgroundColor: lightThemeColor,
      todayTextColor: themeColor,
      // dates
      dayTextColor: themeColor,
      textDayFontSize: 18,
      textDayFontFamily: 'HelveticaNeue',
      textDayFontWeight: '500',
      textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
      // selected date
      selectedDayBackgroundColor: themeColor,
      selectedDayTextColor: white,
      // disabled date
      textDisabledColor: disabledColor,
      // dot (marked date)
      dotColor: themeColor,
      selectedDotColor: white,
      disabledDotColor: disabledColor,
      dotStyle: {marginTop: -2},
    }
  }

  closeModal = type => {
    this.setState({[type]: false})
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

  render() {
    const {
      group,
      marked,
      isFetching,
      bookingItem,
      acceptModal,
      rejectModal,
      cancelModal,
      completeModal,
      userRole,
      defaultStripeId,
      completeMsgModal,
      bookingStartTime,
      showInitalLoader,
    } = this.state
    const {navigation} = this.props

    if (showInitalLoader) {
      return (
        <View style={styles.alignScreenCenter}>
          <Spinner mode="full" animating />
        </View>
      )
    }

    return (
      <CalendarProvider
        date={moment().format(commonDateFormat)}
        onDateChanged={this.onDateChanged}
        onMonthChange={this.onMonthChange}
        theme={{todayButtonTextColor: Theme.Colors.primary}}
        showTodayButton
        disabledOpacity={0.6}
        // todayBottomMargin={16}
      >
        <ExpandableCalendar
          // horizontal={false}
          // hideArrows
          // disablePan
          // hideKnob
          // initialPosition={ExpandableCalendar.positions.OPEN}
          firstDay={1}
          markedDates={marked} // {'2019-06-01': {marked: true}, '2019-06-02': {marked: true}, '2019-06-03': {marked: true}};
          theme={this.getTheme()}
          // leftArrowImageSource={require('../img/previous.png')}
          // rightArrowImageSource={require('../img/next.png')}
          // calendarStyle={styles.calendar}
          // headerStyle={styles.calendar} // for horizontal only
        />
        {isFetching ? (
          <Spinner mode="full" />
        ) : (
          <View style={{flex: 1}}>
            {group.length > 0 ? (
              <AgendaList
                sections={group}
                extraData={this.state}
                renderItem={this.renderItem}
                // sectionStyle={styles.section}
              />
            ) : (
              <View style={styles.noDataView}>
                <Text style={styles.noDataText}>{Languages.bookingHistory.no_booking_items}</Text>
              </View>
            )}
          </View>
        )}
        {acceptModal === true && (
          <BookingModal
            modalVisible={acceptModal}
            closeModal={() => this.closeModal('acceptModal')}
            content={Languages.bookingHistory.booking_his_alrt_msg.accept_request}
            bookingDetail={bookingItem}
            type="ACCEPT"
            userRole={userRole}
            navigation={navigation}
            stripeId={defaultStripeId}
          />
        )}
        {rejectModal === true && (
          <BookingModal
            modalVisible={rejectModal}
            closeModal={() => this.closeModal('rejectModal')}
            content={Languages.bookingHistory.booking_his_alrt_msg.reject_request}
            bookingDetail={bookingItem}
            type="REJECT"
            userRole={userRole}
            navigation={navigation}
            stripeId={defaultStripeId}
          />
        )}
        {cancelModal === true && (
          <BookingModal
            modalVisible={cancelModal}
            closeModal={() => this.closeModal('cancelModal')}
            content={Languages.bookingHistory.booking_his_alrt_msg.cancel_request}
            bookingDetail={bookingItem}
            type="CANCEL"
            userRole={userRole}
            navigation={navigation}
            stripeId={defaultStripeId}
          />
        )}
        {completeModal === true && (
          <View>
            <BookingModal
              modalVisible={completeModal}
              closeModal={() => this.closeModal('completeModal')}
              content={Languages.bookingHistory.booking_his_alrt_msg.sure_complete}
              bookingDetail={bookingItem}
              type="COMPLETE"
              userRole={userRole}
              navigation={navigation}
              stripeId={defaultStripeId}
            />
          </View>
        )}
        {completeMsgModal === true && (
          <Modal
            animationType="fade"
            transparent
            visible={completeMsgModal}
            onRequestClose={() => this.closeCompleteModal()}>
            <View style={styles.modelView}>
              <View style={styles.completeModelContainer}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.contentTextStyle}>
                    {Languages.bookingHistory.complete_booking} {bookingStartTime}
                  </Text>
                  <View style={styles.btnView}>
                    <CommonButton
                      btnText={Languages.bookingHistory.ok}
                      textStyle={{fontSize: 12}}
                      containerStyle={styles.primaryBtn}
                      onPress={() => this.closeCompleteModal()}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </CalendarProvider>
    )
  }
}

BookingRequest.contextType = AuthContext

export default BookingRequest
