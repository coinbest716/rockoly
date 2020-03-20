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
} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import MultiSelect from 'react-native-multiple-select'
import StarRating from 'react-native-star-rating'
import moment from 'moment'
import _ from 'lodash'
import {
  commonDateFormat,
  displayDateTimeFormat,
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
} from '@services'
import {Spinner, CommonButton, Header} from '@components'

import {Images} from '@images'
import {Languages} from '@translations'
import {Theme} from '@theme'
import styles from './styles'
import {RouteNames, ResetStack} from '@navigation'

class BookNow extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isBooking: false,
      isLoading: false,
      // chefProfile: {
      //   chefPicId: null,
      //   name: '',
      //   location: 'dawdawdawdawd dawdawdaw',
      //   averageRating: 4.3,
      //   totalReviewCount: 10,
      // },
      chefProfile: {},
      servicePercentage: 0,
      cardsList: [],
      selectedCardId: undefined,
      requestNotes: '',
      dishTypes: [],
      dishItems: [],
      displaySelectedDishItems: [],
      complexity: 1,
      noOfGuests: 1,
      additionalServiceValues: [],
      priceCalculationFormula: '',
      additionalPrice: [],
    }
  }

  async componentDidMount() {
    CardManagementService.on(CARD_MANAGEMENT_LIST_EVENT.NEW_CARD_ADDED, this.loadCardData)
    const {isLoggedIn, currentUser} = this.context
    await this.loadBookingData()
    this.loadCardData()
    if (isLoggedIn === true) {
      if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
        this.setState(
          {
            chefIdValue: currentUser,
          },
          () => {}
        )
      }
    }
  }

  componentWillUnmount() {
    CardManagementService.off(CARD_MANAGEMENT_LIST_EVENT.CARD_MANAGEMENT_LIST, this.setCardList)
    CardManagementService.off(CARD_MANAGEMENT_LIST_EVENT.NEW_CARD_ADDED, this.loadCardData)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)
  }

  onValueChange(value) {
    this.setState({
      selectedCardId: value,
    })
  }

  loadBookingData = () => {
    SettingsService.getSettings(SETTING_KEY_NAME.COMMISSION_KEY)
      .then(servicePercentage => {
        console.log('servicePercentage', servicePercentage)
        const {navigation} = this.props
        let bookingData = {}
        if (navigation.state.params && navigation.state.params.bookingValue) {
          bookingData = navigation.state.params.bookingValue
          console.log('navigation.state.params.bookingValue', navigation.state.params.bookingValue)
        } else {
          Alert.alert(Languages.bookNow.alert.no_booking_data)
        }

        let commissionCost = 0
        if (servicePercentage) {
          commissionCost = (servicePercentage / 100) * bookingData.totalCost
        }

        const totalPrice = bookingData.totalCost + commissionCost

        const priceCalculationFormula =
          bookingData.noOfGuests > 5
            ? `(${Languages.bookNow.labels.service_cost} * 5 + ((${Languages.bookNow.labels.no_of_guests} - 5) * (${Languages.bookNow.labels.service_cost} / 2)) * ${Languages.bookNow.labels.service_cost})+ ${Languages.bookNow.labels.additional_services} + ${Languages.bookNow.labels.service_charge}`
            : `(${Languages.bookNow.labels.service_cost} * ${Languages.bookNow.labels.no_of_guests} * ${Languages.bookNow.labels.service_cost}) + ${Languages.bookNow.labels.additional_services} + ${Languages.bookNow.labels.service_charge}`
        console.log(bookingData)

        this.setState(
          {
            bookingData,
            bookingDate: moment(bookingData.fromTime).format(commonDateFormat),
            bookingFromTime: moment(bookingData.fromTime).format(displayTimeFormat),
            bookingToTime: moment(bookingData.toTime).format(displayTimeFormat),
            chefPrice: bookingData.chefBookingPriceValue,
            chefPriceUnit: bookingData.chefBookingPriceUnit,
            totalPrice,
            chefProfile: navigation.state.params.chefProfile,
            servicePercentage,
            complexity: bookingData.complexity,
            noOfGuests: bookingData.noOfGuests,
            additionalServiceValues: bookingData.additionalServiceValues,
            additionalPrice: bookingData.additionalPrice,
            priceCalculationFormula,
          },
          () => {
            console.log('bookingData', bookingData)
            this.onDishTypes()
          }
        )
      })
      .catch(e => {
        Alert.alert(Languages.bookNow.alert.commision_percentage)
      })
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

  bookNowConfirm = async () => {
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
      return
    }

    Alert.alert(
      Languages.bookNow.alert.confirm_booking_title,
      Languages.bookNow.alert.confirm_booking_alert,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => this.checkBooking(stripeCustomerId, selectedCardId, bookingData),
        },
      ],
      {cancelable: true}
    )
  }

  checkBooking = (stripeCustomerId, selectedCardId, bookingData) => {
    const {isLoggedIn} = this.context
    const {requestNotes, dishItems} = this.state
    try {
      console.log('Booking Now', {
        stripeCustomerId,
        cardId: selectedCardId,
        chefId: bookingData.chefId,
        customerId: bookingData.customerId,
        fromTime: LocalToGMT(bookingData.fromTime),
        toTime: LocalToGMT(bookingData.toTime),
        notes: requestNotes ? JSON.stringify(requestNotes) : null,
        dishTypeId: dishItems || null,
        summary: bookingData.summary,
        allergyTypeIds: bookingData.allergyTypeIds,
        otherAllergyTypes: bookingData.otherAllergyTypes,
        dietaryRestrictionsTypesIds: bookingData.dietaryRestrictionsTypesIds,
        otherDietaryRestrictionsTypes: bookingData.otherDietaryRestrictionsTypes,
        kitchenEquipmentTypeIds: bookingData.kitchenEquipmentTypeIds,
        otherKitchenEquipmentTypes: bookingData.otherKitchenEquipmentTypes,
        storeTypeIds: bookingData.storeTypeIds,
        otherStoreTypes: bookingData.otherStoreTypes,
        noOfGuests: bookingData.noOfGuests,
        complexity: bookingData.complexity,
        additionalServices: bookingData.additionalServices,
      })

      const GMTFrom = bookingData.fromTime
      const GMTto = bookingData.toTime
      console.log('GMTFrom', GMTFrom)
      BookingHistoryService.checkAvailablity({
        chefId: bookingData.chefId,
        fromTime: fetchDate(bookingData.fromTime),
        toTime: fetchDate(bookingData.toTime),
        gmtFromTime: GMTFrom,
        gmtToTime: GMTto,
      })
        .then(res => {
          if (res && isLoggedIn) {
            this.bookNow({
              stripeCustomerId,
              cardId: selectedCardId,
              chefId: bookingData.chefId,
              customerId: bookingData.customerId,
              fromTime: bookingData.fromTime,
              toTime: bookingData.toTime,

              summary: bookingData.summary ? bookingData.summary : null,

              bookingHistId: bookingData.bookingHistId,

              isDraftYn: false,

              locationAddress: bookingData.locationAddress ? bookingData.locationAddress : null,
              locationLat: bookingData.locationLat ? bookingData.locationLat : null,
              locationLng: bookingData.locationLng ? bookingData.locationLng : null,

              addrLine1: bookingData.addrLine1 ? bookingData.addrLine1 : null,
              addrLine2: bookingData.addrLine2 ? bookingData.addrLine2 : null,
              city: bookingData.city ? bookingData.city : null,
              state: bookingData.state ? bookingData.state : null,
              country: bookingData.country ? bookingData.country : null,
              postalCode: bookingData.postalCode ? bookingData.postalCode : null,

              allergyTypeIds: bookingData.allergyTypeIds ? bookingData.allergyTypeIds : null,

              otherAllergyTypes: bookingData.otherAllergyTypes
                ? bookingData.otherAllergyTypes
                : null,
              dietaryRestrictionsTypesIds: bookingData.dietaryRestrictionsTypesIds
                ? bookingData.dietaryRestrictionsTypesIds
                : null,
              otherDietaryRestrictionsTypes: bookingData.otherDietaryRestrictionsTypes
                ? bookingData.otherDietaryRestrictionsTypes
                : null,

              kitchenEquipmentTypeIds: bookingData.kitchenEquipmentTypeIds
                ? bookingData.kitchenEquipmentTypeIds
                : null,

              otherKitchenEquipmentTypes: bookingData.otherKitchenEquipmentTypes
                ? bookingData.otherKitchenEquipmentTypes
                : null,

              noOfGuests: bookingData.noOfGuests ? bookingData.noOfGuests : null,

              complexity: bookingData.complexity ? bookingData.complexity : null,

              storeTypeIds: bookingData.storeTypeIds ? bookingData.storeTypeIds : null,

              otherStoreTypes: bookingData.otherStoreTypes ? bookingData.otherStoreTypes : null,

              additionalServices: bookingData.additionalServices
                ? bookingData.additionalServices
                : null,

              dishTypeId: bookingData.dishTypeId ? bookingData.dishTypeId : null,
            })
          }
        })
        .catch(e => {
          console.log('Booknow error', e)
        })
    } catch (e) {
      Alert.alert(e.message)
    }
  }

  bookNow = data => {
    const {bookingData} = this.state
    console.log('data', data)
    this.setState({
      isBooking: true,
    })
    const {navigation} = this.props
    if (data) {
      BookingHistoryService.bookNow(data)
        .then(res => {
          if (res) {
            this.setState(
              {
                isBooking: false,
              },
              () => {}
            )
            ResetStack(navigation, RouteNames.BOOKING_DETAIL_SCREEN, {
              bookingHistId: res.data.chef_booking_hist_id,
              bookNow: true,
              showAlert: true,
            })
          } else {
            this.bookingError()
          }
        })
        .catch(error => {
          console.log('bookNow error', error, error.message)
          this.bookingError()
        })
    }
  }

  bookingError = () => {
    this.setState({
      isBooking: false,
    })
    Alert.alert(
      Languages.bookNow.alert.booking_failed_title,
      Languages.bookNow.alert.booking_failed_alert
    )
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

  onChangeNotes = value => {
    this.setState({
      requestNotes: value,
    })
  }

  onDishTypes = async () => {
    const {currentUser} = this.context
    const {bookingData} = this.state
    if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
      if (bookingData !== {} && bookingData !== null) {
        ChefProfileService.on(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)
        ChefProfileService.getDishesData(bookingData.chefId)
      }
    }
  }

  dishesList = ({dishesData}) => {
    if (dishesData.hasOwnProperty('getDishTypes')) {
      const val = dishesData.getDishTypes
      if (val && val.nodes !== [] && val.nodes !== undefined && val.nodes !== null) {
        this.setState({
          dishTypes: val.nodes,
        })
      }
    }
  }

  onSelectedDishItemsChange = dishItems => {
    const {dishTypes} = this.state
    let displaySelectedDishItems = []
    displaySelectedDishItems = _.filter(dishTypes, item => {
      if (dishItems.indexOf(item.dishTypeId) !== -1) {
        return true
      }
    })
    this.setState({dishItems, displaySelectedDishItems})
  }

  addDishItem = value => {
    const val = value[value.length - 1]
    const {chefIdValue} = this.state
    const obj = {
      dishTypeName: val.name,
      chefId: null,
      customerId: chefIdValue.customerId,
    }
    ChefProfileService.on(PROFILE_DETAIL_EVENT.SAVE_NEW_DISH_ITEM, this.setNewDishItem)
    ChefProfileService.saveDishItem(obj)
  }

  setNewDishItem = ({newDishItem}) => {
    const {dishTypes} = this.state
    let temp = []
    if (
      newDishItem.hasOwnProperty('createDishTypeMaster') &&
      newDishItem.createDishTypeMaster !== {}
    ) {
      if (
        newDishItem.createDishTypeMaster.hasOwnProperty('dishTypeMaster') &&
        newDishItem.createDishTypeMaster.dishTypeMaster !== {}
      ) {
        const value = newDishItem.createDishTypeMaster.dishTypeMaster

        temp = dishTypes

        const obj = {
          customerId: value.customerId,
          dishTypeDesc: value.dishTypeDesc,
          dishTypeId: value.dishTypeId,
          dishTypeName: value.dishTypeName,
          isAdminApprovedYn: value.isAdminApprovedYn,
          isManuallyYn: value.isManuallyYn,
        }
        temp.push(obj)
        this.setState(
          {
            dishTypes: temp,
          },
          () => {
            const {dishItems} = this.state
            dishItems.pop()
            const newarray = dishItems
            newarray.push(value.dishTypeId)
            this.onSelectedDishItemsChange(newarray)
          }
        )
      }
    }
  }

  removeSelectedDishItem = removeId => {
    const {dishItems, displaySelectedDishItems} = this.state
    let newSelectedIds = []
    newSelectedIds = _.filter(dishItems, item => item != removeId)

    let newDisplaySelectedDishItems = []
    newDisplaySelectedDishItems = _.filter(
      displaySelectedDishItems,
      item => item.dishTypeId !== removeId
    )

    this.setState({
      dishItems: newSelectedIds,
      displaySelectedDishItems: newDisplaySelectedDishItems,
    })
  }

  render() {
    const {
      isLoading,
      chefProfile,
      bookingDate,
      bookingFromTime,
      bookingToTime,
      chefPrice,
      cardsList,
      selectedCardId,
      isBooking,
      requestNotes,
      displaySelectedDishItems,
      dishTypes,
      dishItems,
      complexity,
      noOfGuests,
      additionalPrice,
      additionalServiceValues,
    } = this.state
    console.log('chefProfile', chefProfile)
    const {navigation} = this.props
    let dishTypesValue = []
    let dishItemsValue = []

    let chefCharge = 0
    let remChefCharge = 0
    let chefTotalCharge = 0
    let firstChefCharge = 0

    let chefAmount = 0
    let complexityUpcharge = 0
    let additionalTotalPrice = 0
    let discount = 0
    let guestCount = 0
    let guestPrice = 0
    let TotalCharge = 0

    if (noOfGuests && chefPrice) {
      chefAmount = chefPrice * noOfGuests
    }
    console.log('chefDetails', chefPrice, noOfGuests, chefAmount)
    if (noOfGuests) {
      guestCount = noOfGuests - 5
    }
    if (chefPrice) {
      guestPrice = chefPrice / 2
    }
    if (noOfGuests > 5) {
      discount = (noOfGuests - 5) * (chefPrice / 2)
    } else {
      discount = 0
    }

    const chefChargeAfterDiscount = chefAmount - discount
    complexityUpcharge = chefChargeAfterDiscount * complexity - chefChargeAfterDiscount
    console.log('chefChargeAfterDiscount', chefChargeAfterDiscount, complexityUpcharge, complexity)
    const discountTotal = chefAmount - discount
    if (noOfGuests && noOfGuests > 5) {
      TotalCharge += discountTotal
      TotalCharge += complexityUpcharge
      TotalCharge += _.sum(additionalPrice)
    } else {
      TotalCharge = chefAmount + complexityUpcharge + _.sum(additionalPrice)
    }
    if (dishTypes && dishTypes !== undefined && dishTypes !== null) {
      dishTypesValue = dishTypes
    }

    if (dishItems && dishItems !== undefined && dishItems !== null) {
      dishItemsValue = dishItems
    }

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
      const total = chefTotalCharge
      const totalAmount = parseFloat(total)
      totalAmountToPay = totalAmount.toFixed(2)
    }

    if (additionalPrice) {
      additionalTotalPrice = _.sum(additionalPrice)
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
        <Header title="Book Now" navigation={navigation} showBack />
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
                    chefProfile.chefProfileExtendedsByChefId.nodes[0].chefCity}
                  ,
                  {chefProfile &&
                    chefProfile.chefProfileExtendedsByChefId &&
                    chefProfile.chefProfileExtendedsByChefId.nodes &&
                    chefProfile.chefProfileExtendedsByChefId.nodes.length &&
                    chefProfile.chefProfileExtendedsByChefId.nodes[0].chefState}
                </Text>
              </View>
              {this.renderRating()}
            </View>
          </View>
          <ListItem itemDivider>
            <Text style={styles.destext}>{Languages.bookNow.labels.desired_dishes}</Text>
          </ListItem>
          <Form>
            <View style={styles.formContainer2}>
              <MultiSelect
                hideTags
                items={dishTypesValue}
                uniqueKey="dishTypeId"
                ref={component => {
                  this.dishSelect = component
                }}
                onSelectedItemsChange={this.onSelectedDishItemsChange}
                selectedItems={dishItemsValue}
                selectText="Select Dish Items"
                searchInputPlaceholderText="Search Items..."
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="dishTypeDesc"
                searchInputStyle={{color: '#CCC'}}
                submitButtonColor={Theme.Colors.primary}
                submitButtonText="Submit"
                canAddItems
                onAddItem={value => this.addDishItem(value)}
              />
              <View style={styles.cusineTagBody}>
                {displaySelectedDishItems && displaySelectedDishItems.length
                  ? displaySelectedDishItems.map((item, key) => {
                      return (
                        <Button key={key} iconRight rounded light style={styles.chipItem}>
                          <Text style={styles.locationText1}>{item.dishTypeName}</Text>
                          <Icon
                            style={{
                              color: '#ccc',
                            }}
                            onPress={() => this.removeSelectedDishItem(item.dishTypeId)}
                            name="close-circle"
                          />
                        </Button>
                      )
                    })
                  : null}
              </View>
            </View>
          </Form>
          <ListItem itemDivider>
            <Text style={styles.destext}>{Languages.bookNow.labels.request_notes}</Text>
          </ListItem>
          <Form style={{paddingVertical: 5}}>
            <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={requestNotes}
              onChangeText={value => this.onChangeNotes(value)}
              placeholderTextColor="#B9BFBB"
              placeholder={Languages.bookNow.labels.notes_placholder}
            />
          </Form>
          <View>
            <ListItem itemDivider>
              <Text style={styles.destext}>{Languages.bookNow.labels.booking_details}</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.booking_date}</Text>
              <Text style={styles.biilingRightText}>{bookingDate}</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.ServingTime}</Text>
              <Text style={styles.biilingRightText}>
                {bookingFromTime} - {bookingToTime}
              </Text>
            </ListItem>
            {/* <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.service_cost} :</Text>
              <Text style={styles.biilingRightText}>${chefPrice}</Text>
            </ListItem> */}
          </View>
          {/* <View>
            <ListItem itemDivider>
              <Text style={styles.destext}>{Languages.bookNow.labels.pricing_details}</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.complexity}</Text>
              <Text style={styles.biilingRightText}>{complexity}X</Text>
            </ListItem>
            <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.no_of_guests}</Text>
              <Text style={styles.biilingRightText}>{noOfGuests}</Text>
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
            <ListItem style={{padding: 0}} /> */}
          {/* <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.service_charge}</Text>
              <Text style={styles.biilingRightText}>
                {servicePercentage} {Languages.bookNow.labels.percentage}
              </Text>
            </ListItem> */}
          {/* <ListItem>
              <Text style={styles.destext}>{Languages.bookNow.labels.total_cost}</Text>
              <Text style={styles.biilingRightText}>
                {' '}
                ${chefTotalCharge ? chefTotalCharge.toFixed(2) : ''}
              </Text>
            </ListItem>
          </View> */}

          <View>
            <ListItem itemDivider>
              <Text style={styles.destext}>{Languages.bookNow.labels.billing_details}</Text>
            </ListItem>
            {noOfGuests > 5 ? (
              <View>
                <ListItem>
                  <Text style={styles.destext}>
                    Chef Base rate ({`$${chefPrice}`}) X ({noOfGuests}) guests.
                  </Text>
                  <Text style={styles.biilingRightText}>
                    {chefAmount ? `$${chefAmount.toFixed(2)}` : null}
                  </Text>
                </ListItem>
                <ListItem>
                  <Text style={styles.discount}>
                    Discount - Over 5 ({guestCount}) guests half chef Base Rate ({`$${guestPrice}`})
                  </Text>
                  <Text style={styles.biilingRightText}>
                    {discount ? `-$${discount.toFixed(2)}` : null}
                  </Text>
                </ListItem>
              </View>
            ) : (
              <ListItem>
                <Text style={styles.destext}>
                  Chef Base rate ({`$${chefPrice}`}) X ({noOfGuests}) guests.
                </Text>
                <Text style={styles.biilingRightText}>
                  {chefAmount ? `$${chefAmount.toFixed(2)}` : null}
                </Text>
              </ListItem>
            )}
            {complexityUpcharge !== 0 && (
              <ListItem>
                <Text style={styles.destext}>Complexity Upcharge</Text>
                <Text style={styles.biilingRightText}>
                  {complexityUpcharge ? `$${complexityUpcharge.toFixed(2)}` : `$${0}`}
                </Text>
              </ListItem>
            )}

            <ListItem>
              <Text style={styles.destext}>Additional services </Text>
              <Text style={styles.biilingRightText}>
                {additionalTotalPrice ? `$${additionalTotalPrice.toFixed(2)}` : null}
              </Text>
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
            <ListItem>
              <Text style={styles.destext}>Total </Text>
              <Text style={styles.biilingRightText}>
                {TotalCharge ? `$${TotalCharge.toFixed(2)}` : null}
              </Text>
            </ListItem>
            {/* <ListItem>
              <Text style={styles.destext}>Rockoly/Payment charges</Text>
              <Text style={styles.biilingRightText}>
                {rockolyCharge ? `$${rockolyCharge.toFixed(2)}` : null}
              </Text>
            </ListItem> */}

            {/* <ListItem>
              <Text style={styles.destext}>Total amount to pay</Text>
              <Text style={styles.biilingRightText}>${totalAmountToPay}</Text>
            </ListItem> */}
          </View>
          <View style={styles.selectCardView}>
            {/* <ListItem itemDivider>
              <Text style={styles.destext}>{Languages.bookNow.labels.payment_details}</Text>
            </ListItem> */}

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
            btnText={Languages.bookNow.labels.book_now}
            onPress={this.bookNowConfirm}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

export default BookNow
BookNow.contextType = AuthContext
