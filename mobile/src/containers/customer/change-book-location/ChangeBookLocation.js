/** @format */

import React, {Component} from 'react'
import {View, Platform, Text, Alert} from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import axios from 'axios'
import {Address} from '@containers'
import {Header, Spinner} from '@components'
import {AuthContext, PROFILE_VIEW_EVENT, ProfileViewService, BookingHistoryService} from '@services'
import {Languages} from '@translations'
import {LocalToGMT} from '@utils'
import styles from './styles'
import {RouteNames} from '@navigation'

const mapApiKey = 'AIzaSyCcjRqgAT1OhVMHTPXwYk2IbR6pYQwFOTI'

export default class ChangeBookLocation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chefData: {},
      isLoading: false,
      bookingDetail: {},
    }
  }

  componentDidMount() {
    const {navigation} = this.props
    if (navigation.state.params && navigation.state.params.bookingDetail) {
      const {bookingDetail, chefProfile} = navigation.state.params
      this.setState(
        {
          isLoading: true,
          bookingDetail,
          chefProfile,
        },
        () => {
          if (this.state.bookingDetail && this.state.bookingDetail.chefId) {
            ProfileViewService.on(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
            ProfileViewService.getProfileDetails(this.state.bookingDetail.chefId)
          }
        }
      )
    }
  }

  componentWillUnmount() {
    ProfileViewService.off(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
  }

  setList = ({profileDetails}) => {
    this.setState({isLoading: false})
    if (Object.keys(profileDetails).length !== 0) {
      if (profileDetails.hasOwnProperty('chefProfileByChefId')) {
        const profile = profileDetails.chefProfileByChefId
        if (profile) {
          this.setState({
            chefData: profile,
          })
        }
      }
    }
  }

  getLocationValue = address => {
    const {navigation} = this.props
    const {chefData, bookingDetail, chefProfile} = this.state
    console.log('debugging getLocationValue', address, bookingDetail)
    let chefLocationLat
    let chefLocationLng
    let chefMiles

    if (
      chefData &&
      chefData !== {} &&
      chefData !== undefined &&
      Object.keys(chefData).length !== 0
    ) {
      if (chefData.chefProfileExtendedsByChefId && chefData.chefProfileExtendedsByChefId.nodes) {
        const value = chefData.chefProfileExtendedsByChefId.nodes[0]
        if (value.chefLocationLat) {
          chefLocationLat = value.chefLocationLat
        }
        if (value.chefLocationLng) {
          chefLocationLng = value.chefLocationLng
        }
        if (value.chefAvailableAroundRadiusInValue) {
          chefMiles = value.chefAvailableAroundRadiusInValue
        }
      }
    }

    const obj = {
      stripeCustomerId: null,
      cardId: null,

      chefId: bookingDetail.chefId,
      customerId: bookingDetail.customerId,

      fromTime: bookingDetail.fromTime,
      toTime: bookingDetail.toTime,

      summary: bookingDetail.summary ? JSON.stringify(bookingDetail.summary) : null,

      bookingHistId: bookingDetail.bookingHistId,

      isDraftYn: true,

      locationAddress: address.locationAddress
        ? address.locationAddress
        : bookingDetail.locationAddress
        ? bookingDetail.locationAddress
        : null,

      locationLat: address.locationLat
        ? address.locationLat
        : bookingDetail.locationLat
        ? bookingDetail.locationLat
        : null,

      locationLng: address.locationLng
        ? address.locationLng
        : bookingDetail.locationLng
        ? bookingDetail.locationLng
        : null,

      addrLine1: address.addrLine1
        ? address.addrLine1
        : bookingDetail.addrLine1
        ? bookingDetail.addrLine1
        : null,

      addrLine2: address.addrLine2
        ? address.addrLine2
        : bookingDetail.addrLine2
        ? bookingDetail.addrLine2
        : null,

      city: address.city ? address.city : bookingDetail.city ? bookingDetail.city : null,

      state: address.state ? address.state : bookingDetail.state ? bookingDetail.state : null,

      country: address.country
        ? address.country
        : bookingDetail.country
        ? bookingDetail.country
        : null,

      postalCode: address.postalCode
        ? address.postalCode
        : bookingDetail.postalCode
        ? bookingDetail.postalCode
        : null,

      allergyTypeIds: bookingDetail.allergyTypeIds ? bookingDetail.allergyTypeIds : null,

      otherAllergyTypes: bookingDetail.otherAllergyTypes ? bookingDetail.otherAllergyTypes : null,

      dietaryRestrictionsTypesIds: bookingDetail.dietaryRestrictionsTypesIds
        ? bookingDetail.dietaryRestrictionsTypesIds
        : null,

      otherDietaryRestrictionsTypes: bookingDetail.otherDietaryRestrictionsTypes
        ? bookingDetail.otherDietaryRestrictionsTypes
        : null,

      kitchenEquipmentTypeIds: bookingDetail.kitchenEquipmentTypeIds
        ? bookingDetail.kitchenEquipmentTypeIds
        : null,

      otherKitchenEquipmentTypes: bookingDetail.otherKitchenEquipmentTypes
        ? bookingDetail.otherKitchenEquipmentTypes
        : null,

      noOfGuests: bookingDetail.noOfGuests ? bookingDetail.noOfGuests : null,

      complexity: bookingDetail.complexity ? bookingDetail.complexity : null,

      storeTypeIds: bookingDetail.storeTypeIds ? bookingDetail.storeTypeIds : null,

      otherStoreTypes: bookingDetail.otherStoreTypes ? bookingDetail.otherStoreTypes : null,

      additionalServices: bookingDetail.additionalServices
        ? bookingDetail.additionalServices
        : null,

      dishTypeId: bookingDetail.dishTypeId ? bookingDetail.dishTypeId : null,
    }

    console.log('debugging step 1 variables', obj)

    if (chefLocationLat && chefLocationLng) {
      axios
        .post(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${address.locationLat},${address.locationLng}&destinations=${chefLocationLat},${chefLocationLng}&key=${mapApiKey}`
        )
        .then(milesData => {
          console.log('milesData', milesData)
          if (
            milesData.data.status === 'OK' &&
            milesData.data.rows[0].elements[0].status === 'OK'
          ) {
            const {value} = milesData.data.rows[0].elements[0].distance
            const miles = value / 1609
            if (miles <= chefMiles) {
              if (bookingDetail) {
                BookingHistoryService.bookNow(obj)
                  .then(detail => {
                    navigation.navigate(RouteNames.BOOK_ALLERGY, {bookingDetail: obj, chefProfile})
                  })
                  .catch(err => {
                    console.log('err', err)
                  })
              }
            } else {
              Alert.alert(
                'Info',
                `Sorry, This chef can only travel up to ${chefMiles} miles only. Your selected location ${
                  miles ? Math.round(miles) : ''
                } miles away from chef location.`
              )
            }
          } else {
            Alert.alert(
              Languages.setLocation.alert.info_title,
              Languages.setLocation.alert.miles_error,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => navigation.navigate(RouteNames.BOOK_ALLERGY, {bookingDetail: obj}),
                },
              ],
              {
                cancelable: false,
              }
            )
          }
        })
        .catch(error => {
          Alert.alert(
            Languages.setLocation.alert.error_title,
            Languages.setLocation.alert.error_location,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () =>
                  navigation.navigate(RouteNames.BOOK_ALLERGY, {
                    bookingDetail: {
                      ...obj,
                    },
                    chefProfile,
                  }),
              },
            ],
            {
              cancelable: false,
            }
          )
        })
    }
  }

  render() {
    const {bookingDetail, chefData, isLoading} = this.state
    const {navigation} = this.props

    let chefCity
    let chefMiles
    let firstName

    if (
      chefData &&
      chefData !== {} &&
      chefData !== undefined &&
      Object.keys(chefData).length !== 0
    ) {
      if (chefData.chefProfileExtendedsByChefId && chefData.chefProfileExtendedsByChefId.nodes) {
        const value = chefData.chefProfileExtendedsByChefId.nodes[0]
        if (value.chefCity) {
          chefCity = value.chefCity
        }
        if (value.chefAvailableAroundRadiusInValue) {
          chefMiles = value.chefAvailableAroundRadiusInValue
        }
      }
      if (chefData.chefFirstName) {
        firstName = chefData.chefFirstName
      }
    }

    if (isLoading) {
      return <Spinner mode="full" />
    }

    return (
      <View style={{flex: 1}}>
        <Header showBack title={Languages.book.labels.book_location} showBell={false} />
        <Address
          getValue={this.getLocationValue}
          bookingData={bookingDetail}
          navigation={navigation}
          hideSave
          chefLocation={chefCity}
          chefMiles={chefMiles}
          chefFirstName={firstName}
          bookingLocation
        />
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
    )
  }
}

ChangeBookLocation.contextType = AuthContext
