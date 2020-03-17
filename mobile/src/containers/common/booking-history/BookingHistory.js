/** @format */

import React, {PureComponent} from 'react'
import {View, Text, Image, TouchableOpacity, Alert, Dimensions, Modal} from 'react-native'
import {Calendar} from 'react-native-calendars'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {ListItem, Button, Icon, Item, Picker} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import {Images} from '@images'
import {Languages} from '@translations'
import {CommonButton, Header, Spinner, CommonList} from '@components'
import {RouteNames} from '@navigation'
import styles from './styles'
import {GQL} from '@common'
import {Theme} from '@theme'
import {GMTToLocal, DATE_TYPE, displayDateFormat, displayDateTimeFormat} from '@utils'
import {AuthContext} from '../../../AuthContext'
import BookingHistoryService, {
  BOOKING_HISTORY_LIST_EVENT,
} from '../../../services/BookingHistoryService'
import {SettingsService, SETTING_KEY_NAME, COMMON_LIST_NAME, CommonService} from '@services'
import BookingModal from '../booking-modal/Modal'

const customerData = [
  {
    label: 'All',
    value: [
      '"CUSTOMER_REQUESTED"',
      '"CHEF_ACCEPTED"',
      '"COMPLETED"',
      '"AMOUNT_TRANSFER_FAILED"',
      '"AMOUNT_TRANSFER_SUCCESS"',
      '"CHEF_REJECTED"',
      '"CANCELLED_BY_CHEF"',
      '"CANCELLED_BY_CUSTOMER"',
      '"PAYMENT_PENDING"',
      '"PAYMENT_FAILED"',
      '"REFUND_AMOUNT_SUCCESS"',
      '"REFUND_AMOUNT_FAILED"',
      '"CHEF_REQUESTED_AMOUNT"',
    ],
  },
  {
    label: 'Requested',
    value: '"CUSTOMER_REQUESTED"',
  },
  {
    label: 'Accepted',
    value: '"CHEF_ACCEPTED"',
  },
  {
    label: 'Completed',
    value: ['"COMPLETED"', '"AMOUNT_TRANSFER_FAILED"', '"AMOUNT_TRANSFER_SUCCESS"'],
  },
  {
    label: 'Rejected',
    value: '"CHEF_REJECTED"',
  },
  {
    label: 'Cancelled',
    value: ['"CANCELLED_BY_CHEF"', '"CANCELLED_BY_CUSTOMER"'],
  },
  {
    label: 'Draft/Failed',
    value: ['"PAYMENT_PENDING"', '"PAYMENT_FAILED"'],
  },
  {
    label: 'Refund Success',
    value: ['"REFUND_AMOUNT_SUCCESS"'],
  },
  {
    label: 'Refund Failed',
    value: ['"REFUND_AMOUNT_FAILED"'],
  },
  {
    label: 'Requested Amount',
    value: ['"CHEF_REQUESTED_AMOUNT"'],
  },
]

const chefData = [
  {
    label: 'All',
    value: [
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
      '"CHEF_REQUESTED_AMOUNT',
    ],
  },
  {
    label: 'Requested',
    value: '"CUSTOMER_REQUESTED"',
  },
  {
    label: 'Accepted',
    value: '"CHEF_ACCEPTED"',
  },
  {
    label: 'Completed',
    value: ['"AMOUNT_TRANSFER_SUCCESS"'],
  },
  {
    label: 'Rejected',
    value: '"CHEF_REJECTED"',
  },
  {
    label: 'Cancelled',
    value: ['"CANCELLED_BY_CHEF"', '"CANCELLED_BY_CUSTOMER"'],
  },
  {
    label: 'Transfer Failed',
    value: ['"COMPLETED"', '"AMOUNT_TRANSFER_FAILED"'],
  },
  {
    label: 'Requested Amount',
    value: ['"CHEF_REQUESTED_AMOUNT"'],
  },
]

