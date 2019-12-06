/** @format */

import React, {Component} from 'react'
import {View, Text, ScrollView, Image, Modal, Alert, TouchableOpacity} from 'react-native'
import {Icon, Button} from 'native-base'
import moment from 'moment'
import {Languages} from '@translations'
import {Images} from '@images'
import Styles from './styles'
import {CommonButton, Spinner, Header} from '@components'
import {RouteNames} from '@navigation'
import {GMTToLocal, fetchDate, dbDateFormat, DATE_TYPE, displayDateFormat} from '@utils'
import {AuthContext} from '../../../AuthContext'
import {SettingsService, SETTING_KEY_NAME, FeedbackService, FEEDBACK_EVENT} from '@services'
import BookingDetailService, {BOOKING_DETAIL_EVENT} from '../../../services/BookingDetailService'
import BookingHistoryService, {
  BOOKING_HISTORY_LIST_EVENT,
} from '../../../services/BookingHistoryService'
import NotificationListService, {
  NOTIFICATION_LIST_EVENT,
} from '../../../services/NotificationService'
import BookingModal from '../booking-modal/Modal'

class BookingDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookingDetail: {},
      userRole: '',
      isFetching: false,
      acceptModal: false,
      rejectModal: false,
      cancelModal: false,
      completeModal: false,
      bookingItem: {},
      bookingHistId: '',
      completeMsgModal: false,
      defaultStripeId: '',
      bookingCancelTime: 0,
      bookingStartTime: '',
      bookNowIsYN: false,
    }
  }

  async componentDidMount() {
    BookingDetailService.on(BOOKING_DETAIL_EVENT.BOOKING_DETAIL, this.setList)
    BookingHistoryService.on(
      BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED,
      this.loadInitialData
    )
    FeedbackService.on(FEEDBACK_EVENT.FEEDBACK, this.updateFeedback)
    NotificationListService.on(
      NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST,
      this.updatingData
    )
    BookingDetailService.on(BOOKING_DETAIL_EVENT.BOOKING_DETAIL_SUBS, this.updateBookingDetailSubs)
    const {navigation} = this.props
    if (
      navigation.state.params.bookingHistId !== undefined &&
      navigation.state.params.bookingHistId !== null &&
      navigation.state.params.bookingHistId !== '' &&
      navigation.state.params.bookingHistId
    ) {
      this.setState(
        {
          bookingHistId: navigation.state.params.bookingHistId,
        },
          () => {
          BookingDetailService.getBookingDetailSubs(navigation.state.params.bookingHistId)
          this.loadInitialData()
          this.fetchBookingCancelTime()
        }
      )
    }
  }

  componentWillUnmount() {
    BookingDetailService.off(BOOKING_DETAIL_EVENT.BOOKING_DETAIL, this.setList)
    BookingHistoryService.off(
      BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED,
      this.loadInitialData
    )
    NotificationListService.off(
      NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST,
      this.updatingData
    )
    FeedbackService.off(FEEDBACK_EVENT.FEEDBACK, this.updateFeedback)
    BookingDetailService.off(BOOKING_DETAIL_EVENT.BOOKING_DETAIL_SUBS, this.updateBookingDetailSubs)
  }

  showAlert = () => {
    console.log('showAlert')
    const {bookingDetail} = this.state
    const {navigation} = this.props
    if (
      navigation.state.params.showAlert !== undefined &&
      navigation.state.params.showAlert !== null &&
      navigation.state.params.showAlert !== '' &&
      navigation.state.params.showAlert === true
    ) {
      if (
        bookingDetail !== null &&
        bookingDetail !== undefined &&
        bookingDetail !== {} &&
        Object.keys(bookingDetail).length !== 0
      ) {
        console.log('bookingDetail showAlert', bookingDetail)
        if (
          bookingDetail.chefBookingStatusId &&
          bookingDetail.chefBookingStatusId.trim() === 'CUSTOMER_REQUESTED'
        ) {
          Alert.alert(
            'Info',
            'We have sent a booking request to chef. You will receive notification once chef has confirmed.'
          )
        } else if (
          bookingDetail.chefBookingStatusId &&
          bookingDetail.chefBookingStatusId.trim() === 'PAYMENT_PENDING'
        ) {
          Alert.alert(
            'Info',
            'Sorry Payment failed. We could not send booking request to chef. Please try again later..'
          )
        }
      }
    }
  }

  updateBookingDetailSubs = () => {
    console.log('updateBookingDetailSubs')
    this.loadInitialData()
  }

  updateFeedback = () => {
    this.loadInitialData()
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
            this.fetchData()
          }
        )
      }
    }
  }

  fetchData = () => {
    const {navigation} = this.props
    const {bookingHistId} = this.state
    BookingDetailService.getBookingDetail(bookingHistId)
    if (
      navigation.state.params.bookNow !== undefined &&
      navigation.state.params.bookNow !== null &&
      navigation.state.params.bookNow !== '' &&
      navigation.state.params.bookNow
    ) {
      this.setState({
        bookNowIsYN: navigation.state.params.bookNow,
      })
    }
  }

  updatingData = () => {
    this.loadInitialData()
  }

  setList = ({bookingDetail}) => {
    if (bookingDetail) {
      this.setState(
        {
          isFetching: false,
          bookingDetail,
        },
        () => {
          this.showAlert()
        }
      )
    } else {
      this.setState({
        isFetching: false,
      })
    }
  }

  renderLine = () => {
    return <View style={Styles.border} />
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

  closeModal = type => {
    this.setState({[type]: false})
  }

  onFeedBack = details => {
    const {navigation} = this.props
    const {bookingHistId} = this.state
    navigation.navigate(RouteNames.FEEDBACK_SCREEN, {
      bookingHistId,
      bookingDetail: details,
    })
  }

  onCheckComplete = details => {
    const now = new Date()
    let stripeId
    let currentDate = ''
    let bookingDate = ''
    let bookingTime = ''
    let completeTime = ''
    currentDate = GMTToLocal(now, DATE_TYPE.DATE)
    bookingDate = GMTToLocal(details.chefBookingFromTime, DATE_TYPE.DATE)
    bookingTime = GMTToLocal(details.chefBookingFromTime, DATE_TYPE.TIME)

    completeTime = `${bookingDate} ${bookingTime}`

    const diffValue = moment(bookingDate, displayDateFormat).diff(
      moment(currentDate, displayDateFormat),
      'minutes'
    )

    if (details.hasOwnProperty('chefProfileByChefId') && details.chefProfileByChefId) {
      if (
        details.chefProfileByChefId.hasOwnProperty('defaultStripeUserId') &&
        details.chefProfileByChefId.defaultStripeUserId &&
        details.chefProfileByChefId.defaultStripeUserId !== null
      ) {
        stripeId = details.chefProfileByChefId.defaultStripeUserId
        this.setState({
          defaultStripeId: stripeId,
        })
      }
    }

    // if (moment(currentDate).isSame(bookingDate) || moment(currentDate).isAfter(bookingDate)) {
    // if (diffValue <= 0) {
    if (stripeId !== undefined && stripeId) {
      this.onShowModal('completeModal', details)
    } else {
      Alert.alert(
        Languages.bookingDetail.alerts.info,
        Languages.bookingDetail.alerts.add_bank_detail
      )
    }
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
      console.log('truueeee')
      this.onShowModal('cancelModal', details)
    } else {
      Alert.alert(
        Languages.bookingDetail.alerts.info,
        Languages.bookingDetail.alerts.booking_cannot_be_cancelled
      )
    }
  }

  showStatus = (
    bookingStatus,
    customerCompleteStatus,
    chefCompleteStatus,
    chefReason,
    customerReason,
    bookingDetail,
    userData,
    bookingCancelTime
  ) => {
    const {userRole} = this.state
    if (bookingStatus !== undefined && bookingStatus !== null && bookingStatus !== '') {
      if (userRole === 'CHEF') {
        if (bookingStatus.trim() === 'CUSTOMER_REQUESTED') {
          return (
            <View>
              <Text style={Styles.destext}>
                {userData.fullName} {Languages.bookingDetail.labels.requested_booking}
              </Text>
              <View style={Styles.bookingStatusBtn}>
                <CommonButton
                  btnText={Languages.bookingHistory.accept}
                  textStyle={{fontSize: 12}}
                  containerStyle={Styles.loginButton}
                  onPress={() => this.onShowModal('acceptModal', bookingDetail)}
                />
                <CommonButton
                  btnText={Languages.bookingHistory.reject}
                  textStyle={{fontSize: 12}}
                  containerStyle={Styles.rejectButton}
                  onPress={() => this.onShowModal('rejectModal', bookingDetail)}
                />
              </View>
            </View>
          )
        }
        if (bookingStatus.trim() === 'CHEF_ACCEPTED') {
          return (
            <View>
              <Text style={Styles.destext}>
                {Languages.bookingDetail.alerts.you_accepted_booking}
              </Text>
              <View style={Styles.bookingStatusBtn}>
                {/* {customerCompleteStatus === true ? (
                  <CommonButton
                    btnText={Languages.bookingHistory.complete}
                    textStyle={{fontSize: 12}}
                    containerStyle={Styles.loginButton}
                    onPress={() => this.onShowModal('completeModal', bookingDetail)}
                  />
                ) : (
                  chefCompleteStatus === true && <Text>You have Completed</Text>
                )} */}

                {/* {chefCompleteStatus === true && <Text>You have Completed</Text>} */}

                {chefCompleteStatus === false && (
                  // customerCompleteStatus === false &&
                  <View style={Styles.bookingStatusBtn}>
                    <CommonButton
                      btnText={Languages.bookingHistory.complete}
                      textStyle={{fontSize: 12}}
                      containerStyle={Styles.loginButton}
                      onPress={() => this.onCheckComplete(bookingDetail)}
                    />
                    <CommonButton
                      btnText={Languages.bookingHistory.cancel}
                      textStyle={{fontSize: 12}}
                      containerStyle={Styles.rejectButton}
                      // onPress={() => this.onShowModal('cancelModal', bookingDetail)}
                      onPress={() => this.onCheckCancel(bookingDetail, bookingCancelTime)}
                    />
                  </View>
                )}
              </View>
            </View>
          )
        }
        if (bookingStatus.trim() === 'AMOUNT_TRANSFER_SUCCESS') {
          return (
            <Text style={Styles.destext}>{Languages.bookingDetail.alerts.booking_completed}</Text>
          )
        }

        if (
          bookingStatus.trim() === 'CANCELLED_BY_CUSTOMER' ||
          bookingStatus.trim() === 'CANCELLED_BY_CHEF'
        ) {
          if (customerReason !== undefined && customerReason !== null && customerReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>
                  {userData.fullName} {Languages.bookingDetail.alerts.cancelled_booking}
                </Text>
                <View>
                  <Text style={Styles.heading}>
                    {userData.fullName} {Languages.bookingDetail.labels.reason}
                  </Text>
                  <Text style={Styles.destext}>{customerReason}</Text>
                </View>
              </View>
            )
          }
          if (chefReason !== undefined && chefReason !== null && chefReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>
                  {Languages.bookingDetail.alerts.you_cancelled_booking}
                </Text>
                <View>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.your_reason}</Text>
                  <Text style={Styles.destext}>{chefReason}</Text>
                </View>
              </View>
            )
          }
        }

        if (bookingStatus.trim() === 'CHEF_REJECTED') {
          if (chefReason !== undefined && chefReason !== null && chefReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>{Languages.bookingDetail.alerts.you_rejected} </Text>
                <View>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.your_reason}</Text>
                  <Text style={Styles.destext}>{chefReason}</Text>
                </View>
              </View>
            )
          }
        }

        if (bookingStatus.trim() === 'REFUND_AMOUNT_SUCCESS') {
          if (customerReason !== undefined && customerReason !== null && customerReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>{Languages.bookingDetail.alerts.refund_success}</Text>
                <View>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.your_reason}</Text>
                  <Text style={Styles.destext}>{customerReason}</Text>
                </View>
              </View>
            )
          }
          if (chefReason !== undefined && chefReason !== null && chefReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>{Languages.bookingDetail.alerts.refund_success}</Text>
                <View>
                  <Text style={Styles.heading}>
                    {userData.fullName} {Languages.bookingDetail.labels.reason}
                  </Text>
                  <Text style={Styles.destext}>{chefReason}</Text>
                </View>
              </View>
            )
          }
        }
        if (bookingStatus.trim() === 'REFUND_AMOUNT_FAILED') {
          if (customerReason !== undefined && customerReason !== null && customerReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>{Languages.bookingDetail.alerts.refund_failed}</Text>
                <View>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.your_reason}</Text>
                  <Text style={Styles.destext}>{customerReason}</Text>
                </View>
              </View>
            )
          }
          if (chefReason !== undefined && chefReason !== null && chefReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>{Languages.bookingDetail.alerts.refund_failed}</Text>
                <View>
                  <Text style={Styles.heading}>
                    {userData.fullName} {Languages.bookingDetail.labels.reason}
                  </Text>
                  <Text style={Styles.destext}>{chefReason}</Text>
                </View>
              </View>
            )
          }
        }

        if (
          bookingStatus.trim() === 'COMPLETED' ||
          bookingStatus.trim() === 'AMOUNT_TRANSFER_FAILED'
        ) {
          return (
            <View>
              <Text style={Styles.destext}>{Languages.bookingDetail.alerts.transfer_failed}</Text>
            </View>
          )
        }
      } else if (userRole === 'CUSTOMER') {
        if (bookingStatus.trim() === 'CUSTOMER_REQUESTED') {
          return (
            <View>
              <Text style={Styles.destext}>
                {Languages.bookingDetail.alerts.you_requested_booking}
              </Text>
              <View style={{justifyContent: 'center'}}>
                <Text style={Styles.destext}>{Languages.bookingDetail.labels.awaiting}</Text>
              </View>
              <CommonButton
                btnText={Languages.bookingHistory.cancel}
                textStyle={{fontSize: 12}}
                containerStyle={Styles.rejectButton}
                onPress={() => this.onShowModal('cancelModal', bookingDetail)}
              />
            </View>
          )
        }
        if (bookingStatus.trim() === 'CHEF_ACCEPTED') {
          return (
            <View>
              <Text style={Styles.destext}>
                {userData.fullName} {Languages.bookingDetail.labels.accepted_booking}
              </Text>
              {/* <View style={Styles.bookingStatusBtn}> */}
              {/* {chefCompleteStatus === true ? (
                  <CommonButton
                    btnText={Languages.bookingHistory.complete}
                    textStyle={{fontSize: 12}}
                    containerStyle={Styles.loginButton}
                    onPress={() => this.onShowModal('completeModal', bookingDetail)}
                  />
                ) : (
                  customerCompleteStatus === true && <Text>You have Completed</Text>
                )} */}

              {/* {chefCompleteStatus === true && customerCompleteStatus === false ? (
                  <CommonButton
                    btnText={Languages.bookingHistory.feedback}
                    textStyle={{fontSize: 12}}
                    containerStyle={Styles.loginButton}
                    onPress={() => this.onFeedBack(bookingDetail)}
                    // onPress={() => this.onShowModal('completeModal', bookingDetail)}
                  />
                ) : (
                  customerCompleteStatus === true && <Text>Reviewed</Text>
                )} */}

              {chefCompleteStatus === false && (
                // customerCompleteStatus === false &&
                <View>
                  {/* <CommonButton
                      btnText={Languages.bookingHistory.complete}
                      textStyle={{fontSize: 12}}
                      containerStyle={Styles.loginButton}
                      onPress={() => this.onShowModal('completeModal', bookingDetail)}
                    /> */}
                  <CommonButton
                    btnText={Languages.bookingHistory.cancel}
                    textStyle={{fontSize: 12}}
                    containerStyle={Styles.rejectButton}
                    onPress={() => this.onCheckCancel(bookingDetail, bookingCancelTime)}
                    // onPress={() => this.onShowModal('cancelModal', bookingDetail)}
                  />
                </View>
              )}
            </View>
          )
        }

        // if (bookingStatus.trim() === 'AMOUNT_TRANSFER_SUCCESS') {
        //   return <Text style={Styles.destext}>Booking Completed</Text>
        // }

        if (
          bookingStatus.trim() === 'COMPLETED' ||
          bookingStatus.trim() === 'AMOUNT_TRANSFER_SUCCESS' ||
          bookingStatus.trim() === 'AMOUNT_TRANSFER_FAILED'
        ) {
          return (
            <View>
              {chefCompleteStatus === true && customerCompleteStatus === false && (
                <View>
                  <Text style={Styles.destext}>
                    {Languages.bookingDetail.alerts.booking_completed}
                  </Text>
                  <CommonButton
                    btnText={Languages.bookingHistory.feedback}
                    textStyle={{fontSize: 12}}
                    containerStyle={Styles.loginButton}
                    onPress={() => this.onFeedBack(bookingDetail)}
                    // onPress={() => this.onShowModal('completeModal', bookingDetail)}
                  />
                </View>
              )}
              {chefCompleteStatus === true && customerCompleteStatus === true && (
                <Text style={Styles.destext}>{Languages.bookingDetail.labels.reviewed}</Text>
              )}
            </View>
          )
          // <Text style={Styles.destext}>Booking Completed</Text>
        }
        if (
          bookingStatus.trim() === 'CANCELLED_BY_CUSTOMER' ||
          bookingStatus.trim() === 'CANCELLED_BY_CHEF'
        ) {
          if (customerReason !== undefined && customerReason !== null && customerReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>
                  {Languages.bookingDetail.alerts.you_cancelled_booking}
                </Text>
                <View>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.your_reason}</Text>
                  <Text style={Styles.destext}>{customerReason}</Text>
                </View>
              </View>
            )
          }
          if (chefReason !== undefined && chefReason !== null && chefReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>
                  {userData.fullName} {Languages.bookingDetail.alerts.cancelled_booking}
                </Text>
                <View>
                  <Text style={Styles.heading}>
                    {userData.fullName} {Languages.bookingDetail.labels.reason}
                  </Text>
                  <Text style={Styles.destext}>{chefReason}</Text>
                </View>
              </View>
            )
          }
        }
        if (bookingStatus.trim() === 'REFUND_AMOUNT_SUCCESS') {
          if (customerReason !== undefined && customerReason !== null && customerReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>{Languages.bookingDetail.alerts.refund_success}</Text>
                <View>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.your_reason}</Text>
                  <Text style={Styles.destext}>{customerReason}</Text>
                </View>
              </View>
            )
          }
          if (chefReason !== undefined && chefReason !== null && chefReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>{Languages.bookingDetail.alerts.refund_success}</Text>
                <View>
                  <Text style={Styles.heading}>
                    {userData.fullName} {Languages.bookingDetail.labels.reason}
                  </Text>
                  <Text style={Styles.destext}>{chefReason}</Text>
                </View>
              </View>
            )
          }
        }
        if (bookingStatus.trim() === 'REFUND_AMOUNT_FAILED') {
          if (customerReason !== undefined && customerReason !== null && customerReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>{Languages.bookingDetail.alerts.refund_failed}</Text>
                <View>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.your_reason}</Text>
                  <Text style={Styles.destext}>{customerReason}</Text>
                </View>
              </View>
            )
          }
          if (chefReason !== undefined && chefReason !== null && chefReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>{Languages.bookingDetail.alerts.refund_failed}</Text>
                <View>
                  <Text style={Styles.heading}>
                    {userData.fullName} {Languages.bookingDetail.labels.reason}
                  </Text>
                  <Text style={Styles.destext}>{chefReason}</Text>
                </View>
              </View>
            )
          }
        }
        if (bookingStatus.trim() === 'CHEF_REJECTED') {
          if (chefReason !== undefined && chefReason !== null && chefReason !== '') {
            return (
              <View>
                <Text style={Styles.destext}>
                  {userData.fullName} {Languages.bookingDetail.labels.rejected_booking}
                </Text>
                <View>
                  <Text style={Styles.heading}>
                    {userData.fullName} {Languages.bookingDetail.labels.reason}
                  </Text>
                  <Text style={Styles.destext}>{chefReason}</Text>
                </View>
              </View>
            )
          }
        }
        if (
          bookingStatus.trim() === 'PAYMENT_PENDING' ||
          bookingStatus.trim() === 'PAYMENT_FAILED'
        ) {
          return (
            <View>
              <Text style={Styles.destext}>{Languages.bookingDetail.labels.payment_pending}</Text>
            </View>
          )
        }
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

  // showPaymentStatus = (statusId, bookingDetail, userData) => {
  //   const {userRole} = this.state
  //   if (statusId !== undefined && statusId !== null && statusId !== '') {
  //     if (userRole === 'CUSTOMER') {
  //       if (statusId.trim() === 'PAYMENT_PENDING' || statusId.trim() === 'PAYMENT_FAILED') {
  //         return (
  //           <View>
  //             <Text style={Styles.heading}>Payment Status</Text>
  //             <Text style={Styles.destext}>Payment Pending</Text>
  //           </View>
  //         )
  //       }
  //     } else if (userRole === 'CHEF') {
  //       if (statusId.trim() === 'COMPLETED' || statusId.trim() === 'AMOUNT_TRANSFER_FAILED') {
  //         return (
  //           <View>
  //             <Text style={Styles.heading}>Payment Status</Text>
  //             <Text style={Styles.destext}>Amount Not Transferred</Text>
  //           </View>
  //         )
  //       }
  //     }
  //   }
  // }

  onConversationDetail = (picId, fullName) => {
    const {navigation} = this.props
    const {bookingDetail} = this.state
    navigation.navigate(RouteNames.CHAT_DETAIL, {
      conversationId: bookingDetail.conversationId,
      conversationName: fullName,
      conversationPic: picId,
      bookingStatusId: bookingDetail.chefBookingStatusId,
    })
  }

  render() {
    const {
      bookingDetail,
      userRole,
      isFetching,
      bookingItem,
      acceptModal,
      rejectModal,
      cancelModal,
      completeModal,
      bookingHistId,
      defaultStripeId,
      bookingCancelTime,
      completeMsgModal,
      bookingStartTime,
      bookNowIsYN,
    } = this.state
    const {navigation} = this.props
    const {isChef} = this.context
    let userData = {}
    let fullName = 'No Name'
    let location = 'No Location'
    let picId
    let fromTime
    let toTime
    let startTime
    let endTime
    let statusId
    let chefCompleted
    let customerCompleted
    let chefRejectorCancel
    let customerRejectorCancel
    let bookingDate

    let bookingNotes
    let bookingTotalPrice = ''
    let dishTypeDesc = []


    if (bookingDetail !== null && bookingDetail !== undefined && bookingDetail !== {}) {
      if (userRole === 'CHEF') {
        userData = bookingDetail.customerProfileByCustomerId
      } else if (userRole === 'CUSTOMER') {
        userData = bookingDetail.chefProfileByChefId
      }

      if (bookingDetail.chefBookingFromTime) {
        fromTime = GMTToLocal(bookingDetail.chefBookingFromTime, DATE_TYPE.TIME)
        startTime = fetchDate(bookingDetail.chefBookingFromTime)
      }

      if (bookingDetail.chefBookingToTime) {
        toTime = GMTToLocal(bookingDetail.chefBookingToTime, DATE_TYPE.TIME)
        endTime = fetchDate(bookingDetail.chefBookingToTime)
      }

      if (bookingDetail.chefBookingFromTime) {
        bookingDate = GMTToLocal(bookingDetail.chefBookingFromTime, DATE_TYPE.DATE)
      }

      if (
        bookingDetail.chefBookingStatusId !== undefined &&
        bookingDetail.chefBookingStatusId !== null &&
        bookingDetail.chefBookingStatusId !== ''
      ) {
        statusId = bookingDetail.chefBookingStatusId
      }

      if (
        bookingDetail.chefBookingCompletedByCustomerYn !== undefined &&
        bookingDetail.chefBookingCompletedByCustomerYn !== null
      ) {
        customerCompleted = bookingDetail.chefBookingCompletedByCustomerYn
      }

      if (
        bookingDetail.chefBookingCompletedByChefYn !== undefined &&
        bookingDetail.chefBookingCompletedByChefYn !== null
      ) {
        chefCompleted = bookingDetail.chefBookingCompletedByChefYn
      }

      if (
        bookingDetail.chefBookingCustomerRejectOrCancelReason !== undefined &&
        bookingDetail.chefBookingCustomerRejectOrCancelReason !== null &&
        bookingDetail.chefBookingCustomerRejectOrCancelReason !== ''
      ) {
        customerRejectorCancel = bookingDetail.chefBookingCustomerRejectOrCancelReason
      }

      if (
        bookingDetail.chefBookingChefRejectOrCancelReason !== undefined &&
        bookingDetail.chefBookingChefRejectOrCancelReason !== null &&
        bookingDetail.chefBookingChefRejectOrCancelReason !== ''
      ) {
        chefRejectorCancel = bookingDetail.chefBookingChefRejectOrCancelReason
      }

      if (bookingDetail.hasOwnProperty('bookingNotes') && bookingDetail.bookingNotes) {
        if (
          bookingDetail.bookingNotes.hasOwnProperty('nodes') &&
          bookingDetail.bookingNotes.nodes !== null
        ) {
          bookingNotes = bookingDetail.bookingNotes.nodes
          try {
            bookingNotes = bookingNotes.sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          } catch (e) {}
        }
      }
      if (isChef) {
        if (bookingDetail.chefBookingPriceValue && bookingDetail.chefBookingPriceValue !== null) {
          bookingTotalPrice = bookingDetail.chefBookingPriceValue
        }
      } else if (!isChef) {
        if (
          bookingDetail.chefBookingTotalPriceValue &&
          bookingDetail.chefBookingTotalPriceValue !== null
        ) {
          bookingTotalPrice = bookingDetail.chefBookingTotalPriceValue
        }
      }
      if (bookingDetail.hasOwnProperty('dishTypeDesc') && bookingDetail.dishTypeDesc) {
        dishTypeDesc = bookingDetail.dishTypeDesc
      }
    }
    if (userData !== undefined && userData !== {} && userData !== null) {
      if (userData.fullName) {
        fullName = userData.fullName
      }

      if (userData.chefPicId || userData.customerPicId) {
        picId = userData.chefPicId ? userData.chefPicId : userData.customerPicId
      }

      if (userData.chefProfileExtendedsByChefId || userData.customerProfileExtendedsByCustomerId) {
        if (userData.customerProfileExtendedsByCustomerId) {
          if (
            userData.customerProfileExtendedsByCustomerId !== undefined &&
            userData.customerProfileExtendedsByCustomerId !== null &&
            userData.customerProfileExtendedsByCustomerId !== ''
          ) {
            if (
              userData.customerProfileExtendedsByCustomerId.hasOwnProperty('nodes') &&
              userData.customerProfileExtendedsByCustomerId.nodes !== undefined &&
              userData.customerProfileExtendedsByCustomerId.nodes.length !== 0 &&
              userData.customerProfileExtendedsByCustomerId.nodes[0] !== null
            ) {
              location =
                userData.customerProfileExtendedsByCustomerId.nodes[0].customerLocationAddress
            }
          }
        } else if (userData.chefProfileExtendedsByChefId) {
          if (
            userData.chefProfileExtendedsByChefId !== undefined &&
            userData.chefProfileExtendedsByChefId !== null &&
            userData.chefProfileExtendedsByChefId !== ''
          ) {
            if (
              userData.chefProfileExtendedsByChefId.hasOwnProperty('nodes') &&
              userData.chefProfileExtendedsByChefId.nodes !== undefined &&
              userData.chefProfileExtendedsByChefId.nodes.length !== 0 &&
              userData.chefProfileExtendedsByChefId.nodes[0] !== null
            ) {
              location = userData.chefProfileExtendedsByChefId.nodes[0].chefLocationAddress
            }
          }
        }
      }
    }

    return (
      <View style={Styles.mainView}>
        {bookNowIsYN === false ? (
          <Header
            showBack
            navigation={navigation}
            showTitle
            title={Languages.bookingDetail.title}
          />
        ) : (
          <Header
            resetToStack
            showBack={false}
            navigation={navigation}
            showTitle
            title={Languages.bookingDetail.title}
          />
        )}
        {isFetching ? (
          <Spinner mode="full" />
        ) : (
          <ScrollView>
            <View style={Styles.container}>
              <View style={Styles.iconProfileBody}>
                <Image
                  style={Styles.chefImage}
                  source={picId ? {uri: picId} : Images.common.defaultAvatar}
                />
                <View style={Styles.iconText}>
                  <View style={Styles.iconNameView}>
                    <Text style={Styles.text}>{fullName}</Text>
                    <TouchableOpacity onPress={() => this.onConversationDetail(picId, fullName)}>
                      <Icon type="FontAwesome5" name="comment-dots" style={Styles.iconStyle3} />
                    </TouchableOpacity>
                  </View>
                  <View style={Styles.iconNameView2}>
                    <Icon type="FontAwesome5" name="map-marker-alt" style={Styles.iconStyle2} />
                    <Text style={Styles.text2}>{location}</Text>
                  </View>
                </View>
              </View>
              {this.renderLine()}
              <View style={Styles.iconText}>
                <Text style={Styles.heading}>{Languages.bookingDetail.labels.booking_price}</Text>
                <Text style={Styles.destext}>
                  {Languages.bookingDetail.labels.dollar}
                  {bookingTotalPrice}
                </Text>
              </View>
              <View style={Styles.iconText}>
                <Text style={Styles.heading}>{Languages.bookingDetail.labels.booking_Date}</Text>
                <Text style={Styles.destext}>{bookingDate}</Text>
              </View>
              <View style={Styles.iconText}>
                <Text style={Styles.heading}>{Languages.bookingDetail.labels.booking_time}</Text>
                <Text style={Styles.destext}>
                  {fromTime} to {toTime}{' '}
                </Text>
              </View>
              <View style={Styles.iconText}>
                <Text style={Styles.heading}>{Languages.bookingDetail.labels.booking_hours}</Text>
                <Text style={Styles.destext}>
                  {moment
                    .utc(moment(endTime, dbDateFormat).diff(moment(startTime, dbDateFormat)))
                    .format('hh:mm')}
                </Text>
              </View>
              {dishTypeDesc && dishTypeDesc.length > 0 && (
                <View style={Styles.iconText}>
                  <Text style={Styles.heading}>
                    {Languages.bookingDetail.labels.booking_dishes}
                  </Text>
                  <View style={Styles.dishView}>
                    {dishTypeDesc && dishTypeDesc.length > 0
                      ? dishTypeDesc.map((value, key) => {
                          const chip = []
                          chip.push(
                            <Button key={key} rounded light style={Styles.dishItem}>
                              <Text style={Styles.dishText}>{value}</Text>
                            </Button>
                          )
                          return chip
                        })
                      : null}
                  </View>
                </View>
              )}
              {bookingNotes && bookingNotes.length > 0 && (
                <View style={Styles.iconText}>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.booking_notes}</Text>
                  {bookingNotes && bookingNotes.length > 0
                    ? bookingNotes.map((value, key) => {
                        return (
                          <View>
                            {value.customerId ? (
                              <View>
                                <Text style={Styles.heading}>
                                  {Languages.bookingDetail.role.customer}
                                </Text>
                                <Text key={key} style={Styles.destext}>
                                  {JSON.parse(value.notesDescription)}
                                </Text>
                              </View>
                            ) : null}
                            {value.chefId ? (
                              <View>
                                <Text style={Styles.heading}>
                                  {Languages.bookingDetail.role.chef}
                                </Text>
                                <Text key={key} style={Styles.destext}>
                                  {JSON.parse(value.notesDescription)}
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        )
                      })
                    : null}
                </View>
              )}
              {/* <View style={Styles.iconText}>
                {this.showPaymentStatus(statusId, bookingDetail, userData)}
              </View> */}
              <View style={Styles.iconText}>
                <Text style={Styles.heading}>{Languages.bookingDetail.labels.booking_status}</Text>
                {this.showStatus(
                  statusId,
                  customerCompleted,
                  chefCompleted,
                  chefRejectorCancel,
                  customerRejectorCancel,
                  bookingDetail,
                  userData,
                  bookingCancelTime
                )}
              </View>
              {bookingDetail.chefBookingStatusId === 'COMPLETED' && (
                <Text>{Languages.bookingDetail.labels.completed}</Text>
              )}
            </View>
          </ScrollView>
        )}
        {acceptModal === true && (
          <BookingModal
            modalVisible={acceptModal}
            closeModal={() => this.closeModal('acceptModal')}
            content={Languages.bookingDetail.questions.accept}
            bookingDetail={bookingItem}
            type={Languages.bookingDetail.types.booking_type_accept}
            userRole={userRole}
            bookingHistId={bookingHistId}
            navigation={navigation}
            stripeId={defaultStripeId}
          />
        )}
        {rejectModal === true && (
          <BookingModal
            modalVisible={rejectModal}
            closeModal={() => this.closeModal('rejectModal')}
            content={Languages.bookingDetail.questions.reject}
            bookingDetail={bookingItem}
            type={Languages.bookingDetail.types.booking_type_reject}
            userRole={userRole}
            bookingHistId={bookingHistId}
            navigation={navigation}
            stripeId={defaultStripeId}
          />
        )}
        {cancelModal === true && (
          <BookingModal
            modalVisible={cancelModal}
            closeModal={() => this.closeModal('cancelModal')}
            content={Languages.bookingDetail.questions.cancel}
            bookingDetail={bookingItem}
            type={Languages.bookingDetail.types.booking_type_cancel}
            userRole={userRole}
            bookingHistId={bookingHistId}
            navigation={navigation}
            stripeId={defaultStripeId}
          />
        )}
        {completeModal === true && (
          <View>
            <BookingModal
              modalVisible={completeModal}
              closeModal={() => this.closeModal('completeModal')}
              content={Languages.bookingDetail.questions.complete}
              bookingDetail={bookingItem}
              type={Languages.bookingDetail.types.booking_type_complete}
              userRole={userRole}
              bookingHistId={bookingHistId}
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
            <View style={Styles.modelView}>
              <View style={Styles.completeModelContainer}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={Styles.contentTextStyle}>
                    {Languages.bookingDetail.labels.complete_booking_after} {bookingStartTime}
                  </Text>
                  <View style={Styles.btnView}>
                    <CommonButton
                      btnText={Languages.bookingHistory.ok}
                      textStyle={{fontSize: 12}}
                      containerStyle={Styles.primaryBtn}
                      onPress={() => this.closeCompleteModal()}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    )
  }
}
BookingDetail.contextType = AuthContext

export default BookingDetail
