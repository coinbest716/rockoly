/** @format */

import React, {Component} from 'react'
import {View, ScrollView, Platform, Alert} from 'react-native'
import {
  Item,
  Textarea,
  Text,
  CheckBox,
  ListItem,
  Body,
  Icon,
  Button,
  Label,
  Toast,
  Card,
  Picker,
  CardItem,
} from 'native-base'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import Slider from '@react-native-community/slider'
import _ from 'lodash'
import {CommonButton, Spinner, Header} from '@components'
import {Theme} from '@theme'
import {
  AuthContext,
  ProfileViewService,
  PROFILE_VIEW_EVENT,
  PriceCalculationService,
  PRICE_EVENT,
  BookingDetailService,
  BOOKING_DETAIL_EVENT,
  BookingHistoryService,
} from '@services'
import {LocalToGMT} from '@utils'
import {Languages} from '@translations'
import styles from './styles'
import {RouteNames} from '@navigation'

export default class chefRequestPrice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      chefDetail: {},
      guestMin: 0,
      guestMax: 0,
      guestCount: 0,
      foodCostMin: 1,
      foodCostMax: 500,
      complexity: [],
      foodCost: 1,
      additionalServices: [],
      bookingData: {},
      complexitySelected: '',
      additionalPrice: [],
      shopName: undefined,
      otherShopName: '',
      additionalServiceData: [],
      storeData: [],
      storeTypeIdValue: [],
      bookingDetail: {},
      chefProfile: {},
      additionalServiceValues: [],
      invalidGuest: false,
      invalidComplexity: false,
    }
  }

  async componentDidMount() {
    // c9b45c4e-91d7-47cf-ac20-ecff1a1930ee
    const {navigation} = this.props
    ProfileViewService.on(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
    PriceCalculationService.on(PRICE_EVENT.STORE, this.getStoreList)
    BookingDetailService.on(BOOKING_DETAIL_EVENT.BOOKING_DETAIL, this.setBookingDetail)
    if (navigation.state.params && navigation.state.params.bookingValue) {
      const {bookingValue} = navigation.state.params
      console.log('bookingVaule', bookingValue)
      this.setState(
        {
          bookingData: bookingValue,
        },
        () => {
          this.onLoadData()
          this.loadBookingData()
        }
      )
    }
    this.loadStoreData()
  }

  componentWillUnmount() {
    ProfileViewService.off(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
    PriceCalculationService.off(PRICE_EVENT.STORE, this.getStoreList)
    BookingDetailService.off(BOOKING_DETAIL_EVENT.BOOKING_DETAIL, this.setBookingDetail)
  }

  onLoadData = () => {
    const {bookingData} = this.state
    this.setState(
      {
        isLoading: true,
      },
      () => {
        ProfileViewService.getProfileDetails(bookingData.chefId)
      }
    )
  }

  loadBookingData = () => {
    const {bookingData} = this.state
    console.log('bookingData', bookingData)
    if (bookingData && bookingData.bookingHistId) {
      BookingDetailService.getBookingDetail(bookingData.bookingHistId)
    }
  }

  setBookingDetail = ({bookingDetail}) => {
    if (bookingDetail) {
      console.log('bookingDetail', bookingDetail)
      this.setState(
        {
          bookingDetail,
        },
        () => {
          if (bookingDetail) {
            this.setState(
              {
                guestCount: bookingDetail.chefBookingNoOfPeople
                  ? bookingDetail.chefBookingNoOfPeople
                  : 0,
                // guestMin: bookingDetail.chefBookingNoOfPeople
                //   ? bookingDetail.chefBookingNoOfPeople
                //   : 0,
                complexitySelected: bookingDetail.chefBookingComplexity
                  ? `${bookingDetail.chefBookingComplexity}X`
                  : null,
                // additionalServices: bookingDetail.additionalServiceDetails
                //   ? JSON.parse(bookingDetail.additionalServiceDetails)
                //   : null,
                shopName:
                  bookingDetail.storeTypes.nodes.length < 0 &&
                  bookingDetail.storeTypes.nodes[0].storeTypeId
                    ? bookingDetail.storeTypes.nodes[0].storeTypeId
                    : null,
                originalNoOfGuest: bookingDetail.chefBookingNoOfPeople
                  ? bookingDetail.chefBookingNoOfPeople
                  : 0,
                originalComplexity: bookingDetail.chefBookingComplexity
                  ? `${bookingDetail.chefBookingComplexity}X`
                  : null,
                originalAdditionalServices: bookingDetail.additionalServiceDetails
                  ? JSON.parse(bookingDetail.additionalServiceDetails)
                  : null,
                otherShopName: bookingDetail.chefBookingOtherStoreTypes
                  ? JSON.parse(bookingDetail.chefBookingOtherStoreTypes)
                  : null,
              },
              () => {
                if (bookingDetail && bookingDetail.additionalServiceDetails) {
                  this.loadServices()
                }
                // this.loadAdditionalServices()
              }
            )
          }
        }
      )
    }
  }

  loadStoreData = () => {
    PriceCalculationService.getStoreData()
  }

  getStoreList = ({storeData}) => {
    console.log('storeData', storeData)
    this.setState(
      {
        storeData,
      },
      () => {}
    )
  }

  setList = ({profileDetails}) => {
    this.setState({
      isLoading: false,
    })
    console.log('profileDetails', profileDetails)
    if (profileDetails) {
      if (
        profileDetails.chefProfileByChefId &&
        profileDetails.chefProfileByChefId.chefProfileExtendedsByChefId &&
        profileDetails.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]
      ) {
        const chefData = profileDetails.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]

        this.setState(
          {
            chefDetail: chefData,
            guestMin: chefData.noOfGuestsMin ? chefData.noOfGuestsMin : 0,
            // guestCount: chefData.noOfGuestsMin ? chefData.noOfGuestsMin : 0,
            guestMax: chefData.noOfGuestsMax ? chefData.noOfGuestsMax : 0,
            complexity: chefData.chefComplexity ? JSON.parse(chefData.chefComplexity) : null,
            additionalServices: chefData.additionalServiceDetails
              ? JSON.parse(chefData.additionalServiceDetails)
              : null,
            // originalAdditionalServices: chefData.additionalServiceDetails
            //   ? JSON.parse(chefData.additionalServiceDetails)
            //   : null,
          },
          () => {
            // this.loadComplexity()
            this.loadAdditionalServices()
          }
        )
      }
    }
  }

  // loadComplexity = () => {
  //   const {complexity} = this.state
  //   const temp = []
  //   complexity.map((item, index) => {
  //     const val = {
  //       complexcityLevel: item.complexcityLevel,
  //       dishes: item.dishes,
  //       noOfItems: {
  //         min: item.noOfItems.min,
  //         max: item.noOfItems.max,
  //       },
  //       checked: false,
  //     }
  //     temp.push(val)
  //   })
  //   this.setState(
  //     {
  //       complexity: temp,
  //     },
  //     () => {}
  //   )
  // }

  loadAdditionalServices = () => {
    const {additionalServices, bookingDetail} = this.state
    const temp = []
    if (additionalServices) {
      additionalServices.map((item, index) => {
        const value = parseFloat(item.price)
        const priceVal = value.toFixed(2)
        const val = {
          id: item.id,
          price: priceVal,
          checked: false,
          name: item.name,
          desc: item.desc,
        }
        temp.push(val)
      })
      this.setState(
        {
          additionalServices: temp,
        },
        () => {
          if (bookingDetail && bookingDetail.additionalServiceDetails) {
            this.loadServices()
          }
        }
      )
    }
  }

  loadServices = () => {
    const {bookingDetail, additionalServices} = this.state

    const additionalServicesType = additionalServices

    const temp = []

    additionalServicesType.map((res, index) => {
      const obj = {
        id: res.id,
        price: res.price,
        checked:
          bookingDetail && bookingDetail.additionalServiceDetails
            ? !JSON.parse(bookingDetail.additionalServiceDetails).every(item => item.id !== res.id)
            : false,
        name: res.name,
        desc: res.desc,
        disabled:
          bookingDetail && bookingDetail.additionalServiceDetails
            ? !JSON.parse(bookingDetail.additionalServiceDetails).every(item => item.id !== res.id)
            : false,
      }
      temp.push(obj)
    })

    this.setState(
      {
        additionalServices: temp,
      },
      async () => {
        console.log('additionalServices', additionalServices, temp)
        this.checkAdditionalValues()
      }
    )
  }

  checkAdditionalValues = async () => {
    const {additionalServices} = this.state
    const val = []
    const additionalServiceValues = []

    await additionalServices.map((itemVal, index) => {
      console.log('itemVal', itemVal)
      if (itemVal.checked === true) {
        const value = parseFloat(itemVal.price)
        const priceVal = value.toFixed(2)
        val.push(parseFloat(priceVal))

        const additionalData = {
          id: itemVal.id,
          price: itemVal.price,
          checked: itemVal.checked,
          name: itemVal.name,
          desc: itemVal.desc,
        }
        additionalServiceValues.push(additionalData)
      }
    })
    this.setState(
      {
        additionalPrice: val,
        additionalServiceValues,
      },
      () => {}
    )
  }

  // onChecked = (index, checked) => {
  //   console.log('onChecked', index, checked)
  //   const {complexity} = this.state
  //   const temp = complexity

  //   if (temp[index]) {
  //     temp[index].checked = !checked
  //   }

  //   this.setState(
  //     {
  //       complexity: temp,
  //     },
  //     async () => {
  //       console.log('complexity', complexity)
  //     }
  //   )
  // }

  onServiceChecked = (index, checked) => {
    console.log('onServiceChecked', index, checked)
    const {additionalServices} = this.state
    const temp = additionalServices

    if (temp[index]) {
      temp[index].checked = !checked
    }

    this.setState(
      {
        additionalServices: temp,
      },
      async () => {
        const val = []
        const services = []
        const additionalServiceValues = []
        await additionalServices.map((itemVal, index) => {
          if (itemVal.checked === true) {
            const value = parseFloat(itemVal.price)
            const priceVal = value.toFixed(2)
            const obj = {
              service: itemVal.id,
              price: parseFloat(priceVal),
            }
            const additionalData = {
              id: itemVal.id,
              price: itemVal.price,
              checked: itemVal.checked,
              name: itemVal.name,
              desc: itemVal.desc,
            }
            additionalServiceValues.push(additionalData)
            services.push(obj)
            val.push(parseFloat(priceVal))
          }
        })
        this.setState(
          {
            additionalPrice: val,
            additionalServiceData: services,
            additionalServiceValues,
          },
          () => {}
        )
      }
    )
  }

  onBook = async () => {
    console.log('onBook')
    const {navigation} = this.props
    const {
      chefDetail,
      guestCount,
      complexitySelected,
      additionalPrice,
      bookingData,
      additionalServiceData,
      storeTypeIdValue,
      storeData,
      shopName,
      otherShopName,
      additionalServiceValues,
      guestMin,
      chefProfile,
    } = this.state

    const {getProfile} = this.context
    const profile = await getProfile()

    let preferences
    let chefPrice
    let selectedValue

    if (profile && profile.customerPreferenceProfilesByCustomerId) {
      if (
        profile.customerPreferenceProfilesByCustomerId &&
        profile.customerPreferenceProfilesByCustomerId.nodes.length > 0
      ) {
        preferences = profile.customerPreferenceProfilesByCustomerId.nodes[0]
      }
    }

    if (chefDetail.chefPricePerHour) {
      chefPrice = chefDetail.chefPricePerHour
    }

    if (complexitySelected === '1X') {
      selectedValue = 1
    } else if (complexitySelected === '1.5X') {
      selectedValue = 1.5
    } else if (complexitySelected === '2X') {
      selectedValue = 2
    }

    // if (!shopName) {
    //   Alert.alert('Please select store')
    //   return
    // }

    let storeId

    if (shopName === '' || shopName === undefined) {
      if (storeData && storeData.length > 0) {
        storeId = [storeData[0].storeTypeId]
      }
    } else {
      storeId = storeTypeIdValue
    }

    if (complexitySelected === '') {
      Alert.alert('Info', 'Please select complexity')
      return
    }

    console.log('bookingData', bookingData)
    if (bookingData) {
      BookingHistoryService.bookNow({
        stripeCustomerId: null,
        cardId: null,
        chefId: bookingData.chefId,
        customerId: bookingData.customerId,
        fromTime: LocalToGMT(bookingData.fromTime),
        toTime: LocalToGMT(bookingData.toTime),
        notes: null,
        dishTypeId: null,
        summary: bookingData.summary ? JSON.stringify(bookingData.summary) : null,
        allergyTypeIds: bookingData.allergyTypeIds ? bookingData.allergyTypeIds : null,
        otherAllergyTypes: bookingData.otherAllergyTypes ? bookingData.otherAllergyTypes : null,
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
        storeTypeIds: storeId || null,
        otherStoreTypes:
          shopName && shopName.trim() === 'OTHERS' && otherShopName !== ''
            ? JSON.stringify(otherShopName)
            : null,
        noOfGuests: guestCount || guestMin,
        complexity: selectedValue,
        additionalServices:
          additionalServiceData && additionalServiceData.length > 0 ? additionalServiceData : null,
        locationAddress: bookingData.locationAddress ? bookingData.locationAddress : null,
        locationLat: bookingData.locationLat ? bookingData.locationLat : null,
        locationLng: bookingData.locationLng ? bookingData.locationLng : null,
        addrLine1: bookingData.addrLine1 ? bookingData.addrLine1 : null,
        addrLine2: bookingData.addrLine2 ? bookingData.addrLine2 : null,
        state: bookingData.state ? bookingData.state : null,
        country: bookingData.country ? bookingData.country : null,
        city: bookingData.city ? bookingData.city : null,
        postalCode: bookingData.postalCode ? bookingData.postalCode : null,
        isDraftYn: true,
        bookingHistId: bookingData.bookingHistId,
      })
        .then(detail => {
          console.log('value', detail)
          const bookingValue = {
            chefId: bookingData.chefId,
            customerId: bookingData.customerId,
            chefBookingFromTime: bookingData.fromTime,
            chefBookingToTime: bookingData.toTime,
            summary: bookingData.summary,
            chefProfile: bookingData.chefProfile,
            allergyTypeIds: bookingData.allergyTypeIds,
            otherAllergyTypes: bookingData.otherAllergyTypes,
            dietaryRestrictionsTypesIds: bookingData.dietaryRestrictionsTypesIds,
            otherDietaryRestrictionsTypes: bookingData.otherDietaryRestrictionsTypes,
            kitchenEquipmentTypeIds: bookingData.kitchenEquipmentTypeIds,
            otherKitchenEquipmentTypes: bookingData.otherKitchenEquipmentTypes,
            storeTypeIds: storeId || null,
            otherStoreTypes:
              shopName && shopName.trim() === 'OTHERS' && otherShopName !== ''
                ? JSON.stringify(otherShopName)
                : null,
            noOfGuests: guestCount || guestMin,
            complexity: selectedValue,
            additionalServices:
              additionalServiceData && additionalServiceData.length > 0
                ? additionalServiceData
                : null,
            totalCost: this.getTotalPrice(selectedValue, chefPrice, guestCount, additionalPrice),
            chefBookingPriceValue: chefPrice,
            chefBookingPriceUnit: 'USD',
            additionalServiceValues,
            additionalPrice,
            locationAddress: bookingData.locationAddress,
            locationLat: bookingData.locationLat,
            locationLng: bookingData.locationLng,
            addrLine1: bookingData.addrLine1,
            addrLine2: bookingData.addrLine2,
            state: bookingData.state,
            country: bookingData.country,
            city: bookingData.city,
            postalCode: bookingData.postalCode,
            bookingHistId: bookingData.bookingHistId,
          }
          navigation.navigate(RouteNames.BOOK_NOW, {bookingValue})
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  }

  onSelected = complexcityLevel => {
    this.setState(
      {
        complexitySelected: complexcityLevel,
      },
      () => {
        this.checkComplexity()
      }
    )
  }

  checkComplexity = () => {
    const {complexitySelected, originalComplexity} = this.state
    let selectedValue
    let originalSelectedvalue

    if (originalComplexity && complexitySelected) {
      if (complexitySelected === '1X') {
        selectedValue = 1
      } else if (complexitySelected === '1.5X') {
        selectedValue = 1.5
      } else if (complexitySelected === '2X') {
        selectedValue = 2
      }

      if (originalComplexity === '1X') {
        originalSelectedvalue = 1
      } else if (originalComplexity === '1.5X') {
        originalSelectedvalue = 1.5
      } else if (originalComplexity === '2X') {
        originalSelectedvalue = 2
      }
      console.log('complexitySelected', selectedValue, originalSelectedvalue)
      if (selectedValue && originalSelectedvalue) {
        if (selectedValue >= originalSelectedvalue) {
          this.setState({
            invalidComplexity: false,
          })
        } else {
          this.setState({
            invalidComplexity: true,
          })
        }
      }
    }
  }

  onChangeShop = value => {
    const {storeData} = this.state
    this.setState(
      {
        shopName: value,
      },
      () => {
        const storeId = []
        storeData.map((item, key) => {
          if (item.storeTypeId.trim() === value.trim()) {
            storeId.push(value)
          }
        })
        this.setState({
          storeTypeIdValue: storeId,
        })
      }
    )
  }

  onChangeOtherShop = value => {
    this.setState({
      otherShopName: value,
    })
  }

  onRequest = () => {
    console.log('onRequest')
    const {navigation} = this.props
    const {
      bookingData,
      guestCount,
      additionalPrice,
      complexitySelected,
      // additionalServiceData,
      chefDetail,
      originalAdditionalServices,
      additionalServiceData,
      originalNoOfGuest,
      originalComplexity,
      bookingDetail,
      invalidComplexity,
      invalidGuest
    } = this.state

    let newService = []
    let newAdditionalPrice = []
    let selectedValue
    let originalSelectedvalue
    let chefPrice
    let newComplexity
    let newGuest

    if (guestCount && originalNoOfGuest && guestCount >= originalNoOfGuest) {
      newGuest = guestCount - originalNoOfGuest
    } else {
      newGuest = 0
    }

    if (
      originalAdditionalServices &&
      originalAdditionalServices.length &&
      additionalServiceData &&
      additionalServiceData.length
    ) {
      additionalServiceData.map(item => {
        const findItem = _.find(originalAdditionalServices, org => {
          return org.id === item.service
        })
        if (!findItem) {
          const value = parseFloat(item.price)
          const priceVal = value.toFixed(2)
          newService.push(item)
          newAdditionalPrice.push(parseFloat(priceVal))
        }
      })
    } else {
      newService =
        additionalServiceData && additionalServiceData.length > 0 ? additionalServiceData : null
      newAdditionalPrice = additionalPrice
    }

    if (complexitySelected === '1X') {
      selectedValue = 1
    } else if (complexitySelected === '1.5X') {
      selectedValue = 1.5
    } else if (complexitySelected === '2X') {
      selectedValue = 2
    }

    if (originalComplexity === '1X') {
      originalSelectedvalue = 1
    } else if (originalComplexity === '1.5X') {
      originalSelectedvalue = 1.5
    } else if (originalComplexity === '2X') {
      originalSelectedvalue = 2
    }

    if (selectedValue && originalSelectedvalue && selectedValue > originalSelectedvalue) {
      newComplexity = selectedValue
    } else {
      newComplexity = originalSelectedvalue
    }

    // if (
    //   bookingData &&
    //   bookingData.chefProfile &&
    //   bookingData.chefProfile.chefProfileExtendedsByChefId &&
    //   bookingData.chefProfile.chefProfileExtendedsByChefId.nodes[0] &&
    //   bookingData.chefProfile.chefProfileExtendedsByChefId.nodes[0].chefPricePerHour
    // ) {
    //   chefPrice = bookingData.chefProfile.chefProfileExtendedsByChefId.nodes[0].chefPricePerHour
    // }

    if (chefDetail.chefPricePerHour) {
      chefPrice = chefDetail.chefPricePerHour
    }

    const newPriceValue = this.getTotalPrice(selectedValue, chefPrice, guestCount, additionalPrice)
    const newPrice = newPriceValue - bookingDetail.chefBookingPriceValue

    const commissionCost = 0
    let commissionCost2 = 0
    if (bookingDetail.chefBookingServiceChargePriceValue) {
      commissionCost2 =
        (bookingDetail.chefBookingServiceChargePriceValue / 100) * newPrice +
        bookingDetail.chefBookingStripeCommissionPriceValue
      // TODO:BOOPATHI
    }
    console.log('commissionCost2', commissionCost2)
    const totalPrice = newPrice - commissionCost2

    const chefTotalPrice = newPrice

    const newTotalPrice = totalPrice.toFixed(2)

    const newCommisionCost = commissionCost.toFixed(2)
    const newCommisionCost2 = commissionCost2.toFixed(2)

    console.log('newPrice', newPrice, totalPrice)
    const obj = {
      bookingHistId: bookingData.bookingHistId,
      chefId: bookingData.chefId,
      customerId: bookingData.customerId,
      chefBookingRequestNoOfPeople: newGuest,
      chefBookingRequestComplexity: newComplexity,
      chefBookingRequestAdditionalServices: newService ? JSON.stringify(newService) : null,
      chefBookingRequestServiceChargePriceUnit: '%',
      chefBookingRequestServiceChargePriceValue: bookingDetail.chefBookingServiceChargePriceValue,
      chefBookingRequestStripeCommissionPriceUnit: 'USD',
      chefBookingRequestStripeCommissionPriceValue:
        bookingDetail.chefBookingStripeCommissionPriceValue,
      // TODO:BOOPATHI
      chefBookingRequestCommissionPriceUnit: 'USD',
      chefBookingRequestCommissionPriceValue: newCommisionCost2 ? parseFloat(newCommisionCost2) : 0,
      chefBookingRequestPriceValue: chefTotalPrice,
      chefBookingRequestPriceUnit: 'USD',
      chefBookingRequestTotalPriceUnit: 'USD',
      chefBookingRequestTotalPriceValue: parseFloat(newTotalPrice),
      // this.getTotalPrice(
      //   newComplexity,
      //   chefPrice,
      //   newGuest,
      //   newAdditionalPrice
      // ),
    }
    console.log('onRequest', obj)

    if (newGuest === 0 && newService === null) {
      Alert.alert(
        'Info',
        'Please update atleast any one values (guest/complexity/additional services)'
      )
      return
    }

    if (invalidComplexity == true) {
      Alert.alert(
        'Info',
        'Please update complexity should be greater than or equal to the booking complexity'
      )
      return
    }

    if(invalidGuest === true) {
      Alert.alert(
        'Info',
        'Please update guest count should be greater than or equal to the booking count'
      )
      return
    }

    PriceCalculationService.requestAmountByChef(obj)
      .then(data => {
        console.log('Request', data)
        Toast.show({
          duration: 5000,
          text: Languages.book.toast_messages.requestAmount,
        })
        navigation.goBack()
      })
      .catch(error => {
        console.log('Request error', error)
      })
  }

  getTotalPrice = (selectedValue, chefPrice, guestCount, additionalPrice) => {
    console.log('getTotalPrice', selectedValue, chefPrice, guestCount, additionalPrice)
    let chefTotalCharge = 0
    if (guestCount > 5) {
      chefTotalCharge += chefPrice * 5
      chefTotalCharge += (guestCount - 5) * (chefPrice / 2)
      chefTotalCharge *= selectedValue
      chefTotalCharge += _.sum(additionalPrice)
      return chefTotalCharge
    }
    if (guestCount <= 5) {
      chefTotalCharge = chefPrice * guestCount * selectedValue + _.sum(additionalPrice)
      return chefTotalCharge
    }
  }

  onChangeGuestCount = value => {
    const {originalNoOfGuest} = this.state
    this.setState(
      {
        guestCount: value,
      },
      () => {
        if (this.state.guestCount && originalNoOfGuest) {
          if (this.state.guestCount >= originalNoOfGuest) {
            this.setState({
              invalidGuest: false,
            })
          } else {
            this.setState({
              invalidGuest: true,
            })
          }
        }
      }
    )
  }

  radioButton = props => {
    return (
      <View
        style={[
          {
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: props.selected ? props.selectedColor : Theme.Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          },
          props.style,
        ]}>
        {props.selected ? (
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: props.selected ? props.selectedColor : Theme.Colors.primary,
            }}
          />
        ) : null}
      </View>
    )
  }

  render() {
    const {
      isLoading,
      chefDetail,
      guestMin,
      guestMax,
      guestCount,
      complexity,
      foodCostMax,
      foodCostMin,
      foodCost,
      additionalServices,
      shopName,
      otherShopName,
      storeData,
      bookingDetail,
      bookingData,
      additionalServiceValues,
      additionalPrice,
      complexitySelected,
      originalAdditionalServices,
      additionalServiceData,
      originalNoOfGuest,
      originalComplexity,
      invalidGuest,
      invalidComplexity,
      hideRequestBtn,
    } = this.state
    console.log('chefDetail', chefDetail)
    console.log('bookingDetail', bookingDetail)
    let chefPrice
    let additionalTotalPrice = 0
    let selectedValue
    let newService = []
    let newAdditionalPrice = []
    let originalSelectedvalue
    let newComplexity
    let newGuest
    let newAdditionalTotalPrice = 0
    let chefTotal = 0
    let newPrice = 0

    if (chefDetail.chefPricePerHour) {
      chefPrice = chefDetail.chefPricePerHour
    }

    if (additionalPrice) {
      additionalTotalPrice = _.sum(additionalPrice)
    }

    if (guestCount && originalNoOfGuest && guestCount >= originalNoOfGuest) {
      newGuest = guestCount - originalNoOfGuest
    } else {
      newGuest = 0
    }

    if (
      originalAdditionalServices &&
      originalAdditionalServices.length &&
      additionalServiceValues &&
      additionalServiceValues.length
    ) {
      additionalServiceValues.map(item => {
        const findItem = _.find(originalAdditionalServices, org => {
          console.log('org', org)
          return org.id === item.id
        })
        if (!findItem) {
          const value = parseFloat(item.price)
          const priceVal = value.toFixed(2)
          newService.push(item)
          newAdditionalPrice.push(parseFloat(priceVal))
        }
      })
    } else {
      newService =
        additionalServiceValues && additionalServiceValues.length > 0
          ? additionalServiceValues
          : null
      newAdditionalPrice = additionalPrice
    }

    console.log('newAdditionalPrice', newAdditionalPrice, newAdditionalTotalPrice)

    if (newAdditionalPrice) {
      newAdditionalTotalPrice = _.sum(newAdditionalPrice)
    }

    if (complexitySelected === '1X') {
      selectedValue = 1
    } else if (complexitySelected === '1.5X') {
      selectedValue = 1.5
    } else if (complexitySelected === '2X') {
      selectedValue = 2
    }

    if (originalComplexity === '1X') {
      originalSelectedvalue = 1
    } else if (originalComplexity === '1.5X') {
      originalSelectedvalue = 1.5
    } else if (originalComplexity === '2X') {
      originalSelectedvalue = 2
    }

    if (selectedValue && originalSelectedvalue && selectedValue > originalSelectedvalue) {
      newComplexity = selectedValue
    } else {
      newComplexity = originalSelectedvalue
    }

    const newPriceValue = this.getTotalPrice(selectedValue, chefPrice, guestCount, additionalPrice)
    console.log('newPriceValue', newPriceValue)

    if (
      newPriceValue &&
      bookingDetail.chefBookingPriceValue &&
      newPriceValue > bookingDetail.chefBookingPriceValue
    ) {
      newPrice = newPriceValue - bookingDetail.chefBookingPriceValue
    } else {
      newPrice = bookingDetail.chefBookingPriceValue - newPriceValue
    }

    const commissionCost = 0
    // if (bookingDetail.chefBookingServiceChargePriceValue) {
    //   commissionCost = (bookingDetail.chefBookingServiceChargePriceValue / 100) * newPrice
    // }

    const totalPrice = newPrice + commissionCost

    const newTotalPrice = totalPrice.toFixed(2)

    if (commissionCost && newTotalPrice) {
      chefTotal = newTotalPrice - commissionCost
    }

    if (isLoading) {
      return <Spinner mode="full" />
    }
    return (
      <View style={{flex: 1}}>
        <Header showBack title={Languages.book.labels.pricing_calculator} showBell={false} />
        <ScrollView style={{marginHorizontal: '2.5%', paddingBottom: '10%'}}>
          <View
            style={{
              marginVertical: 15,
              marginHorizontal: 10,
              flexDirection: 'column',
            }}>
            <Text style={{color: 'black'}}>Chef Base Rate</Text>
            <Text style={{marginTop: 10}}>${chefPrice}</Text>
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              marginVertical: 5,
              marginHorizontal: 5,
              justifyContent: 'space-between',
            }}>
            <Label>Gratuity</Label>
            <Text>{gratuity} %</Text>
          </View> */}
          <View
            style={{
              marginVertical: 15,
              marginHorizontal: 10,
            }}>
            <Text style={{color: 'black'}}>Number of Guests</Text>
            <Slider
              style={{width: 'auto', marginTop: 10}}
              step={1}
              minimumValue={guestMin}
              maximumValue={guestMax}
              value={guestCount}
              onValueChange={val => this.onChangeGuestCount(val)}
              maximumTrackTintColor="#000000"
              minimumTrackTintColor={Theme.Colors.primary}
            />
            <View style={styles.textCon}>
              <Text>{guestMin}</Text>
              <Text>{guestCount || guestMin}</Text>
              <Text>{guestMax} </Text>
            </View>
          </View>
          {invalidGuest === true && (
            <Text style={{textAlign: 'center', color: Theme.Colors.error, fontSize: 14}}>
              Guest count should be greater than or equal to the booking count
            </Text>
          )}
          <Card style={styles.cardStyle}>
            <CardItem header bordered>
              <Text style={{color: 'black'}}>Select Complexity</Text>
            </CardItem>
            {complexity &&
              complexity.length > 0 &&
              complexity.map((item, index) => {
                return (
                  <CardItem bordered={complexity.length !== index + 1}>
                    <Body>
                      <View style={{display: 'flex', flexDirection: 'column'}}>
                        {/* <ListItem style={{borderBottomWidth: 0}}>
                      <CheckBox
                        checked={item.checked}
                        onPress={() => this.onChecked(index, item.checked)}
                        color={Theme.Colors.primary}
                      />
                      <Body>
                        <Text>{item.complexcityLevel}</Text>
                      </Body>
                    </ListItem> */}
                        <View>
                          <ListItem
                            style={{borderBottomWidth: 0}}
                            key={index}
                            onPress={() => this.onSelected(item.complexcityLevel)}>
                            {this.radioButton({
                              selected: item.complexcityLevel === this.state.complexitySelected,
                              selectedColor: Theme.Colors.primary,
                            })}
                            <Text style={styles.complexityText}>
                              Select {item.complexcityLevel}
                            </Text>
                          </ListItem>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                          <Text style={styles.label}>
                            Desired Dishes : <Text style={{fontSize: 14}}>{item.dishes}</Text>
                          </Text>
                          <Text style={styles.label}>
                            Between <Text style={{fontSize: 14}}>{item.noOfItems.min}</Text>
                            <Text style={{fontSize: 14}}> - </Text>
                            <Text style={{fontSize: 14}}>{item.noOfItems.max}</Text> Menu Items
                          </Text>
                        </View>
                      </View>
                    </Body>
                  </CardItem>
                )
              })}
          </Card>
          {invalidComplexity === true && (
            <Text
              style={{
                textAlign: 'center',
                color: Theme.Colors.error,
                fontSize: 14,
                marginTop: 10,
                marginHorizontal: 3,
              }}>
              Complexity should be greater than or equal to the booking complexity
            </Text>
          )}
          <Card style={styles.cardStyle}>
            <CardItem header bordered>
              <Text style={{color: 'black'}}>Select Additional Services Provided by Chef</Text>
            </CardItem>

            {additionalServices &&
              additionalServices.length > 0 &&
              additionalServices.map((item, index) => {
                return (
                  <View>
                    <View>
                      <ListItem style={{borderBottomWidth: 0}}>
                        {item.disabled === true ? (
                          <CheckBox checked={item.checked} color={Theme.Colors.lightgrey} />
                        ) : (
                          <CheckBox
                            checked={item.checked}
                            onPress={() => this.onServiceChecked(index, item.checked)}
                            color={Theme.Colors.primary}
                          />
                        )}
                        <Body>
                          <Text>{item.name}</Text>
                        </Body>
                      </ListItem>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                      <Label style={styles.label}>Price</Label>
                      <Text>${item.price}</Text>
                    </View>
                  </View>
                )
              })}
          </Card>
          {!bookingData.bookingHistId && (
            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>
                  You will be provided with receipt for the cost of ingredients by your chef from
                  following store.
                </Text>
              </CardItem>
              <Item
                picker
                style={{
                  borderBottomColor: 'white',
                }}>
                <Picker
                  note
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  textStyle={{color: '#000000'}}
                  placeholder={Languages.booking_History.buttonLabels.select_status}
                  placeholderStyle={{color: '#000000'}}
                  placeholderIconColor="#000000"
                  selectedValue={shopName}
                  onValueChange={value => this.onChangeShop(value)}>
                  {storeData.map((item, index) => {
                    return (
                      <Picker.Item
                        label={item.storeTypeName}
                        value={item.storeTypeId}
                        key={item.storeTypeId}
                      />
                    )
                  })}
                </Picker>
              </Item>
              {shopName && shopName.trim() === 'OTHERS' && (
                <Textarea
                  style={styles.textAreaStyle}
                  rowSpan={5}
                  bordered
                  value={otherShopName}
                  onChangeText={value => this.onChangeOtherShop(value)}
                  placeholder="Please specify other shop name"
                />
              )}
            </Card>
          )}
          {bookingData.bookingHistId && invalidGuest === false && invalidComplexity === false && (
            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>Additional Charges</Text>
              </CardItem>
              <View style={styles.iconText}>
                <Text style={styles.heading}>
                  {Languages.bookingDetail.labels.additional_no_of_people}
                </Text>
                <Text style={styles.biilingRightText}>{newGuest}</Text>
              </View>
              <View style={styles.iconText}>
                <Text style={styles.heading}>
                  {Languages.bookingDetail.labels.complexity_changes}
                </Text>
                <Text style={styles.biilingRightText}>{newComplexity}X</Text>
              </View>

              <View style={styles.iconText}>
                <Text style={styles.heading}>
                  {Languages.bookingDetail.labels.extra_service_provided}
                </Text>
                {newService && newService.length > 0 ? (
                  <View style={styles.dishView}>
                    {newService.map((item, key) => {
                      const chip = []
                      chip.push(
                        <Button small rounded light style={styles.dishItem}>
                          <Text style={styles.locationText}>
                            {item.name} : {Languages.bookingDetail.labels.dollar}
                            {item.price}
                          </Text>
                        </Button>
                      )
                      return chip
                    })}
                  </View>
                ) : (
                  <Text style={styles.biilingRightText}>
                    {Languages.chefProfile.labels.no_service}
                  </Text>
                )}
              </View>
              {/* <View style={styles.iconText}>
                <Text style={styles.heading}>
                  {Languages.bookingDetail.labels.rockoly_payment_charge}
                </Text>
                <Text style={styles.biilingRightText}>
                  {commissionCost ? `$${parseFloat(commissionCost).toFixed(2)}` : `$${0}`}
                </Text>
              </View> */}
              <View style={styles.iconText}>
                <Text style={styles.heading}>
                  {Languages.bookingDetail.labels.extra_services_amount}
                </Text>
                <Text style={styles.biilingRightText}>
                  {newAdditionalTotalPrice ? `$${parseFloat(newAdditionalTotalPrice)}` : `$${0}`}
                </Text>
              </View>
              <View
                style={{borderWidth: 0.5, borderColor: Theme.Colors.borderColor, marginTop: 10}}
              />
              <View style={styles.iconText}>
                <Text style={styles.heading}>{Languages.bookingDetail.labels.total_amount} </Text>
                <Text style={styles.biilingRightText}>
                  {Languages.bookingDetail.labels.dollar}
                  {newTotalPrice ? `${parseFloat(newTotalPrice)}` : null}
                </Text>
              </View>
              <View style={{marginBottom: 5}} />
            </Card>
          )}
          {/* {bookingData.bookingHistId && invalidGuest === false && invalidComplexity === false && (
            <View style={styles.iconText}>
              <View>
                <Text style={styles.heading}>
                  Admin will send you the amount :{' '}
                  <Text style={styles.destext}>
                    {chefTotal ? `$${chefTotal.toFixed(2)}` : `$${0}`}
                  </Text>
                </Text>
              </View>
            </View>
          )} */}
          {bookingData.bookingHistId ? (
            <View>
              <CommonButton
                btnText={Languages.book.labels.request_additional_charges}
                containerStyle={styles.saveBtn}
                onPress={this.onRequest}
              />
            </View>
          ) : (
            <CommonButton
              btnText={Languages.book.labels.next}
              containerStyle={styles.saveBtn}
              onPress={this.onBook}
            />
          )}
          {Platform.OS === 'ios' && <KeyboardSpacer />}
        </ScrollView>
      </View>
    )
  }
}

chefRequestPrice.contextType = AuthContext