class BookingHistory extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      all: [],
      isFetching: false,
      userRole: '',
      acceptModal: false,
      rejectModal: false,
      cancelModal: false,
      completeModal: false,
      bookingItem: {},
      isNextFetching: false,
      first: 50,
      offset: 0,
      refreshing: false,
      bookingStatusValue: '',
      filterValue: '',
      current: [],
      past: [],
      upcoming: [],
      completeMsgModal: false,
      selectFromDate: false,
      selectToDate: false,
      fromDate: '',
      toDate: '',
      defaultStripeId: '',
      bookingCancelTime: 0,
      bookingStartTime: '',
      isFetchingMore: false,
      totalCount: 0,
      canLoadMore: false,
      totalCountStatusValue: 0,
    }
  }

  componentDidMount = async () => {
    const {getProfile, isLoggedIn, isChef, currentUser} = this.context
    const profile = await getProfile()
    // Subscription call
    BookingHistoryService.on(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_UPDATING, this.reload)
    if (isLoggedIn && isChef && currentUser.chefId) {
      BookingHistoryService.bookingSubsByChef(currentUser.chefId)
    } else if (isLoggedIn && !isChef && currentUser.customerId) {
      BookingHistoryService.bookingSubsByCustomer(currentUser.customerId)
    }

    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const startDate = moment([year, month - 1])
    const endDate = moment(startDate).endOf('month')
    const fromDate = startDate.toISOString()
    // .format(dbDateFormat)
    const toDate = endDate.toISOString()
    // .format(dbDateFormat)

    this.setState(
      {
        fromDate,
        toDate,
      },
      () => {
        BookingHistoryService.on(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST, this.setList)
        BookingHistoryService.on(
          BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED,
          this.reload
        )
        this.loadInitialData()
      }
    )

    this.fetchBookingCancelTime()
    // const id = profile && profile.customerId ? profile.customerId : profile.chefId
  }

  componentWillUnmount() {
    BookingHistoryService.off(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST, this.setList)
    BookingHistoryService.off(
      BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED,
      this.reload
    )
    BookingHistoryService.off(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_UPDATING, this.reload)
  }

  reload = () => {
    this.setState(
      {
        first: 50,
        offset: 0,
        all: [],
        totalCount: 0,
        isFetching: true,
      },
      () => {
        this.fetchBookingHistoryCount()
      }
    )
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

  loadInitialData = () => {
    const {userRole, isLoggedIn} = this.context
    if (isLoggedIn === true) {
      if (userRole !== undefined && userRole !== '' && userRole !== null) {
        this.setState(
          {
            userRole,
            isFetching: true,
          },
          () => {
            this.fetchBookingHistoryCount()
          }
        )
      }
    }
  }

  fetchBookingHistoryCount = () => {
    const {currentUser, isChef} = this.context
    const {fromDate, toDate, totalCountStatusValue} = this.state
    const fromTime = moment(fromDate)
      .startOf('day')
      .toISOString()
    const toTime = moment(toDate)
      .endOf('day')
      .toISOString()

    let name = ''
    let obj = {}

    if (isChef) {
      name = COMMON_LIST_NAME.CHEF_BOOKING
      obj = {
        startDate: fromTime,
        endDate: toTime,
        chefId: currentUser.chefId,
        statusId: this.getChefStatus(totalCountStatusValue),
      }
    } else {
      name = COMMON_LIST_NAME.CUSTOMER_BOOKING
      obj = {
        startDate: fromTime,
        endDate: toTime,
        customerId: currentUser.customerId,
        statusId: this.getCustomerStatus(totalCountStatusValue),
      }
    }

    CommonService.getTotalCount(name, obj)
      .then(totalCount => {
        console.log('totalCount', totalCount)
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

  getCustomerStatus = index => {
    if (index === 0) {
      return `{CUSTOMER_REQUESTED,CHEF_ACCEPTED, COMPLETED, AMOUNT_TRANSFER_FAILED, AMOUNT_TRANSFER_SUCCESS, CHEF_REJECTED, CANCELLED_BY_CHEF,CANCELLED_BY_CUSTOMER, PAYMENT_PENDING, PAYMENT_FAILED, REFUND_AMOUNT_SUCCESS, REFUND_AMOUNT_FAILED, CHEF_REQUESTED_AMOUNT}`
    }
    if (index === 1) {
      return `{CUSTOMER_REQUESTED}`
    }
    if (index === 2) {
      return `{CHEF_ACCEPTED}`
    }
    if (index === 3) {
      return `{COMPLETED,AMOUNT_TRANSFER_FAILED,AMOUNT_TRANSFER_SUCCESS}`
    }

    if (index === 4) {
      return `{CHEF_REJECTED}`
    }
    if (index === 5) {
      return `{CANCELLED_BY_CHEF, CANCELLED_BY_CUSTOMER}`
    }

    if (index === 6) {
      return `{PAYMENT_PENDING, PAYMENT_FAILED}`
    }
    if (index === 7) {
      return `{REFUND_AMOUNT_SUCCESS}`
    }
    if (index === 8) {
      return `{REFUND_AMOUNT_FAILED}`
    }
    if (index === 9) {
      return `{CHEF_REQUESTED_AMOUNT}`
    }
  }

  getChefStatus = index => {
    if (index === 0) {
      return `{CUSTOMER_REQUESTED,CHEF_ACCEPTED, COMPLETED, AMOUNT_TRANSFER_FAILED, AMOUNT_TRANSFER_SUCCESS, CHEF_REJECTED, CANCELLED_BY_CHEF,CANCELLED_BY_CUSTOMER, PAYMENT_PENDING, PAYMENT_FAILED, REFUND_AMOUNT_SUCCESS, REFUND_AMOUNT_FAILED, CHEF_REQUESTED_AMOUNT}`
    }
    if (index === 1) {
      return `{CUSTOMER_REQUESTED}`
    }
    if (index === 2) {
      return `{CHEF_ACCEPTED}`
    }
    if (index === 3) {
      return `{AMOUNT_TRANSFER_SUCCESS}`
    }

    if (index === 4) {
      return `{CHEF_REJECTED}`
    }
    if (index === 5) {
      return `{CANCELLED_BY_CHEF, CANCELLED_BY_CUSTOMER}`
    }

    if (index === 6) {
      return `{COMPLETED, AMOUNT_TRANSFER_FAILED}`
    }
    if (index === 7) {
      return `{CHEF_REQUESTED_AMOUNT}`
    }
  }

  // updatedList = () => {
  //   // if (bookingData !== null && bookingData !== undefined && bookingData !== '') {
  //   this.loadInitialData()
  //   // }
  // }

  fetchData = async () => {
    const {userRole, currentUser} = this.context
    const {first, offset, bookingStatusValue, fromDate, toDate} = this.state

    const fromTime = moment(fromDate)
      .startOf('day')
      .toISOString()
    const toTime = moment(toDate)
      .endOf('day')
      .toISOString()

    let gqlValue

    if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
      if (userRole === 'CUSTOMER') {
        if (
          currentUser.customerId !== undefined &&
          currentUser.customerId !== null &&
          currentUser.customerId !== ''
        ) {
          // this.setState({isFetching: true})
          gqlValue = GQL.query.booking.listWithFiltersGQLTAG({
            pFromTime: fromTime,
            pToTime: toTime,
            customerId: currentUser.customerId,
            first,
            offset,
            statusId:
              bookingStatusValue === ''
                ? [
                    '"CUSTOMER_REQUESTED"',
                    '"CHEF_ACCEPTED"',
                    '"COMPLETED"',
                    '"AMOUNT_TRANSFER_FAILED"',
                    '"AMOUNT_TRANSFER_SUCCESS"',
                    '"CHEF_REJECTED"',
                    '"CANCELLED_BY_CHEF"',
                    '"CANCELLED_BY_CUSTOMER"',
                    '"PAYMENT_PENDING"',
                    '"PAYMENT_FAILED"',
                    '"REFUND_AMOUNT_SUCCESS"',
                    '"REFUND_AMOUNT_FAILED"',
                    '"CHEF_REQUESTED_AMOUNT"',
                  ]
                : bookingStatusValue,
            // customerId: '5bc10769-c09e-4357-82dd-01bfafa5bfb8',
          })
          BookingHistoryService.getBookingHistoryList(gqlValue)
        }
      } else if (userRole === 'CHEF') {
        if (
          currentUser.chefId !== undefined &&
          currentUser.chefId !== null &&
          currentUser.chefId !== ''
        ) {
          // this.setState({isFetching: true})
          gqlValue = GQL.query.booking.listWithFiltersGQLTAG({
            pFromTime: fromTime,
            pToTime: toTime,
            chefId: currentUser.chefId,
            first,
            offset,
            statusId:
              bookingStatusValue === ''
                ? [
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
                  ]
                : bookingStatusValue,
            // chefId: '1e2e76da-3526-4fac-8b65-f31f7b1fc5ea',
          })
          BookingHistoryService.getBookingHistoryList(gqlValue)
        }
      }
    }
  }

  setList = async ({bookingHistory}) => {
    // this.setState({
    // isNextFetching: false,
    // isFetching: false,
    // isFetchingMore: false,
    // })
    const {totalCount} = this.state
    // if (
    //   bookingHistory !== undefined &&
    //   bookingHistory !== null &&
    //   Object.keys(bookingHistory).length !== 0
    // ) {
    //   if (bookingHistory.hasOwnProperty('listBookingByDateRange')) {
    //     const {nodes} = bookingHistory.listBookingByDateRange
    const currentBooking = []
    const upcomingBooking = []
    const pastBooking = []
    let bookingHistoryValue = []
    let bookingTime = ''
    const now = new Date()
    let date = ''
    // if (nodes.length !== 0 && nodes !== null && nodes !== []) {
    bookingHistoryValue = await bookingHistory.map(item => {
      date = GMTToLocal(now, DATE_TYPE.DATE)
      bookingTime = GMTToLocal(item.chefBookingFromTime, DATE_TYPE.DATE)
      let type = ''
      if (moment(date).isSame(bookingTime)) {
        type = 'TODAY'
      } else if (moment(date).isBefore(bookingTime)) {
        type = 'UPCOMING'
      } else if (moment(date).isAfter(bookingTime)) {
        type = 'PAST'
      }
      return {
        ...item,
        type,
      }
    })
    bookingHistoryValue = _.sortBy(bookingHistoryValue, function(element) {
      const customerSort = {
        TODAY: 1,
        UPCOMING: 2,
        PAST: 3,
      }
      return customerSort[element.type]
    })
    const todayIndex = _.findIndex(bookingHistoryValue, function(x) {
      return x.type === 'TODAY'
    })
    const upcomingIndex = _.findIndex(bookingHistoryValue, function(x) {
      return x.type === 'UPCOMING'
    })
    const pastIndex = _.findIndex(bookingHistoryValue, function(x) {
      return x.type === 'PAST'
    })
    this.setState({
      all: bookingHistoryValue,
      current: currentBooking,
      upcoming: upcomingBooking,
      past: pastBooking,
      todayIndex,
      upcomingIndex,
      pastIndex,
      canLoadMore: bookingHistoryValue.length < totalCount,
      isFetching: false,
      isFetchingMore: false,
    })
    // } else {
    //   this.setState({
    //     all: bookingHistoryValue,
    //     current: currentBooking,
    //     upcoming: upcomingBooking,
    //     past: pastBooking,
    //   })
    // }
    //   }
    // }
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

  onLoadMore = async () => {
    const {first, all, canLoadMore} = this.state
    // const newOffset = favList.length
    const newFirst = all.length + first
    if (!canLoadMore) {
      return
    }
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
        Languages.booking_History.alerts.info_title,
        Languages.booking_History.alerts.booking_cannot_cancel
      )
    }
  }

  onStatusChanged = (value, index) => {
    this.setState(
      {
        bookingStatusValue: value,
        isFetching: true,
        totalCountStatusValue: index,
      },
      () => {
        this.fetchBookingHistoryCount()
      }
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
            {Languages.booking_History.buttonLabels.request}
          </Text>
        )
      }
      if (bookingStatus.trim() === 'CHEF_ACCEPTED') {
        return (
          <Text style={styles.textStyle}>
            {'Status: '}
            {Languages.booking_History.buttonLabels.accept}
          </Text>
        )
      }
      if (bookingStatus.trim() === 'AMOUNT_TRANSFER_SUCCESS') {
        return (
          <Text style={styles.textStyle}>
            {'Status: '}
            {Languages.booking_History.buttonLabels.completed}
          </Text>
        )
      }

      if (bookingStatus.trim() === 'CHEF_REJECTED') {
        return (
          <View style={{justifyContent: 'center'}}>
            <Text adjustsFontSizeToFit style={styles.fialedtextStyle}>
              {'Status: '}
              {Languages.booking_History.buttonLabels.rejected}
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
            <Text adjustsFontSizeToFit style={styles.fialedtextStyle}>
              {'Status: '}
              {Languages.booking_History.buttonLabels.cancelled}
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
            <Text adjustsFontSizeToFit style={styles.fialedtextStyle}>
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
                {Languages.booking_History.buttonLabels.completed}
              </Text>
            )}
            {chefCompleteStatus === true && (
              <Text style={styles.textStyle}>
                {'Status: '}
                {Languages.booking_History.buttonLabels.reviewed}
              </Text>
            )}
          </View>
        )
      }

      if (bookingStatus.trim() === 'AMOUNT_TRANSFER_FAILED') {
        return (
          <View>
            <Text style={styles.fialedtextStyle}>
              {'Status: '}
              {Languages.booking_History.buttonLabels.transfer_failed}
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
      if (bookingStatus.trim() === 'PAYMENT_PENDING' || bookingStatus.trim() === 'PAYMENT_FAILED') {
        return (
          <View>
            <Text style={styles.textStyle}>
              {'Status: '}
              {Languages.booking_History.buttonLabels.payment_pending}
            </Text>
          </View>
        )
      }
    } else if (userRole === 'CUSTOMER') {
      if (bookingStatus.trim() === 'CUSTOMER_REQUESTED') {
        return (
          <View>
            <View style={{justifyContent: 'center'}}>
              <Text adjustsFontSizeToFit style={[styles.textStyle]}>
                {'Status: '}
                {Languages.booking_History.buttonLabels.awaiting}
              </Text>
            </View>
          </View>
        )
      }
      if (bookingStatus.trim() === 'CHEF_ACCEPTED') {
        return (
          <View>
            <Text style={styles.textStyle}>
              {'Status: '}
              {Languages.booking_History.buttonLabels.customer_accept}
            </Text>
          </View>
        )
      }
      if (
        bookingStatus.trim() === 'COMPLETED' ||
        bookingStatus.trim() === 'AMOUNT_TRANSFER_SUCCESS' ||
        bookingStatus.trim() === 'AMOUNT_TRANSFER_FAILED'
      ) {
        return (
          <View>
            {customerCompleteStatus === false && (
              <View>
                <Text style={styles.textStyle}>
                  {'Status: '}
                  {Languages.booking_History.buttonLabels.completed}
                </Text>
              </View>
            )}
            {customerCompleteStatus === true && (
              <Text style={styles.textStyle}>
                {'Status: '}
                Reviewed
              </Text>
            )}
          </View>
        )
      }
      if (bookingStatus.trim() === 'CHEF_REJECTED') {
        return (
          <View style={{justifyContent: 'center'}}>
            <Text adjustsFontSizeToFit style={styles.textStyle}>
              {'Status: '}
              Rejected
            </Text>
          </View>
        )
      }
      if (bookingStatus.trim() === 'REFUND_AMOUNT_SUCCESS') {
        return (
          <View style={{justifyContent: 'center'}}>
            <Text adjustsFontSizeToFit style={styles.textStyle}>
              {'Status: '}
              Refund Success
            </Text>
          </View>
        )
      }
      if (bookingStatus.trim() === 'REFUND_AMOUNT_FAILED') {
        return (
          <View style={{justifyContent: 'center'}}>
            <Text adjustsFontSizeToFit style={styles.textStyle}>
              {'Status: '}
              Refund Failed
            </Text>
          </View>
        )
      }

      if (bookingStatus.trim() === 'PAYMENT_FAILED') {
        return (
          <View>
            <Text style={styles.textStyle}>
              {'Status: '}
              {Languages.booking_History.buttonLabels.payment_pending}
            </Text>
          </View>
        )
      }
      if (bookingStatus.trim() === 'PAYMENT_PENDING') {
        return (
          <View>
            <Text style={styles.textStyle}>
              {'Status: '}
              {Languages.booking_History.buttonLabels.draft}
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
            <Text
              adjustsFontSizeToFit
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                width: Dimensions.get('window').width - 290,
              }}>
              {'Status: '}
              Cancelled
            </Text>
          </View>
        )
      }

      if (bookingStatus.trim() === 'CHEF_REQUESTED_AMOUNT') {
        return (
          <View style={{justifyContent: 'center'}}>
            <Text adjustsFontSizeToFit style={styles.textStyle}>
              {'Status: '}
              Requested Amount
            </Text>
            {/* <Button style={styles.successBtn} onPress={() => this.onViewDetail(details)}> */}
            {/* <TouchableOpacity onPress={() => this.onViewDetail(details)}>
              <Icon name="cash" style={{textAlign: 'center'}} />
            </TouchableOpacity> */}
            {/* </Button> */}
          </View>
        )
      }
    }
  }

  closeCompleteModal = () => {
    this.setState(
      {
        completeMsgModal: false,
      },
      () => {}
    )
  }

  onViewDetail = details => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.BOOKING_DETAIL_SCREEN, {
      bookingHistId: details.chefBookingHistId,
    })
  }

  renderRow = ({item: details, index}) => {
    const {userRole, upcomingIndex, todayIndex, pastIndex, bookingCancelTime} = this.state
    let value
    let picId
    let location
    let statusId
    let fullName
    let bookingDate

    if (
      details.chefBookingStatusId !== undefined &&
      details.chefBookingStatusId !== null &&
      details.chefBookingStatusId !== ''
    ) {
      statusId = details.chefBookingStatusId
    }
    if (userRole === 'CHEF') {
      if (details.chefBookingFromTime) {
        bookingDate = GMTToLocal(details.chefBookingFromTime, DATE_TYPE.DATE)
      }
      if (details.hasOwnProperty('customerProfileByCustomerId')) {
        if (
          details.customerProfileByCustomerId !== undefined &&
          details.customerProfileByCustomerId !== null &&
          Object.keys(details.customerProfileByCustomerId).length !== 0
        ) {
          value = details.customerProfileByCustomerId
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
    } else if (userRole === 'CUSTOMER') {
      if (details.chefBookingFromTime) {
        bookingDate = GMTToLocal(details.chefBookingFromTime, DATE_TYPE.DATE)
      }
      if (details.hasOwnProperty('chefProfileByChefId')) {
        if (
          details.chefProfileByChefId !== undefined &&
          details.chefProfileByChefId !== null &&
          Object.keys(details.chefProfileByChefId).length !== 0
        ) {
          value = details.chefProfileByChefId
          if (value.chefPicId !== undefined && value.chefPicId !== null && value.chefPicId !== '') {
            picId = value.chefPicId
          }

          if (value.fullName !== undefined && value.fullName !== null && value.fullName !== '') {
            fullName = value.fullName
          }

          if (
            value.chefProfileExtendedsByChefId !== undefined &&
            value.chefProfileExtendedsByChefId !== null &&
            value.chefProfileExtendedsByChefId !== ''
          ) {
            if (
              value.chefProfileExtendedsByChefId.hasOwnProperty('nodes') &&
              value.chefProfileExtendedsByChefId.nodes !== undefined &&
              value.chefProfileExtendedsByChefId.nodes.length !== 0 &&
              value.chefProfileExtendedsByChefId.nodes[0] !== null
            ) {
              location = value.chefProfileExtendedsByChefId.nodes[0].chefCity
            }
          }
        }
      }
    }

    return (
      <View>
        {todayIndex === index ? (
          <ListItem itemDivider>
            <Text>{Languages.booking_History.buttonLabels.today}</Text>
          </ListItem>
        ) : null}
        {upcomingIndex === index ? (
          <ListItem itemDivider>
            <Text>{Languages.booking_History.buttonLabels.upcoming}</Text>
          </ListItem>
        ) : null}
        {pastIndex === index ? (
          <ListItem itemDivider>
            <Text>{Languages.booking_History.buttonLabels.past}</Text>
          </ListItem>
        ) : null}
        <View style={styles.parentItem}>
          <View style={styles.item}>
            <TouchableOpacity onPress={() => this.onViewDetail(details)} style={styles.infoView}>
              <View style={{flex: 1}}>
                <Image
                  style={styles.userImage}
                  source={picId ? {uri: picId} : Images.common.defaultAvatar}
                />
              </View>

              <View style={styles.nameSpacing}>
                <Text style={styles.nameStyling}>{fullName}</Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Icon name="calendar" style={{color: Theme.Colors.primary, fontSize: 18}} />
                  <Text style={styles.dateStyling}>{bookingDate}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Icon name="clock" style={{color: Theme.Colors.primary, fontSize: 18}} />
                  <Text style={styles.itemHourText}>
                    {' '}
                    {GMTToLocal(details.chefBookingFromTime, DATE_TYPE.TIME)} {'-'}
                    {GMTToLocal(details.chefBookingToTime, DATE_TYPE.TIME)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.dateView}>
            {this.showStatus(
              statusId,
              details.chefBookingCompletedByCustomerYn,
              details.chefBookingCompletedByChefYn,
              details,
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
      </View>
    )
  }

  // retrieveMore = async () => {
  //   const {all} = this.state
  //   const value1 = all.length + 5
  //   await this.setState(
  //     {
  //       isNextFetching: true,
  //       first: value1,
  //     },
  //     () => {
  //       this.fetchData()
  //     }
  //   )
  // }

  closeModal = type => {
    this.setState({[type]: false})
  }

  onSelectFromDate = () => {
    this.setState({
      selectFromDate: true,
      selectToDate: false,
    })
  }

  onSelectToDate = () => {
    this.setState({
      selectFromDate: false,
      selectToDate: true,
    })
  }

  onDayChange = (day, stateValue, dateValue) => {
    this.setState({
      [dateValue]: false,
      [stateValue]: moment(day.dateString).toISOString(),
    })
    if (stateValue === 'fromDate') {
      this.setState({
        toDate: moment(day.dateString).toISOString(),
      })
    }
  }

  onShowArrow = direction => {
    if (direction === 'left') {
      return <Text>{Languages.booking_History.buttonLabels.previous}</Text>
    }
    return <Text>{Languages.booking_History.buttonLabels.next}</Text>
  }

  onSubmit = () => {
    // this.loadInitialData()
    this.reload()
  }

  render() {
    const {navigation} = this.props
    const {isLoggedIn, isChef} = this.context
    const {
      all,
      // upcoming,
      // cancel,
      // rejected,
      // completed,
      isFetching,
      bookingItem,
      acceptModal,
      rejectModal,
      cancelModal,
      completeModal,
      userRole,
      isNextFetching,
      bookingStatusValue,
      current,
      upcoming,
      past,
      selectFromDate,
      selectToDate,
      fromDate,
      toDate,
      defaultStripeId,
      completeMsgModal,
      bookingStartTime,
      canLoadMore,
      isFetchingMore,
    } = this.state

    let from = ''
    let to = ''
    let value = []

    if (fromDate) {
      from = moment(moment.utc(fromDate).local()).format(displayDateFormat)
    }
    if (toDate) {
      to = moment(moment.utc(toDate).local()).format(displayDateFormat)
    }

    if (isChef) {
      value = chefData
    } else {
      value = customerData
    }
    return (
      <View
        style={[
          styles.container,
          //  {backgroundColor: background}
        ]}>
        {isChef && isLoggedIn === true ? (
          <Header
            showBack
            navigation={navigation}
            showTitle
            title={Languages.booking_History.title}
          />
        ) : (
          <Header
            navigation={navigation}
            showTitle
            title={Languages.booking_History.title}
            showBell
          />
        )}
        {isLoggedIn ? (
          <View style={{flex: 1}}>
            {isLoggedIn && (
              <Item
                picker
                style={{
                  width: 150,
                  justifyContent: 'flex-end',
                  alignSelf: 'flex-end',
                  borderBottomColor: 'white',
                }}>
                <Picker
                  note
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  // style={{width: 150, justifyContent: 'flex-end', alignSelf: 'flex-end'}}
                  placeholder={Languages.booking_History.buttonLabels.selectStatus}
                  placeholderStyle={{color: '#000000'}}
                  placeholderIconColor="#007aff"
                  selectedValue={bookingStatusValue}
                  onValueChange={(value, index) => this.onStatusChanged(value, index)}>
                  {value.map((item, index) => {
                    return <Picker.Item label={item.label} value={item.value} key={index} />
                  })}
                </Picker>
              </Item>
            )}

            {isLoggedIn && (
              <View style={styles.dateViewStyle}>
                <Button style={styles.timeinputStyle} onPress={() => this.onSelectFromDate()}>
                  <Text style={styles.timeTextSelect}>
                    {from || Languages.booking_History.buttonLabels.from_date}
                  </Text>
                </Button>
                <Button style={styles.timeinputStyle} onPress={() => this.onSelectToDate()}>
                  <Text style={styles.timeTextSelect}>
                    {to || Languages.booking_History.buttonLabels.to_Date}
                  </Text>
                </Button>
                <Button style={styles.locationBtn} onPress={() => this.onSubmit()}>
                  <Text style={styles.locationText}>
                    {Languages.booking_History.buttonLabels.submit}
                  </Text>
                </Button>
              </View>
            )}
            <CommonList
              // data={all}
              // renderItem={this.renderRow}
              // extraData={this.state}
              // emptyDataMessage="No Booking Items"
              // reload={this.loadInitialData}

              keyExtractor="chefBookingHistId"
              data={all}
              renderItem={this.renderRow}
              isFetching={isFetching}
              isFetchingMore={isFetchingMore}
              canLoadMore={canLoadMore}
              loadMore={this.onLoadMore}
              reload={this.reload}
              emptyDataMessage={Languages.booking_History.buttonLabels.empty_data_message}
            />
            {acceptModal === true && (
              <BookingModal
                modalVisible={acceptModal}
                closeModal={() => this.closeModal('acceptModal')}
                content={Languages.booking_History.questions.accept}
                bookingDetail={bookingItem}
                type={Languages.booking_History.types.booking_type_accept}
                userRole={userRole}
                navigation={navigation}
                stripeId={defaultStripeId}
              />
            )}
            {rejectModal === true && (
              <BookingModal
                modalVisible={rejectModal}
                closeModal={() => this.closeModal('rejectModal')}
                content={Languages.booking_History.questions.reject}
                bookingDetail={bookingItem}
                type={Languages.booking_History.types.booking_type_reject}
                userRole={userRole}
                navigation={navigation}
                stripeId={defaultStripeId}
              />
            )}
            {cancelModal === true && (
              <BookingModal
                modalVisible={cancelModal}
                closeModal={() => this.closeModal('cancelModal')}
                content={Languages.booking_History.questions.cancel}
                bookingDetail={bookingItem}
                type={Languages.booking_History.types.booking_type_cancel}
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
                  content={Languages.booking_History.questions.complete}
                  bookingDetail={bookingItem}
                  type={Languages.booking_History.types.booking_type_complete}
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
                        {Languages.booking_History.buttonLabels.complete_booking_after}{' '}
                        {bookingStartTime}
                      </Text>
                      <View style={styles.btnView}>
                        <CommonButton
                          btnText={Languages.booking_History.ok}
                          textStyle={{fontSize: 12}}
                          containerStyle={styles.okBtn}
                          onPress={() => this.closeCompleteModal()}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {selectFromDate === true && (
              <Calendar
                // Initially visible month. Default = Date()
                current={new Date()}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                // minDate="2012-05-10"
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                // maxDate="2012-05-30"
                // Handler which gets executed on day press. Default = undefined
                onDayPress={day => {
                  this.onDayChange(day, 'fromDate', 'selectFromDate')
                }}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={day => {
                  console.log('selected day', day)
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat="MMM yyyy"
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={month => {
                  console.log('month changed', month)
                }}
                // Hide month navigation arrows. Default = false
                hideArrows={false}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                renderArrow={direction => this.onShowArrow(direction)}
                // Do not show days of other months in month page. Default = false
                // hideExtraDays
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                // disableMonthChange
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                // hideDayNames
                // Show week numbers to the left. Default = false
                // showWeekNumbers
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={substractMonth => substractMonth()}
                // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
              />
            )}
            {selectToDate === true && (
              <Calendar
                // Initially visible month. Default = Date()
                current={new Date()}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={fromDate}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                // maxDate="2012-05-30"
                // Handler which gets executed on day press. Default = undefined
                onDayPress={day => {
                  this.onDayChange(day, 'toDate', 'selectToDate')
                }}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={day => {
                  console.log('selected day', day)
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat="MMM yyyy"
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={month => {
                  console.log('month changed', month)
                }}
                // Hide month navigation arrows. Default = false
                hideArrows={false}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                renderArrow={direction => this.onShowArrow(direction)}
                // Do not show days of other months in month page. Default = false
                // hideExtraDays
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                // disableMonthChange
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                // hideDayNames
                // Show week numbers to the left. Default = false
                // showWeekNumbers
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={substractMonth => substractMonth()}
                // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
              />
            )}
          </View>
        ) : (
          <View
            style={{
              display: 'flex',
              height: '80%',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Text style={{fontSize: 16}}>Please login to see your Booking History.</Text>
          </View>
        )}
      </View>
    )
  }
}
BookingHistory.contextType = AuthContext

export default BookingHistory
