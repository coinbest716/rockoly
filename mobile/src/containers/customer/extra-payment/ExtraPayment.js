/** @format */

import React, {PureComponent} from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  AsyncStorage,
} from 'react-native'
import {
  ListItem,
  Picker,
  Card,
  CardItem,
  Body,
  Icon,
  Button,
  Textarea,
  Content,
  Form,
  Toast,
} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import MultiSelect from 'react-native-multiple-select'
import StarRating from 'react-native-star-rating'
import moment from 'moment'
import _ from 'lodash'
import {
  commonDateFormat,
  GMTToLocal,
  DATE_TYPE,
  LocalToGMT,
  fetchDate,
  displayTimeFormat,
} from '@utils'
import {
  ChefProfileService,
  PROFILE_DETAIL_EVENT,
  AuthContext,
  CardManagementService,
  CARD_MANAGEMENT_LIST_EVENT,
  BookingHistoryService,
  SettingsService,
  SETTING_KEY_NAME,
  BOOKING_HISTORY_LIST_EVENT,
  PriceCalculationService,
} from '@services'
import {Spinner, CommonButton, Header} from '@components'

import {Images} from '@images'
import {Languages} from '@translations'
import {Theme} from '@theme'
import styles from './styles'
import {RouteNames, ResetStack} from '@navigation'

