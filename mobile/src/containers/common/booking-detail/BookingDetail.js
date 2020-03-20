/* eslint-disable prettier/prettier */
/** @format */

import React, {Component} from 'react'
import {View, Text, ScrollView, Image, Modal, Alert, TouchableOpacity} from 'react-native'
import StarRating from 'react-native-star-rating'
import {Icon, Button, Card, CardItem, Label} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import {Languages} from '@translations'
import {Images} from '@images'
import Styles from './styles'
import {CommonButton, Spinner, Header} from '@components'
import {RouteNames} from '@navigation'
import {
  GMTToLocal,
  fetchDate,
  dbDateFormat,
  DATE_TYPE,
  displayDateFormat,
  displayDateTimeFormat,
} from '@utils'
import {Theme} from '@theme'
import {AuthContext} from '../../../AuthContext'
import {
  SettingsService,
  SETTING_KEY_NAME,
  FeedbackService,
  FEEDBACK_EVENT,
  PROFILE_VIEW_EVENT,
  ProfileViewService,
} from '@services'
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
      stripeCents: 0,
      stripePercentage: 0,
      bookingHistId: '',
      bookingValue: {},
      completeMsgModal: false,
      defaultStripeId: '',
      bookingCancelTime: 0,
      bookingStartTime: '',
      bookNowIsYN: false,
      chefUserProfile: {},
      requestBookingDetail: {},
      additionalPrice: [],
      requestAdditionalPrice: []
    }
  }

  async componentDidMount() {
    BookingDetailService.on(BOOKING_DETAIL_EVENT.BOOKING_DETAIL, this.setList)
    BookingDetailService.on(BOOKING_DETAIL_EVENT.REQUEST_BOOKING_DETAIL, this.setRequestBookingDetail)
    BookingHistoryService.on(
      BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED,
      this.loadInitialData
    )
    // SettingsService.on(SETTING_KEY_NAME.STRIPE_SERVICE_CHARGE_IN_CENTS)
    FeedbackService.on(FEEDBACK_EVENT.FEEDBACK, this.updateFeedback)
    NotificationListService.on(
      NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST,
      this.updatingData
    )
    BookingDetailService.on(BOOKING_DETAIL_EVENT.BOOKING_DETAIL_SUBS, this.updateBookingDetailSubs)
    ProfileViewService.on(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setProfileDetails)
    const {navigation} = this.props
    console.log ( 'navigation.state.params', navigation.state.params)
    if (
      navigation.state.params.bookingHistId !== undefined &&
      navigation.state.params.bookingHistId !== null &&
      navigation.state.params.bookingHistId  !== '' &&
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
    console.log('navigation',navigation.state.params)
    if ( navigation.state.params.bookingValue){
      
      this.setState(
        {
          bookingValue: navigation.state.params.bookingValue,
         
        })
    }
     this.fetchStripeCents() 
     this.fetchStripePercentage()
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
    // SettingsService.off(SETTING_KEY_NAME.STRIPE_SERVICE_CHARGE_IN_CENTS)
    FeedbackService.off(FEEDBACK_EVENT.FEEDBACK, this.updateFeedback)
    BookingDetailService.off(BOOKING_DETAIL_EVENT.BOOKING_DETAIL_SUBS, this.updateBookingDetailSubs)
    ProfileViewService.off(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setProfileDetails)
    BookingDetailService.off(BOOKING_DETAIL_EVENT.REQUEST_BOOKING_DETAIL, this.setRequestBookingDetail)
  }

  fetchChefProfile = () => {
    const {bookingDetail} = this.state
    ProfileViewService.getProfileDetails(bookingDetail.chefId)
  }

  setProfileDetails = ({profileDetails}) => {
    if (Object.keys(profileDetails).length !== 0) {
      if (profileDetails.hasOwnProperty('chefProfileByChefId')) {
        const profile = profileDetails.chefProfileByChefId
        if (profile) {
          this.setState({
            chefUserProfile: profile,
          })
        }
      }
    }
  }

  showAlert = () => {
    const {bookingDetail} = this.state
    console.log('showAlert', bookingDetail)
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
            'We have sent a booking request to the chef. You will receive a notification once the chef has responded.'
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
    this.loadInitialData()
  }

  updateFeedback = () => {
    this.loadInitialData()
  }

fetchStripeCents = () => {
  SettingsService.getStripeCents()
  .then(res =>{
    console.log('res',res)
    this.setState({
      stripeCents: res/100
    })
  })
  .catch(e => {
    console.log('debgging e',e)
  })
}

  fetchStripePercentage = () => {
    SettingsService.getStripePercentage()
    .then(res =>{
      console.log('res',res)
      this.setState({
        stripePercentage: res
      })
    })
    .catch(e => {
      console.log('debgging e',e)
    })
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
    BookingDetailService.getRequestBookingDetail(bookingHistId)
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
          this.fetchChefProfile()
          this.getAdditionalServicePrice()
        }
      )
    } else {
      this.setState({
        isFetching: false,
      })
    }
  }

  getAdditionalServicePrice = () => {
    const {bookingDetail} = this.state
    if(bookingDetail && bookingDetail.additionalServiceDetails) {
    let additionalServicePrice = []
    try{
      additionalServicePrice= JSON.parse(bookingDetail.additionalServiceDetails) 
    } catch(e){
      console.log(e)
    }
    const val = []
    additionalServicePrice.map((itemVal, index) => {
      const value = parseFloat(itemVal.price)
      const priceVal = value.toFixed(2)
      val.push(parseFloat(priceVal))
    })
    this.setState({
      additionalPrice: val,
    })
    }
  }

  setRequestBookingDetail = ({requestBookingDetail}) => {
    console.log('requestBookingDetail',requestBookingDetail)
    if (requestBookingDetail) {
      this.setState(
        {
          isFetching: false,
          requestBookingDetail: requestBookingDetail[0],
        },
        () => {
          this.getRequestAdditionalService()
        }
      )
    } else {
      this.setState({
        isFetching: false,
      })
    }
  }

  getRequestAdditionalService = () => {
    const {requestBookingDetail} = this.state
    if( requestBookingDetail !== null &&
      requestBookingDetail !== undefined &&
      requestBookingDetail !== {} &&
      Object.keys(requestBookingDetail).length !== 0) {
    if (requestBookingDetail&& requestBookingDetail.additionalServiceDetails) {
    const additionalServicePrice = JSON.parse(requestBookingDetail.additionalServiceDetails) 
    const val = []
    additionalServicePrice.map((itemVal, index) => {
      const value = parseFloat(itemVal.price)
      const priceVal = value.toFixed(2)
      val.push(parseFloat(priceVal))
    })
    this.setState({
      requestAdditionalPrice: val,
    })
    }
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

  onCheckComplete = async details => {
    const now = new Date()
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
    if(moment().isBefore(moment.utc(details.chefBookingFromTime).local())){
      Alert.alert(
        Languages.booking_History.alerts.info_title,
        Languages.booking_History.alerts.eventEdit,
      )
     }else if (stripeId !== undefined && stripeId) {
    // if (diffValue <= 0) {
      Alert.alert(
        Languages.bookingDetail.alerts.info,
        Languages.bookingDetail.alerts.price_calculation,
        [
          {text: 'Yes', onPress: () => this.seePriceCalculation(details)},
          {text: 'No',  onPress: () => console.log('Cancel Pressed'),},
        ],
        {
          cancelable: false,
        }
      )
    } else {
      Alert.alert(
        Languages.booking_History.alerts.info_title,
        Languages.booking_History.alerts.add_account_details
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

  seePriceCalculation = details => {
    const {navigation} = this.props
    const {bookingHistId} = this.state
    const from = moment(details.chefBookingFromTime, displayDateTimeFormat)
    const to = moment(details.chefBookingToTime, displayDateTimeFormat)

    const obj = {
      chefId: details.chefId,
      customerId: details.customerId,
      chefBookingFromTime: from,
      chefBookingToTime: to,
      chefProfile: details.chefProfileByChefId,
      summary: details.chefBookingSummary,
      bookingHistId,
    }

    navigation.navigate(RouteNames.CHEF_REQUEST_PRICE, {bookingValue: obj})
  }

  onCompleteBooking = async details => {
    console.log()
    const {getProfile} = this.context
    const profile = await getProfile()
    let stripeId
console.log('details.chefBookingFromTime',moment.utc(details.chefBookingToTime).local().format(displayDateTimeFormat))
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

    if(moment().isBefore(moment.utc(details.chefBookingToTime).local())){
      Alert.alert(
        Languages.booking_History.alerts.info_title,
        Languages.booking_History.alerts.eventEnd,
      )
     }else if (stripeId !== undefined && stripeId) {
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
        Languages.bookingDetail.alerts.info,
        Languages.bookingDetail.alerts.booking_cannot_be_cancelled
      )
    }
    
  }

  onAcceptRequestAmount = () => {
    
    const {navigation} = this.props
    const {bookingHistId, bookingDetail, requestBookingDetail} = this.state
    console.log('onAcceptRequestAmount', bookingDetail,requestBookingDetail)

    if( requestBookingDetail !== null &&
      requestBookingDetail !== undefined &&
      requestBookingDetail !== {} &&
      Object.keys(requestBookingDetail).length !== 0) {


    console.log('onAcceptRequestAmount111111', requestBookingDetail)
    
    const obj = {
      chefId: bookingDetail.chefId,
      customerId: bookingDetail.customerId,
      chefBookingFromTime: bookingDetail.chefBookingFromTime,
      chefBookingToTime: bookingDetail.chefBookingToTime,
      summary: bookingDetail.chefBookingSummary,
      noOfGuests: bookingDetail.chefBookingNoOfPeople,
      complexity: bookingDetail.chefBookingComplexity,
      totalCost: bookingDetail.chefBookingTotalPriceValue,
      chefProfile: bookingDetail.chefProfileByChefId,
      chefBookingPriceValue: bookingDetail.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0].chefPricePerHour,
      chefBookingPriceValueActual : bookingDetail.chefBookingPriceValue,
      chefBookingPriceUnit: 'USD',
      chefBookingStripeCommissionPriceValue: bookingDetail.chefBookingStripeCommissionPriceValue,
      chefBookingServiceChargePriceValue: bookingDetail.chefBookingServiceChargePriceValue,
      chefBookingCommissionPriceValue: bookingDetail.chefBookingCommissionPriceValue,
      chefBookingCommissionPriceUnit: bookingDetail.chefBookingCommissionPriceUnit,
      additionalServiceValues: bookingDetail.additionalServiceDetails,
      bookingHistId,
      requestComplexity: requestBookingDetail.chefBookingRequestComplexity,
      requestNoOfPeople: requestBookingDetail.chefBookingRequestNoOfPeople,
      requestTotalPriceUnit: requestBookingDetail.chefBookingRequestTotalPriceUnit,
      requestTotalPriceValue: requestBookingDetail.chefBookingRequestPriceValue,
      requestAdditionalServices: requestBookingDetail.additionalServiceDetails,
      requestCommissionPriceValue: requestBookingDetail.chefBookingRequestCommissionPriceValue,
      requestCommissionPriceUnit: requestBookingDetail.chefBookingRequestCommissionPriceUnit,
      requestStripeCommission: requestBookingDetail.chefBookingRequestStripeCommissionPriceValue,
      requestServiceCharge: requestBookingDetail.chefBookingRequestServiceChargePriceValue,
    }
    console.log('onAcceptRequestAmount obj', obj)
    navigation.navigate(RouteNames.EXTRA_PAYMENT, {bookingValue: obj})
  }
  }

onEditPress= () =>{
  const {bookingDetail,bookingValue, bookingHistId,chefUserProfile} = this.state

  console.log('bookingDetail',bookingDetail,bookingValue)
  const {navigation} = this.props
  navigation.navigate(RouteNames.CHECK_AVAILABILITY, {draftBooking: bookingDetail, draft:'DRAFTBOOKING',bookingHistId, chefProfile:chefUserProfile})
}

  showStatus = (
    bookingStatus,
    customerCompleteStatus,
    chefCompleteStatus,
    chefReason,
    customerReason,
    bookingDetail,
    userData,
    bookingCancelTime,
    requestBookingDetail
  ) => {
    // const formatDate = moment(formatDate).format('YYYY-MM-DDTHH:mm:SS')
    const {userRole} = this.state
    if (bookingStatus !== undefined && bookingStatus !== null && bookingStatus !== '') {
      if (userRole === 'CHEF') {
        if (bookingStatus.trim() === 'CUSTOMER_REQUESTED') {
          return (
         
            <View>
              {
                moment(moment.utc(bookingDetail.chefBookingFromTime).local()).isBefore(moment()) ? 
                <Text style={Styles.destext}>
                  {Languages.bookingDetail.labels.bookingExperied}
              </Text>
                : 
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
              }
         
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

                {/* {chefCompleteStatus === false && ( */}
                  {/* // customerCompleteStatus === false && */}
                  <View style={Styles.bookingStatusBtn}>
                         <Button style={Styles.successBtn}  onPress={() => this.onCompleteBooking(bookingDetail)}>
                      <Icon   type="MaterialCommunityIcons" name="check-all" />
                      </Button>
                      <Button style={Styles.editBtn} onPress={() => this.onCheckComplete(bookingDetail)}>
                      <Icon   type="MaterialCommunityIcons" name="square-edit-outline" />
                       </Button>
                      <Button
                        style={Styles.cancelBtn}
                        onPress={() => this.onCheckCancel(bookingDetail, bookingCancelTime)}>
                        <Icon name="close" type="MaterialCommunityIcons" style={{color: '#fff'}} />
                      </Button>
                  </View>
                {/* )} */}
              </View>
            </View>
          )
        }
        if (bookingStatus.trim() === 'AMOUNT_TRANSFER_SUCCESS') {
          return (
          <View>
            {chefCompleteStatus === false && (
              // customerCompleteStatus === false &&
              <View style={Styles.bookingStatusBtn}>
              <Text style={Styles.destext}>{Languages.bookingDetail.alerts.booking_completed}</Text>
                  <CommonButton
                btnText={Languages.bookingHistory.feedback}
                textStyle={{fontSize: 12}}
                containerStyle={Styles.loginButton}
                onPress={() => this.onFeedBack(bookingDetail)}
                // onPress={() => this.onShowModal('completeModal', bookingDetail)}
              />
              </View>
            )}
                {chefCompleteStatus === true && (
            <Text style={Styles.destext}>{Languages.bookingDetail.labels.reviewed}</Text>
            )}
          </View>
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

        if (bookingStatus.trim() === 'COMPLETED') {
          return (
            <View>
              <Text style={Styles.destext}>{Languages.bookingDetail.alerts.complete_message}</Text>
                {chefCompleteStatus === false && (
                  // customerCompleteStatus === false &&
                  <View style={Styles.bookingStatusBtn}>
                      <CommonButton
                    btnText={Languages.bookingHistory.feedback}
                    textStyle={{fontSize: 12}}
                    containerStyle={Styles.loginButton}
                    onPress={() => this.onFeedBack(bookingDetail)}
                    // onPress={() => this.onShowModal('completeModal', bookingDetail)}
                  />
                  </View>
                )}
                    {chefCompleteStatus === true && (
                <Text style={Styles.destext}>{Languages.bookingDetail.labels.reviewed}</Text>
                )}
                  </View>
          )
        }

        if (bookingStatus.trim() === 'AMOUNT_TRANSFER_FAILED') {
          return (
            <View>
              {chefCompleteStatus === false && (
                  // customerCompleteStatus === false &&
                  <View>
                     <Text style={Styles.destext}>{Languages.bookingDetail.alerts.transfer_failed}</Text>
                     <View style={Styles.bookingStatusBtn}>
                      <CommonButton
                    btnText={Languages.bookingHistory.feedback}
                    textStyle={{fontSize: 12}}
                    containerStyle={Styles.loginButton}
                    onPress={() => this.onFeedBack(bookingDetail)}
                    // onPress={() => this.onShowModal('completeModal', bookingDetail)}
                  />
                    </View>
                  </View>
                )}
                    {chefCompleteStatus === true && (
                <Text style={Styles.destext}>{Languages.bookingDetail.labels.reviewed}</Text>
                )}
            </View>
          )
        }

        if (bookingStatus.trim() === 'CHEF_REQUESTED_AMOUNT') {
          return (
            <View>
              <Text style={Styles.destext}>{Languages.bookingDetail.alerts.request_amount}</Text>
            </View>
          )
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
              <View>
              <Text style={Styles.destext}>
                {userData.fullName} {Languages.bookingDetail.labels.accepted_booking}
              </Text>
              </View>
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

              {/* {chefCompleteStatus === false && ( */}
                {/* // customerCompleteStatus === false && */}
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
              {/* )} */}
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
              {/* {chefCompleteStatus === true && customerCompleteStatus === false && ( */}
                {customerCompleteStatus === false && (
                <View>
                  <View>
                  <Text style={Styles.destext}>
                    {Languages.bookingDetail.alerts.booking_completed}
                  </Text>
                  </View>
                  <CommonButton
                    btnText={Languages.bookingHistory.feedback}
                    textStyle={{fontSize: 12}}
                    containerStyle={Styles.loginButton}
                    onPress={() => this.onFeedBack(bookingDetail)}
                    // onPress={() => this.onShowModal('completeModal', bookingDetail)}
                  />
                </View>
          )}
              {/* )} */}
              {/* {chefCompleteStatus === true && customerCompleteStatus === true && ( */}
                {customerCompleteStatus === true && (
                <Text style={Styles.destext}>{Languages.bookingDetail.labels.reviewed}</Text>
                )}
              {/* )} */}
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
        if (bookingStatus.trim() === 'PAYMENT_FAILED') {
          return (
            <View>
              <Text style={Styles.destext}>{Languages.bookingDetail.labels.payment_pending}</Text>
            </View>
          )
        }
        if (bookingStatus.trim() === 'PAYMENT_PENDING') {
          return (
            <View>
            <Text style={Styles.heading}>
              {Languages.bookingDetail.labels.draft}
            </Text>
            <CommonButton
                    btnText="Edit"
                    textStyle={{fontSize: 16}}
                    containerStyle={Styles.payButton}
                    onPress={() => this.onEditPress()}
            />
          </View>
          )
        }


        if (
          bookingStatus.trim() === 'CHEF_REQUESTED_AMOUNT' 
        ) {
          return (
            <View>
            <Text style={Styles.heading}>
              {userData.fullName} {Languages.bookingDetail.labels.request_additional_charge}
            </Text>
            <CommonButton
                    btnText="Pay Pending Charges"
                    textStyle={{fontSize: 12}}
                    containerStyle={Styles.payButton}
                    onPress={() => this.onAcceptRequestAmount()}
            />
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
      bookingHistId: bookingDetail.bookingHistId,
      bookingFromTime: bookingDetail.chefBookingFromTime,
      bookingToTime: bookingDetail.chefBookingToTime,
    })
  }

  titleCase = string => {
    if (!string || string.length === 0) {
      return ''
    }
    const sentence = string.toLowerCase().split(' ')
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
    }
    return sentence.join(' ')
  }

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

    renderRating = () => {
      const {bookingDetail, userRole} = this.state
      let userData = {}

      if (bookingDetail !== null && bookingDetail !== undefined && bookingDetail !== {}) {
        if (userRole === 'CHEF') {
          userData = bookingDetail.customerProfileByCustomerId
        } else if (userRole === 'CUSTOMER') {
          userData = bookingDetail.chefProfileByChefId
        }
      }
  
      let userDetails = {}
      if (userData !== undefined && userData !== null && userData !== {}) {
        userDetails = userData
      }
  
      return (
        <View style={Styles.reviewView}>
          {userDetails && userDetails.averageRating && userDetails.averageRating !== null && (
            <StarRating
              disabled={false}
              maxStars={5}
              starSize={18}
              rating={userDetails.averageRating}
              // starStyle={Styles.starSpacing}
              fullStarColor={Theme.Colors.primary}
              selectedStar={rating => this.onStarRatingPress(rating)}
            />
          )}
          {userDetails && userDetails.averageRating !== null ? (
            <Text style={Styles.avgNumber}>
              {userDetails.averageRating && parseFloat(userDetails.averageRating).toFixed(1)}
            </Text>
          ) : (
            <Text style={Styles.avgNumber}>New Chef</Text>
          )}
          {userDetails && userDetails.totalReviewCount > 0 && (
            <Text> ({userDetails.totalReviewCount} reviews)</Text>
          )}
        </View>
      )
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
      requestBookingDetail, 
      additionalPrice,
      requestAdditionalPrice,
      stripeCents,
      stripePercentage
    } = this.state
    const {navigation} = this.props
    const {isChef} = this.context
    let userData = {}
    let fullName = 'No Name'
    let location = 'No Location'
    let state = 'No State'
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

    let bookingSummary = 'No Event Notes'
    let bookingNoOfPeople
    let newAllergies = 'No Other Allergies'
    let newKitchenEquipment = 'No Other Kitchen Equipments'
    let newDietary = 'No other Dietary Restrictions'
    let foodCost
    let complexity
    let additionalService = []
    let otherStoreTypes = 'No Other Store'
    let allergyTypes = []
    let dietaryTypes = []
    let kitchenEquipmentTypes = []
    let storeTypes = []
    let paymentDetail = []
    let chefRequestPrice = 0
    let additionalTotalPrice = 0
    let requestAdditionalTotalPrice = 0

    let complexityCharge = 0
    let chefCharge = 0
    let chefPricePerHour
    let remChefCharge = 0
    let chefTotalCharge = 0
    let servicePercentage
    let rockolyCharge = 0
    let stripePercentagevalue = 0
    let firstChefCharge = 0
    let requestTotalPrice = 0
    let requestNoOfPeople = 0
    let requestComplexity = 0
    let requestAdditionalServices = []
    let totalAmountToPay = 0
    let chefTotal = 0
    let chefRequestTotal = 0
    let totalAmount = 0
    let bookingLocation = ''
    let bookingHours
    let requestRockolyCharge = 0

    let chefBaseCharge = 0
    let discount = 0
    let guestPrice = 0
    let guestCount = 0
    let complexityUpcharge = 0
    let TotalCharge = 0
    let totalAmountToPay1 = 0
 console.log('bookingDetail',bookingDetail)



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

      if (bookingDetail.chefBookingSummary) {
       console.log("bookingDetail",bookingDetail.chefBookingSummary) 
        try {
          bookingSummary = JSON.parse(bookingDetail.chefBookingSummary)

        }catch (e) {
          bookingSummary = JSON.parse(JSON.stringify(bookingDetail.chefBookingSummary))
          console.log(e)
        }
        
       
      }

      if (bookingDetail.chefBookingNoOfPeople) {
        bookingNoOfPeople = bookingDetail.chefBookingNoOfPeople
      }
      

      if (bookingDetail.chefBookingOtherAllergyTypes) {
        try {
          newAllergies = JSON.parse(bookingDetail.chefBookingOtherAllergyTypes)
        }catch (e){
          console.log(e)
        }
       
      }

      if (bookingDetail.chefBookingOtherDietaryRestrictionsTypes) {
        try {
          newDietary = JSON.parse(bookingDetail.chefBookingOtherDietaryRestrictionsTypes)
        }catch (e){
           console.log(e)
        }
      }

      if (bookingDetail.chefBookingOtherKitchenEquipmentTypes) {
        try {
          newKitchenEquipment = JSON.parse(bookingDetail.chefBookingOtherKitchenEquipmentTypes)
        }catch (e){
          console.log(e)
        }
      }

      if (bookingDetail.chefBookingOtherStoreTypes) {
        try {
          otherStoreTypes = JSON.parse(bookingDetail.chefBookingOtherStoreTypes)
        }catch (e){
          console.log(e)
        }
      }

      if (bookingDetail.chefBookingComplexity) {
        complexity = bookingDetail.chefBookingComplexity
      }

      if (bookingDetail.chefBookingFoodCost) {
        foodCost = bookingDetail.chefBookingFoodCost
      }

      if (bookingDetail.additionalServiceDetails) {
        try {
          additionalService = JSON.parse(bookingDetail.additionalServiceDetails)
        }catch (e){
          console.log(e)
        }
      }

      if (bookingDetail.allergyTypes && bookingDetail.allergyTypes.nodes) {
        allergyTypes = bookingDetail.allergyTypes.nodes
      }

      if (bookingDetail.dietaryRestrictionsTypes && bookingDetail.dietaryRestrictionsTypes.nodes) {
        dietaryTypes = bookingDetail.dietaryRestrictionsTypes.nodes
      }

      if (bookingDetail.kitchenEquipmentTypes && bookingDetail.kitchenEquipmentTypes.nodes) {
        kitchenEquipmentTypes = bookingDetail.kitchenEquipmentTypes.nodes
      }

      if (bookingDetail.storeTypes && bookingDetail.storeTypes.nodes) {
        storeTypes = bookingDetail.storeTypes.nodes
      }

      if(bookingDetail.chefBookingLocationAddress) {
        bookingLocation = bookingDetail.chefBookingLocationAddress
      }

      if (!isChef) {
      if (
        bookingDetail.paymentHistoriesByBookingHistId &&
        bookingDetail.paymentHistoriesByBookingHistId.nodes
      ) {
        paymentDetail = bookingDetail.paymentHistoriesByBookingHistId.nodes
      }
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
     if(requestBookingDetail && requestBookingDetail.chefBookingRequestPriceValue){
       chefRequestPrice = requestBookingDetail.chefBookingRequestPriceValue
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
          } catch (e) {
            console.log (e)
          }
        }
      }
      console.log('debugging ',bookingDetail.chefBookingPriceValue, bookingDetail.chefBookingTotalPriceValue)
      // if (!isChef) {
        if (bookingDetail.chefBookingPriceValue && bookingDetail.chefBookingPriceValue !== null) {
          bookingTotalPrice = bookingDetail.chefBookingPriceValue
        }
      // } else if (isChef) {
      //   if (
      //     bookingDetail.chefBookingTotalPriceValue &&
      //     bookingDetail.chefBookingTotalPriceValue !== null
      //   ) {
      //     bookingTotalPrice = bookingDetail.chefBookingTotalPriceValue
      //   }
      // }
      if (bookingDetail.hasOwnProperty('dishTypeDesc') && bookingDetail.dishTypeDesc) {
        dishTypeDesc = bookingDetail.dishTypeDesc
      }

      if (additionalPrice && additionalPrice.length > 0) {
        additionalTotalPrice = _.sum(additionalPrice)        
      }
      
      if(bookingDetail &&
        bookingDetail.chefProfileByChefId && 
        bookingDetail.chefProfileByChefId.chefProfileExtendedsByChefId &&
        bookingDetail.chefProfileByChefId.chefProfileExtendedsByChefId.nodes) {
        chefPricePerHour = bookingDetail.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0].chefPricePerHour
      }

      if(bookingDetail.chefBookingServiceChargePriceValue) {
        servicePercentage = bookingDetail.chefBookingServiceChargePriceValue
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
              location = userData.chefProfileExtendedsByChefId.nodes[0].chefCity
              state = userData.chefProfileExtendedsByChefId.nodes[0].chefState
            }
          }
        }
      }
    }

    if(requestBookingDetail !== {} && requestBookingDetail !== undefined && requestBookingDetail !== null) {
      console.log('requestBookingDetail', requestBookingDetail)
      if (requestAdditionalPrice && requestAdditionalPrice.length > 0) {
        requestAdditionalTotalPrice = _.sum(requestAdditionalPrice)
      }

     

      if(requestBookingDetail.chefBookingRequestNoOfPeople) {
        requestNoOfPeople = requestBookingDetail.chefBookingRequestNoOfPeople
      }

      if(requestBookingDetail.chefBookingRequestComplexity) {
        requestComplexity = requestBookingDetail.chefBookingRequestComplexity
      }

      if(requestBookingDetail.additionalServiceDetails) {
        try {
          requestAdditionalServices = JSON.parse(requestBookingDetail.additionalServiceDetails)
        }catch(e){
          console.log(e)
        }
        
      }

      if(requestTotalPrice && requestBookingDetail.chefBookingRequestCommissionPriceValue) {
           chefRequestTotal = requestTotalPrice - requestBookingDetail.chefBookingRequestCommissionPriceValue
      }

      if(requestBookingDetail.chefBookingRequestCommissionPriceValue) {
        requestRockolyCharge = requestBookingDetail.chefBookingRequestCommissionPriceValue
      }

      if(isChef){
        if(requestBookingDetail.chefBookingRequestTotalPriceValue) {
          requestTotalPrice = requestBookingDetail.chefBookingRequestTotalPriceValue
        }
       }else if(requestBookingDetail.chefBookingRequestTotalPriceValue) {
          requestTotalPrice = requestBookingDetail.chefBookingRequestTotalPriceValue + requestRockolyCharge
        }    
      }

    if(bookingNoOfPeople && bookingNoOfPeople <= 5) {
      chefCharge = chefPricePerHour * bookingNoOfPeople
    }

    if(bookingNoOfPeople && bookingNoOfPeople > 5) {
      firstChefCharge = chefPricePerHour * 5
      remChefCharge =  ((bookingNoOfPeople - 5) * (chefPricePerHour/2))
    }

    if(bookingNoOfPeople && bookingNoOfPeople > 5) {
      complexityCharge = ((firstChefCharge + remChefCharge) * complexity) - (firstChefCharge + remChefCharge)
    } else {
      complexityCharge = (chefCharge * complexity) - chefCharge
    }

    if(bookingNoOfPeople && bookingNoOfPeople > 5) {
      chefTotalCharge += (chefPricePerHour * 5)
      chefTotalCharge +=  ((bookingNoOfPeople - 5) * (chefPricePerHour/2))
      chefTotalCharge *= complexity
      chefTotalCharge += additionalTotalPrice
      
    } else {
      chefTotalCharge = (chefPricePerHour * bookingNoOfPeople * complexity) + additionalTotalPrice
    }
    if (stripePercentage && chefTotalCharge){
      stripePercentagevalue= (stripePercentage * chefTotalCharge)/100
      // console.log('stripePercentagevalue',stripePercentagevalue )
    }
    if(stripePercentagevalue) {
      rockolyCharge = stripeCents + stripePercentagevalue
    }
    if (isChef) {
      if (chefTotalCharge && rockolyCharge) {
        const total = chefTotalCharge - rockolyCharge
        const totalCost = parseFloat(total)
        totalAmountToPay = totalCost.toFixed(2)
      }
    }else{
          const total = chefTotalCharge 
          const totalCost = parseFloat(total)
          totalAmountToPay = totalCost.toFixed(2)
    }
    if(rockolyCharge && totalAmountToPay) {
        chefTotal = totalAmountToPay - rockolyCharge
    }

    if (chefRequestTotal && chefTotal) {
       totalAmount = chefRequestTotal + chefTotal
    }

    if(startTime && endTime) {
     bookingHours = moment
        .utc(moment(endTime, dbDateFormat).diff(moment(startTime, dbDateFormat)))
        .format('hh:mm')
    }
    if(bookingNoOfPeople && chefPricePerHour){
      chefBaseCharge= bookingNoOfPeople * chefPricePerHour
     }
     if (bookingNoOfPeople > 5) {
      discount = (bookingNoOfPeople - 5) * (chefPricePerHour / 2)
    } else {
      discount = 0
    }
    if (bookingNoOfPeople) {
      guestCount = bookingNoOfPeople - 5
    }
    if (chefPricePerHour) {
      guestPrice = chefPricePerHour / 2
    }
    const chefChargeAfterDiscount = chefBaseCharge - discount
    complexityUpcharge = chefChargeAfterDiscount * complexity - chefChargeAfterDiscount

    const discountTotal = chefBaseCharge - discount
    if (bookingNoOfPeople && bookingNoOfPeople > 5) {
      TotalCharge += discountTotal
      TotalCharge += complexityUpcharge
      TotalCharge += _.sum(additionalPrice)
    } else {
      TotalCharge = chefBaseCharge + complexityUpcharge + _.sum(additionalPrice)
    }
    if (isChef) {
      if (TotalCharge && rockolyCharge) {
        const total = TotalCharge - rockolyCharge
        const totalCost = parseFloat(total)
        totalAmountToPay1 = totalCost.toFixed(2)
      }
    }else{
          const total = TotalCharge 
          const totalCost = parseFloat(total)
          totalAmountToPay1 = totalCost.toFixed(2)
    }
console.log ('stipeCents',bookingDetail)
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
                  {
                    isChef ? 
                    <View style={Styles.iconNameView2}>
                    <Icon type="FontAwesome5" name="map-marker-alt" style={Styles.iconStyle2} />
                       <Text style={Styles.text2}>{location}</Text>
                  </View>:
                  <View style={Styles.iconNameView2}>
                  <Icon type="FontAwesome5" name="map-marker-alt" style={Styles.iconStyle2} />
                     <Text style={Styles.text2}>{location},{state}</Text>
                </View>
                  }
              
                  {!isChef && (
                  this.renderRating()
                  )}
                </View>
              </View>
              {this.renderLine()}
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
                  bookingCancelTime,
                  requestBookingDetail
                )}
              </View>
              {bookingDetail.chefBookingStatusId === 'COMPLETED' && (
                <Text>{Languages.bookingDetail.labels.completed}</Text>
              )}

              {statusId && statusId.trim() === 'CHEF_ACCEPTED' && chefCompleted === false && isChef && (
                <View style={{marginBottom: 10}}>
                  <Text style={Styles.noteText}>Note : If you have any changes in services. you can request additional charges to the customer while completing the service</Text>
                  </View>
              )}

              <Card style={Styles.cardStyle}>
                      <CardItem header bordered>
                        <Text style={{color: 'black'}}>
                          Booking Details
                        </Text>
                      </CardItem>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.booking_Date} 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                        {bookingDate}</Text>
                      </View>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.serving_time} 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                        {fromTime} to {toTime}{' '}</Text>
                      </View>
                      {/* <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.booking_hours} 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                        {bookingHours}</Text>
                      </View> */}
                      <View style={Styles.iconText}>
                      <View>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.event_notes}
                        </Text>
                        <Text style={Styles.destext}>
                        {bookingSummary}</Text>
                        </View>
                      </View>
                      <View style={Styles.iconText}>
                        <View>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.customer_booking_location}  
                        </Text>
                        <Text style={Styles.destext}>
                        {bookingLocation}</Text>
                       </View>
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
                            <Button key={key} rounded  small light style={Styles.dishItem}>
                              <Text style={Styles.dishText}>{value}</Text>
                            </Button>
                          )
                          return chip
                        })
                      :  
                      <Text style={Styles.destext}>
                      No Booking Dishes</Text>
                    }
                  </View>
                </View>
              )}
                     {bookingNotes && bookingNotes.length > 0 && (
                <View style={Styles.iconText}>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.dish_notes}:</Text>
                  {bookingNotes && bookingNotes.length > 0
                    ? bookingNotes.map((value, key) => {
                        return (
                          <View>
                            {value.customerId ? (
                              <View>
                                <Text style={Styles.heading}>
                                  {Languages.bookingDetail.role.fromCustomer}
                                </Text>
                                <Text key={key} style={Styles.destext}>
                                  {JSON.parse(value.notesDescription)}
                                </Text>
                              </View>
                            ) : null}
                            {value.chefId ? (
                              <View>
                                <Text style={Styles.heading}>
                                  {Languages.bookingDetail.role.fromChef}
                                </Text>
                                <Text key={key} style={Styles.destext}>
                                  {JSON.parse(value.notesDescription)}
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        )
                      })
                    :  <Text style={Styles.destext}>
                    No Dish Notes</Text>
                  }
                </View>
              )}
               <View style={{marginBottom: 5}} />
              </Card>
              <Card style={Styles.cardStyle}>
                      <CardItem header bordered>
                        <Text style={{color: 'black'}}>
                        Initial Booking Request
                        </Text>
                      </CardItem>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.booking_price} 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                  {bookingTotalPrice ? `$${bookingTotalPrice.toFixed(2)}` : null}</Text>
                      </View>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.booking_no_of_people} 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                        {bookingNoOfPeople}</Text>
                      </View>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.complexity}  
                        </Text>
                        <Text style={Styles.biilingRightText}>
                        {complexity}X</Text>
                      </View>
                      {storeTypes && storeTypes.length > 0 && (
                <View style={Styles.iconText}>
                  <Text style={Styles.heading}>{Languages.bookingDetail.labels.booking_store}</Text>
                  <View style={Styles.dishView}>
                    {storeTypes && storeTypes.length > 0
                      ? storeTypes.map((value, key) => {
                          const chip = []
                          chip.push(
                            <Button key={key} small rounded light style={Styles.dishItem}>
                              <Text style={Styles.dishText}>{value.storeTypeName}</Text>
                            </Button>
                          )
                          return chip
                        })
                      : null}
                  </View>
                </View>
              )}
                   <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.other_store}  
                        </Text>
                        <Text style={Styles.destext}>
                        {otherStoreTypes}</Text>
                      </View>

              <View style={Styles.iconText}>
                  <Text style={Styles.heading}>
                    {Languages.chefProfile.labels.additional_service}:
                  </Text>
              {additionalService && additionalService.length > 0 ? (
                  <View style={Styles.dishView}>
                    {additionalService.map((item, key) => {
                      const chip = []
                      chip.push(
                        <Button small rounded light style={Styles.dishItem}>
                          <Text style={Styles.locationText}>
                            {item.name} : {Languages.bookingDetail.labels.dollar}{item.price}
                          </Text>
                        </Button>
                      )
                      return chip
                    })}
                  </View>
              ) : (
                <Text style={Styles.biilingRightText}>{Languages.chefProfile.labels.no_service}</Text>
              )}
            </View>
               <View style={{marginBottom: 5}} />
              </Card>
              {/* <Card style={Styles.cardStyle}>
                 <CardItem header bordered>
                 <Text style={{color: 'black'}}>Billing Details</Text>
                </CardItem>
                <View style={Styles.iconText}>
                <Text style={Styles.destext}>Here We Show Billing Details</Text>
                </View>
              </Card> */}
              <Card style={Styles.cardStyle}>
                      <CardItem header bordered>
                        <Text style={{color: 'black'}}>
                          Booking Billing Details
                        </Text>
                      </CardItem>
                     
                        {bookingNoOfPeople > 5 ?
                        <View>
                         <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        Chef Base rate({`$${chefPricePerHour}`}) X ({bookingNoOfPeople}) guests.
                        </Text>
                        <Text style={Styles.biilingRightText}>{chefBaseCharge ? `$${chefBaseCharge.toFixed(2)}` : null}</Text>
                         </View>
                         <View style={Styles.iconText}>
                         <Text style={Styles.discount}>
                          Discount - Over 5 ({guestCount}) guests half chef Base Rate ({`$${guestPrice}`})
                         </Text>
                         <Text style={Styles.biilingRightText}>{discount ? `-$${discount.toFixed(2)}` : null}</Text>
                         </View>
                         </View>
                         
                        :
                        <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        Chef Base rate({`$${chefPricePerHour}`}) X ({bookingNoOfPeople}) guests.
                        </Text>
                         <Text style={Styles.biilingRightText}>{chefBaseCharge ? `$${chefBaseCharge.toFixed(2)}` : null}</Text>
                        </View>
                        }
                        {complexity ? 
                         <View style={Styles.iconText}>
                            <Text style={Styles.heading}>
                             Complexity Upcharge
                        </Text>
                        <Text style={Styles.biilingRightText}>
                             {complexityUpcharge ? `$${complexityUpcharge.toFixed(2)}` : `$${0}`}
                        </Text>
                        </View>
                          :
                          null
                        }
                    
                        {additionalService ? 
                          <View style={Styles.iconText}>
                         <Text style={Styles.heading}>
                           Additional services 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                           {additionalTotalPrice ? `$${additionalTotalPrice.toFixed(2)}` : `$${0}`}
                        </Text>
                        </View>
                        :
                        null
                        }
{/*                     
                      <View style={Styles.iconText}>
                         <Text style={Styles.heading}>
                           Chef total charge  
                        </Text>
                        <Text style={Styles.biilingRightText}>
                           {chefTotalCharge ? `$${chefTotalCharge.toFixed(2)}` : null}
                        </Text>
                      </View> */}
                      {isChef && 
                        <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                          Rockoly/Payment charges
                       </Text>
                       <Text style={Styles.biilingRightText}>
                          {rockolyCharge ? `$${rockolyCharge.toFixed(2)}` : null}
                       </Text>
                     </View>
                      }
                    
                      <View style={{borderWidth: 0.5, borderColor: Theme.Colors.borderColor, marginTop: 10}} />
                      <View style={Styles.iconText}>
                         <Text style={Styles.heading}>
                           Total 
                        </Text>
                       
                        <Text style={Styles.biilingRightText}>
                              ${totalAmountToPay1} 
                        </Text>
                
                        
                      </View>
                      <View style={{marginBottom: 5}} />
              </Card>
              {requestBookingDetail && (
              <Card style={Styles.cardStyle}>
                      <CardItem header bordered>
                        <Text style={{color: 'black'}}>
                        Chef Booking Request Changes
                        </Text>
                      </CardItem>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.additional_no_of_people}
                        </Text>
                        <Text style={Styles.biilingRightText}>
                        {requestNoOfPeople}</Text>
                      </View>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.complexity_changes} 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                        {requestComplexity}X</Text>
                      </View>

              <View style={Styles.iconText}>
                  <Text style={Styles.heading}>
                    {Languages.bookingDetail.labels.extra_service_provided}:
                  </Text>
              {requestAdditionalServices && requestAdditionalServices.length > 0 ? (
                  <View style={Styles.dishView}>
                    {requestAdditionalServices.map((item, key) => {
                      const chip = []
                      chip.push(
                        <Button small rounded light style={Styles.dishItem}>
                          <Text style={Styles.locationText}>
                            {item.name} : {Languages.bookingDetail.labels.dollar}{item.price}
                          </Text>
                        </Button>
                      )
                      return chip
                    })}
                  </View>
              ) : (
                <Text style={Styles.biilingRightText}>{Languages.chefProfile.labels.no_service}</Text>
              )}
            </View>
            <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.extra_services_amount} 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                         {requestAdditionalTotalPrice ? `$${requestAdditionalTotalPrice.toFixed(2)}` : `$${0}`}</Text>
                      </View>
                      {isChef && 
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.request_amount}
                        </Text>
                        <Text style={Styles.biilingRightText}>
                        {chefRequestPrice}</Text>
                      </View>}
                      {
                        isChef && 
                        <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.rockoly_payment_charge} 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                         {requestRockolyCharge ? `$${requestRockolyCharge.toFixed(2)}` : `$${0}`}</Text>
                      </View>
                      }
                    
                      <View style={{borderWidth: 0.5, borderColor: Theme.Colors.borderColor, marginTop: 10}} />
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.total_pay}  
                        </Text>
                        <Text style={Styles.biilingRightText}>{Languages.bookingDetail.labels.dollar}
                  {requestTotalPrice}</Text>
                      </View>
               <View style={{marginBottom: 5}} />
              </Card>
              )}

            {/* {isChef && !requestBookingDetail && (
              <Card style={Styles.cardStyle}>
              <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                          Admin will send you the amount 
                        </Text>
                        <Text style={Styles.biilingRightText}>
                          {`$${chefTotal.toFixed(2)}`}</Text>
                      </View>
                      <View style={{marginBottom: 5}} />
              </Card>
              )}
                {isChef && requestBookingDetail && (
              <Card style={Styles.cardStyle}>
              <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                          Admin will send you the amount  
                        </Text>
                        <Text style={Styles.biilingRightText}>
                          {`$${totalAmount.toFixed(2)}`}</Text>
                      </View>
                      <View style={{marginBottom: 5}} />
              </Card>
              )} */}
              {isChef && (
                <View style={Styles.iconText}>
                  <Text style={Styles.noteText}>Note: once you have completed the experience, an administrator will send you the amount listed above. You can request service changes to the customer.</Text>
                 </View>
              )}
              {paymentDetail &&
                paymentDetail.length > 0 &&
                paymentDetail.map((item, key) => {
                  return (
                    <Card style={Styles.cardStyle}>
                      <CardItem header bordered>
                        <Text style={{color: 'black'}}>
                          {Languages.bookingDetail.labels.payment_details} {paymentDetail.length > 1 ? key + 1 : null} 
                        </Text>
                      </CardItem>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                          {Languages.bookingDetail.labels.payment_id}
                        </Text>
                        <Text style={Styles.biilingRightText}>{item.paymentId}</Text>
                      </View>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                          {Languages.bookingDetail.labels.payment_status}
                        </Text>
                        <Text style={Styles.biilingRightText}>
                          {item.paymentStatusId ? this.Capitalize(item.paymentStatusId.trim().toLowerCase())  : ''}
                        </Text>
                      </View>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>{Languages.bookingDetail.labels.amount}</Text>
                        <Text style={Styles.biilingRightText}>{item.paymentOriginalPriceValueFormat ? `$${item.paymentOriginalPriceValueFormat.toFixed(2)}` : ''}</Text>
                      </View>
                      <View style={Styles.iconText}>
                        <Text style={Styles.heading}>
                          {Languages.bookingDetail.labels.payment_date}
                        </Text>
                        <Text style={Styles.biilingRightText}>
                        {GMTToLocal(item.createdAt,DATE_TYPE.DATE)}{' '}
                          {GMTToLocal(item.createdAt,DATE_TYPE.TIME)}
                        </Text>
                      </View>
                      <View style={{marginBottom: 5}} />
                    </Card>
                  )
                })}
              {/* <View style={Styles.iconText}>
                {this.showPaymentStatus(statusId, bookingDetail, userData)}
              </View> */}
       <Card style={Styles.cardStyle}>
                      <CardItem header bordered>
                        <Text style={{color: 'black'}}>
                       Other Notes
                        </Text>
                      </CardItem>
                      {allergyTypes && allergyTypes.length > 0 && (
                <View style={Styles.iconText}>
                  <Text style={Styles.heading}>
                    {Languages.bookingDetail.labels.booking_allergy}:
                  </Text>
                  <View style={Styles.dishView}>
                    {allergyTypes && allergyTypes.length > 0
                      ? allergyTypes.map((value, key) => {
                          const chip = []
                          chip.push(
                            <Button key={key} small rounded light style={Styles.dishItem}>
                              <Text style={Styles.dishText}>{value.allergyTypeName}</Text>
                            </Button>
                          )
                          return chip
                        })
                      : null}
                  </View>
                </View>
              )}
                     <View style={Styles.iconText}>
                        <View>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.other_allergy} :  <Text style={Styles.destext}>
                        {newAllergies}</Text>
                        </Text>
                       </View>
                      </View>
                      {dietaryTypes && dietaryTypes.length > 0 && (
                <View style={Styles.iconText}>
                  <Text style={Styles.heading}>
                    {Languages.bookingDetail.labels.booking_dietary}:
                  </Text>
                  <View style={Styles.dishView}>
                    {dietaryTypes && dietaryTypes.length > 0
                      ? dietaryTypes.map((value, key) => {
                          const chip = []
                          chip.push(
                            <Button key={key} small rounded light style={Styles.dishItem}>
                              <Text style={Styles.dishText}>
                                {value.dietaryRestrictionsTypeName}
                              </Text>
                            </Button>
                          )
                          return chip
                        })
                      : null}
                  </View>
                </View>
              )}
                <View style={Styles.iconText}>
                        <View>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.other_dietary} :  <Text style={Styles.destext}>
                        {newDietary}</Text>
                        </Text>
                       </View>
                      </View>
                      {kitchenEquipmentTypes && kitchenEquipmentTypes.length > 0 && (
                <View style={Styles.iconText}>
                  <Text style={Styles.heading}>
                    {Languages.bookingDetail.labels.booking_kitchen_equipment}:
                  </Text>
                  <View style={Styles.dishView}>
                    {kitchenEquipmentTypes && kitchenEquipmentTypes.length > 0
                      ? kitchenEquipmentTypes.map((value, key) => {
                          const chip = []
                          chip.push(
                            <Button key={key} rounded small light style={Styles.dishItem}>
                              <Text style={Styles.dishText}>{value.kitchenEquipmentTypeName}</Text>
                            </Button>
                          )
                          return chip
                        })
                      : null}
                  </View>
                </View>
              )}
                <View style={Styles.iconText}>
                        <View>
                        <Text style={Styles.heading}>
                        {Languages.bookingDetail.labels.other_kitchen_equipment} :  <Text style={Styles.destext}>
                        {newKitchenEquipment}</Text>
                        </Text>
                       </View>
                      </View>
               <View style={{marginBottom: 5}} />
              </Card>
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