class ExtraPayment extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isBooking: false,
      isLoading: false,
      chefProfile: {
        chefPicId: null,
        name: '',
        location: '',
        averageRating: 4.3,
        totalReviewCount: 10,
      },
      servicePercentage: 0,
      cardsList: [],
      selectedCardId: undefined,
      complexity: 1,
      noOfGuests: 1,
      additionalServiceValues: [],
      requestComplexity: 1,
      requestNoOfPeople: 1,
      requestTotalPriceUnit: 'USD',
      requestTotalPriceValue: 1,
      chefBookingStripeCommission: 0,
      chefBookingServiceCharge: 0,
      requestStripeCommission: 0,
      requestServiceCharge: 0,
      requestAdditionalServices: [],
      chefBookingCommissionPriceValue: 0,
      chefBookingCommissionPriceUnit: 'USD',
      chefId: '',
      customerId: '',
      additionalPrice: [],
      requestAdditionalPrice: [],
      additionalServiceData: [],
      requestAdditionalServiceData: [],
      requestCommissionPriceValue: 0,
      requestCommissionPriceUnit: 'USD',
    }
  }

  async componentDidMount() {
    CardManagementService.on(CARD_MANAGEMENT_LIST_EVENT.NEW_CARD_ADDED, this.loadCardData)
    const {isLoggedIn, currentUser} = this.context
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.loadBookingData()
        this.loadCardData()
      }
    )
  }

  componentWillUnmount() {
    CardManagementService.off(CARD_MANAGEMENT_LIST_EVENT.CARD_MANAGEMENT_LIST, this.setCardList)
    CardManagementService.off(CARD_MANAGEMENT_LIST_EVENT.NEW_CARD_ADDED, this.loadCardData)
  }

  onValueChange(value) {
    this.setState({
      selectedCardId: value,
    })
  }

  loadBookingData = () => {
    SettingsService.getSettings(SETTING_KEY_NAME.COMMISSION_KEY)
      .then(servicePercentage => {
        // this.setState({isLoading: false})
        const {navigation} = this.props
        let bookingData = {}
        if (navigation.state.params && navigation.state.params.bookingValue) {
          bookingData = navigation.state.params.bookingValue
        } else {
          Alert.alert(Languages.bookNow.alert.no_booking_data)
          this.setState({isLoading: false})
        }

        // let commissionCost = 0
        // if (servicePercentage) {
        //   commissionCost = (servicePercentage / 100) * bookingData.totalCost
        // }

        // const totalPrice = bookingData.totalCost + commissionCost
        console.log('bookingDatavalue', bookingData)
        this.setState(
          {
            bookingData,
            bookingDate: moment(bookingData.chefBookingFromTime).format(commonDateFormat),
            bookingFromTime: GMTToLocal(bookingData.chefBookingFromTime, DATE_TYPE.TIME),
            bookingToTime: GMTToLocal(bookingData.chefBookingToTime, DATE_TYPE.TIME),
            chefPrice: bookingData.chefBookingPriceValue,
            chefBookingPriceValueActual: bookingData.chefBookingPriceValueActual,
            chefBookingStripeCommission: bookingData.chefBookingStripeCommissionPriceValue,
            chefBookingServiceCharge: bookingData.chefBookingServiceChargePriceValue,
            requestStripeCommission: bookingData.requestStripeCommission,
            requestServiceCharge: bookingData.requestServiceCharge,
            chefPriceUnit: bookingData.chefBookingPriceUnit,
            totalPrice: bookingData.totalCost,
            chefProfile: bookingData.chefProfile,
            servicePercentage,
            complexity: bookingData.complexity,
            noOfGuests: bookingData.noOfGuests,
            additionalServiceValues: bookingData.additionalServiceValues
              ? JSON.parse(bookingData.additionalServiceValues)
              : null,
            requestComplexity: bookingData.requestComplexity,
            requestNoOfPeople: bookingData.requestNoOfPeople,
            requestTotalPriceUnit: bookingData.requestTotalPriceUnit,
            requestTotalPriceValue: bookingData.requestTotalPriceValue,
            requestCommissionPriceValue: bookingData.requestCommissionPriceValue,
            requestCommissionPriceUnit: bookingData.requestCommissionPriceUnit,
            requestAdditionalServices: bookingData.requestAdditionalServices
              ? JSON.parse(bookingData.requestAdditionalServices)
              : null,
            chefBookingCommissionPriceValue: bookingData.chefBookingCommissionPriceValue,
            chefBookingCommissionPriceUnit: bookingData.chefBookingCommissionPriceUnit,

            chefId: bookingData.chefId,
            customerId: bookingData.customerId,
            isLoading: false,
          },
          () => {
            console.log('bookingData', bookingData)
            this.getAdditionalServicePrice()
          }
        )
      })
      .catch(e => {
        this.setState({isLoading: false})
        console.log('commiosion', e)
        Alert.alert(Languages.bookNow.alert.commision_percentage)
      })
  }

  getAdditionalServicePrice = () => {
    const {requestAdditionalServices, additionalServiceValues} = this.state
    console.log('getAdditionalServicePrice', requestAdditionalServices, additionalServiceValues)
    if (requestAdditionalServices && requestAdditionalServices.length > 0) {
      const val = []
      const requestAdditional = []
      requestAdditionalServices.map((itemVal, index) => {
        const value = parseFloat(itemVal.price)
        const priceVal = value.toFixed(2)
        const obj = {
          service: itemVal.id,
          price: parseFloat(priceVal),
        }
        requestAdditional.push(obj)
        val.push(parseFloat(priceVal))
      })
      this.setState({
        requestAdditionalPrice: val,
        requestAdditionalServiceData: requestAdditional,
      })
    }

    if (additionalServiceValues && additionalServiceValues.length > 0) {
      const value = []
      const additional = []
      additionalServiceValues.map((itemVal, index) => {
        const priceValue = parseFloat(itemVal.price)
        const priceVal = priceValue.toFixed(2)
        const obj = {
          service: itemVal.id,
          price: parseFloat(priceVal),
        }
        value.push(parseFloat(priceVal))
        additional.push(obj)
      })
      this.setState({
        additionalPrice: value,
        additionalServiceData: additional,
      })
    }
  }

  loadCardData = async () => {
    const {isChef, isLoggedIn, getProfile} = this.context
    const profile = await getProfile()
    if (isLoggedIn === true && !isChef) {
      if (
        profile.hasOwnProperty('customerProfileExtendedsByCustomerId') &&
        Object.keys(profile.customerProfileExtendedsByCustomerId).length !== 0
      ) {
        const value = profile.customerProfileExtendedsByCustomerId
        if (value.nodes && value.nodes.length) {
          if (
            value.nodes[0].hasOwnProperty('customerStripeCustomerId') &&
            value.nodes[0].customerStripeCustomerId
          ) {
            this.setState(
              {
                customerStripeId: value.nodes[0].customerStripeCustomerId,
              },
              () => {
                this.fetchCardData()
              }
            )
          }
        }
      }
    }
  }

  setCardList = ({cardsList}) => {
    if (cardsList && cardsList.hasOwnProperty('stripeGetCustomerCards')) {
      if (
        cardsList.stripeGetCustomerCards.hasOwnProperty('data') &&
        Object.keys(cardsList.stripeGetCustomerCards.data).length !== 0
      ) {
        const value = cardsList.stripeGetCustomerCards.data
        if (value.data !== [] && value.data !== undefined) {
          this.setState({
            cardsList: value.data,
            // selectedCardId: value.data[0].id,
          })
        }
      }
    }
  }

  fetchCardData = () => {
    const {customerStripeId} = this.state
    CardManagementService.on(CARD_MANAGEMENT_LIST_EVENT.CARD_MANAGEMENT_LIST, this.setCardList)
    CardManagementService.getCardData(customerStripeId, 30)
  }

  goToAddCard = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CARD_MANAGEMENT, {continuePayment: true})
  }

  payNow = async () => {
    const {selectedCardId, bookingData, totalPrice} = this.state
    const {getProfile} = this.context
    const profile = await getProfile()
    let stripeCustomerId

    if (!selectedCardId) {
      Alert.alert(Languages.bookNow.alert.select_card)
      return
    }

    if (
      profile &&
      profile.customerProfileExtendedsByCustomerId &&
      profile.customerProfileExtendedsByCustomerId.nodes &&
      profile.customerProfileExtendedsByCustomerId.nodes.length > 0 &&
      profile.customerProfileExtendedsByCustomerId.nodes[0].customerStripeCustomerId
    ) {
      stripeCustomerId =
        profile.customerProfileExtendedsByCustomerId.nodes[0].customerStripeCustomerId
    } else {
      Alert.alert(Languages.bookNow.alert.could_not_proceed)
    }

    Alert.alert(
      Languages.bookNow.alert.confirm_pay_title,
      Languages.bookNow.alert.confirm_pay_alert,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => this.acceptAndPay(stripeCustomerId),
        },
      ],
      {cancelable: true}
    )
  }

  acceptAndPay = stripeCustomerId => {
    const {navigation} = this.props
    const {
      chefBookingPriceValueActual,
      bookingData,
      requestComplexity,
      requestNoOfPeople,
      requestTotalPriceUnit,
      requestTotalPriceValue,
      chefBookingCommissionPriceValue,
      chefBookingStripeCommission,
      chefBookingServiceCharge,
      requestStripeCommission,
      requestServiceCharge,
      chefBookingCommissionPriceUnit,
      requestCommissionPriceValue,
      requestCommissionPriceUnit,
      selectedCardId,
      chefId,
      noOfGuests,
      complexity,
      totalPrice,
      additionalPrice,
      requestAdditionalPrice,
      additionalServiceData,
      requestAdditionalServiceData,
    } = this.state
    let acceptRequestPayload = {}

    let additionalTotalPrice = 0
    let requestAdditionalTotalPrice = 0
    let additionalServiceDataValue
    let requestAdditionalServiceDataValue
    let value

    if (additionalPrice && additionalPrice.length > 0) {
      additionalTotalPrice = _.sum(additionalPrice)
    }

    if (requestAdditionalPrice && requestAdditionalPrice.length > 0) {
      requestAdditionalTotalPrice = _.sum(requestAdditionalPrice)
    }

    if (additionalServiceData && additionalServiceData.length > 0) {
      additionalServiceDataValue = additionalServiceData
    }

    if (requestAdditionalServiceData && requestAdditionalServiceData.length > 0) {
      requestAdditionalServiceDataValue = requestAdditionalServiceData
    }

    if (additionalServiceDataValue && requestAdditionalServiceDataValue) {
      value = [...additionalServiceDataValue, ...requestAdditionalServiceDataValue]
    } else if (additionalServiceDataValue) {
      value = additionalServiceDataValue
    } else if (requestAdditionalServiceDataValue) {
      value = requestAdditionalServiceDataValue
    }

    // const priceValue =
    //   totalPrice -
    //   chefBookingCommissionPriceValue +
    //   (requestTotalPriceValue - requestCommissionPriceValue)
    console.log('debugging1', chefBookingPriceValueActual, requestTotalPriceValue)
    let newPriceValue = chefBookingPriceValueActual + requestTotalPriceValue
    newPriceValue = newPriceValue.toFixed(2)
    const commissionPrice = chefBookingCommissionPriceValue + requestCommissionPriceValue
    const newCommissionPrice = commissionPrice.toFixed(2)
    const TotalPrice = chefBookingPriceValueActual + requestTotalPriceValue - newCommissionPrice
    // + commissionPrice
    const newTotalPrice = TotalPrice.toFixed(2)
    const noOfPeople = noOfGuests + requestNoOfPeople
    const complexityValue = complexity < requestComplexity ? requestComplexity : complexity
    // const additionalPriceValue = additionalTotalPrice + requestAdditionalTotalPrice

    acceptRequestPayload = {
      bookingHistId: bookingData.bookingHistId,
      bookingPriceValue: parseFloat(newPriceValue),
      bookingCommissionPriceValue: parseFloat(newCommissionPrice),
      bookingTotalPriceValue: parseFloat(newTotalPrice),
      bookingNoOfPeople: noOfPeople,
      bookingComplexity: complexityValue,
      bookingAdditionalServices: value || null,
      bookingServiceChargeValue: chefBookingServiceCharge + requestServiceCharge,
      bookingStripeCommissionPriceValue: chefBookingStripeCommission + requestStripeCommission,
      // TODO:BOOPATHI
    }
    const payment = {
      stripeCustomerId,
      cardId: selectedCardId,
      bookingHistId: bookingData.bookingHistId,
      chefId,
      price: requestTotalPriceValue,
      currecy: 'USD',
    }

    this.setState({isLoading: true})

    console.log('acceptAndPay', acceptRequestPayload, payment)
    PriceCalculationService.accpetChefRequestPayment(acceptRequestPayload)
      .then(data => {
        console.log('acceptAndPay amount', data)
        if (data) {
          PriceCalculationService.makePaymentByCustomer(payment)
            .then(paymentData => {
              console.log('paymentData', paymentData)
              this.setState({isLoading: false})
              Toast.show({
                duration: 5000,
                text: Languages.book.toast_messages.pay_request_amount,
              })
              navigation.goBack()
            })
            .catch(error => {
              console.log('payment error', error)
            })
        }
      })
      .catch(error => {
        this.setState({isLoading: false})
        console.log('acceptAndPay error', error)
      })
  }

  renderRating = () => {
    const {chefProfile} = this.state

    let userDetails = {}
    if (chefProfile !== undefined && chefProfile !== null && chefProfile !== {}) {
      userDetails = chefProfile
    }

    return (
      <View style={styles.reviewView}>
        {userDetails && userDetails.averageRating && userDetails.averageRating !== null && (
          <StarRating
            disabled={false}
            maxStars={5}
            starSize={18}
            rating={userDetails.averageRating}
            starStyle={styles.starSpacing}
            fullStarColor={Theme.Colors.primary}
            selectedStar={rating => this.onStarRatingPress(rating)}
          />
        )}
        {userDetails && userDetails.averageRating !== null ? (
          <Text style={styles.avgNumber}>
            {userDetails.averageRating && parseFloat(userDetails.averageRating).toFixed(1)}
          </Text>
        ) : (
          <Text style={styles.avgNumber}>{Languages.bookNow.labels.no_review}</Text>
        )}
        {userDetails && userDetails.totalReviewCount > 0 && (
          <Text style={styles.avgText}>({userDetails.totalReviewCount} reviews)</Text>
        )}
      </View>
    )
  }

  render() {
    const {
      isLoading,
      chefProfile,
      bookingDate,
      bookingFromTime,
      bookingToTime,
      chefPrice,
      chefPriceUnit,
      totalPrice,
      servicePercentage,
      cardsList,
      selectedCardId,
      isBooking,
      requestNotes,
      displaySelectedDishItems,
      dishTypes,
      dishItems,
      bookingData,
      complexity,
      noOfGuests,
      additionalServiceValues,
      priceCalculationFormula,
      additionalPrice,
      requestAdditionalPrice,
      requestCommissionPriceValue,
      requestComplexity,
      requestNoOfPeople,
      requestTotalPriceValue,
      requestAdditionalServices,
    } = this.state

    const {navigation} = this.props

    let additionalTotalPrice = 0
    let complexityCharge = 0
    let chefCharge = 0
    let remChefCharge
    let chefTotalCharge = 0
    let rockolyCharge = 0
    let firstChefCharge = 0
    let totalAmountToPay = 0
    let requestAdditionalTotalPrice = 0

    if (noOfGuests && noOfGuests <= 5) {
      chefCharge = chefPrice * noOfGuests
    }

    if (noOfGuests && noOfGuests > 5) {
      firstChefCharge = chefPrice * 5
      remChefCharge = (noOfGuests - 5) * (chefPrice / 2)
    }

    if (noOfGuests && noOfGuests > 5) {
      complexityCharge =
        (firstChefCharge + remChefCharge) * complexity - (firstChefCharge + remChefCharge)
    } else {
      complexityCharge = chefCharge * complexity - chefCharge
    }

    if (noOfGuests && noOfGuests > 5) {
      chefTotalCharge += chefPrice * 5
      chefTotalCharge += (noOfGuests - 5) * (chefPrice / 2)
      chefTotalCharge *= complexity
      chefTotalCharge += _.sum(additionalPrice)
    } else {
      chefTotalCharge = chefPrice * noOfGuests * complexity + _.sum(additionalPrice)
    }

    if (chefTotalCharge) {
      rockolyCharge = (servicePercentage / 100) * chefTotalCharge
    }

    console.log('servicePercentage', servicePercentage, chefTotalCharge, rockolyCharge)

    if (chefTotalCharge && rockolyCharge) {
      const total = chefTotalCharge + rockolyCharge
      const totalAmount = parseFloat(total)
      totalAmountToPay = totalAmount.toFixed(2)
    }

    if (additionalPrice) {
      additionalTotalPrice = _.sum(additionalPrice)
    }

    if (requestAdditionalPrice) {
      requestAdditionalTotalPrice = _.sum(requestAdditionalPrice)
    }

    if (isLoading) {
      return (
        <View style={styles.container}>
          <Spinner mode="full" />
        </View>
      )
    }
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <Header title="Payment" navigation={navigation} showBack />
        <View style={styles.mainView}>
          {/* display chec profile card */}
          <View style={styles.userInfoContent}>
            <Image
              style={styles.chefImage}
              source={
                chefProfile.chefPicId !== null && chefProfile.chefPicId
                  ? {uri: chefProfile.chefPicId}
                  : Images.common.defaultChefProfile
              }
            />
            <View style={styles.userInfo}>
              {/* <Text style={styles.userName}>{userName}</Text> */}
              <View style={styles.iconNameView}>
                <Text style={styles.text}>
                  {chefProfile.fullName ? chefProfile.fullName : 'No Name'}
                </Text>
              </View>
              <View style={styles.addressView}>
                <Icon type="FontAwesome5" name="map-marker-alt" style={styles.locationIcon} />
                <Text style={styles.addressText}>
                  {chefProfile &&
                    chefProfile.chefProfileExtendedsByChefId &&
                    chefProfile.chefProfileExtendedsByChefId.nodes &&
                    chefProfile.chefProfileExtendedsByChefId.nodes.length &&
                    chefProfile.chefProfileExtendedsByChefId.nodes[0].chefLocationAddress}
                </Text>
              </View>
              {this.renderRating()}
            </View>
          </View>
          <View>
            <ListItem itemDivider>
              <Text style={styles.destext}>{Languages.bookNow.labels.booking_details}</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.booking_date}</Text>
              <Text style={styles.biilingRightText}>{bookingDate}</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.booking_time}</Text>
              <Text style={styles.biilingRightText}>
                {bookingFromTime} - {bookingToTime}
              </Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.service_cost}</Text>
              <Text style={styles.biilingRightText}>${chefPrice}</Text>
            </ListItem>
          </View>
          <View>
            <ListItem itemDivider>
              <Text style={styles.destext}>{Languages.bookNow.labels.pricing_details}</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.no_of_guests}</Text>
              <Text style={styles.biilingRightText}>{noOfGuests} </Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.complexity}</Text>
              <Text style={styles.biilingRightText}>{complexity}X</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.additional_services} </Text>
            </ListItem>
            {additionalServiceValues && additionalServiceValues.length > 0 ? (
              additionalServiceValues.map((item, index) => {
                return (
                  <CardItem>
                    <Body style={styles.serviceView}>
                      <Text style={styles.locationText}>
                        {item.name}: <Text style={styles.destext}>${item.price}</Text>
                      </Text>
                    </Body>
                  </CardItem>
                )
              })
            ) : (
              <Text style={styles.noText}>No services</Text>
            )}
            <ListItem style={{padding: 0}} />
            {/* <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.service_charge}</Text>
              <Text style={styles.biilingRightText}>
                {servicePercentage} {Languages.bookNow.labels.percentage}
              </Text>
            </ListItem> */}
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.total_cost}</Text>
              <Text style={styles.biilingRightText}>
                {chefTotalCharge ? `$${chefTotalCharge.toFixed(2)}` : ''}
              </Text>
            </ListItem>
          </View>
          <View>
            <ListItem itemDivider>
              <Text style={styles.destext}>{Languages.bookNow.labels.billing_details}</Text>
            </ListItem>
            {noOfGuests > 5 ? (
              <View>
                <ListItem>
                  <Text style={styles.destext}>Chef charge for first 5 guests : </Text>
                  <Text style={styles.biilingRightText}>
                    {firstChefCharge ? `$${firstChefCharge.toFixed(2)}` : null}
                  </Text>
                </ListItem>
                <ListItem>
                  <Text style={styles.destext}>Chef charge for after 5 guests : </Text>
                  <Text style={styles.biilingRightText}>
                    {remChefCharge ? `$${remChefCharge.toFixed(2)}` : null}
                  </Text>
                </ListItem>
              </View>
            ) : (
              <ListItem>
                <Text style={styles.destext}>Chef charge</Text>
                <Text style={styles.biilingRightText}>
                  {chefCharge ? `$${chefCharge.toFixed(2)}` : null}
                </Text>
              </ListItem>
            )}
            <ListItem>
              <Text style={styles.destext}>Complexity charge </Text>
              <Text style={styles.biilingRightText}>
                {complexityCharge ? `$${complexityCharge.toFixed(2)}` : `$${0}`}
              </Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>Additional services </Text>
              <Text style={styles.biilingRightText}>
                {additionalTotalPrice ? `$${additionalTotalPrice.toFixed(2)}` : `$${0}`}
              </Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>Total amount Paid </Text>
              <Text style={styles.biilingRightText}>
                {chefTotalCharge ? `$${chefTotalCharge.toFixed(2)}` : null}
              </Text>
            </ListItem>
            {/* <ListItem>
              <Text style={styles.destext}>Rockoly/Payment charges</Text>
              <Text style={styles.biilingRightText}>
                {rockolyCharge ? `$${rockolyCharge.toFixed(2)}` : null}
              </Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>Total amount to pay</Text>
              <Text style={styles.biilingRightText}>${totalAmountToPay}</Text>
            </ListItem> */}
          </View>
          <View>
            <ListItem itemDivider>
              <Text style={styles.destext}>Chef Booking Request Changes</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>Additional no of people:</Text>
              <Text style={styles.biilingRightText}>{requestNoOfPeople}</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>Complexity changes</Text>
              <Text style={styles.biilingRightText}>{requestComplexity}X</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>Extra services Provided </Text>
            </ListItem>
            {requestAdditionalServices && requestAdditionalServices.length > 0 ? (
              requestAdditionalServices.map((item, index) => {
                return (
                  <CardItem>
                    <Body style={styles.serviceView}>
                      <Text style={styles.locationText}>
                        {item.name}: <Text style={styles.destext}>${item.price}</Text>
                      </Text>
                    </Body>
                  </CardItem>
                )
              })
            ) : (
              <Text style={{textAlign: 'center', marginTop: 5}}>No services</Text>
            )}
            <ListItem style={{padding: 0}} />
            <ListItem>
              <Text style={styles.destext}>Extra services amount</Text>
              <Text style={styles.biilingRightText}>
                {requestAdditionalTotalPrice
                  ? `$${requestAdditionalTotalPrice.toFixed(2)}`
                  : `$${0}`}
              </Text>
            </ListItem>
            {/* <ListItem>
              <Text style={styles.destext}>Rockoly/Payment charges</Text>
              <Text style={styles.biilingRightText}>
                {requestCommissionPriceValue ? `$${requestCommissionPriceValue}` : null}
              </Text>
            </ListItem> */}
            <ListItem>
              <Text style={styles.destext}>Total amount</Text>
              <Text style={styles.biilingRightText}>
                {requestTotalPriceValue ? `$${requestTotalPriceValue.toFixed(2)}` : null}
              </Text>
            </ListItem>
          </View>
          <View style={styles.selectCardView}>
            <ListItem itemDivider>
              <Text style={styles.destext}>{Languages.bookNow.labels.payment_details}</Text>
            </ListItem>

            <View style={styles.addCardView}>
              <Button
                style={styles.addCardBtn}
                onPress={() => {
                  this.goToAddCard()
                }}>
                <Text style={styles.addCardBtnText}>{Languages.bookNow.labels.add_card}</Text>
              </Button>
            </View>

            <Picker
              placeholder="Select your Card"
              placeholderStyle={{color: 'black'}}
              textStyle={{color: Theme.Colors.primary}}
              itemStyle={{
                marginHorizontal: 10,
              }}
              iosIcon={<Icon name="arrow-down" />}
              note
              mode="dropdown"
              style={styles.cardPicker}
              selectedValue={selectedCardId}
              onValueChange={this.onValueChange.bind(this)}>
              {cardsList &&
                cardsList.map(item => {
                  return (
                    <Picker.Item
                      label={`${item.brand} - ${Languages.bookNow.labels.secret_code} ${item.last4}`}
                      value={item.id}
                      key={item.id}
                    />
                  )
                })}
            </Picker>
          </View>

          {isBooking && <Spinner mode="full" />}

          <CommonButton
            disabled={isBooking}
            containerStyle={styles.bookNowBtn}
            btnText={Languages.bookNow.labels.pay_now}
            onPress={this.payNow}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

export default ExtraPayment
ExtraPayment.contextType = AuthContext
