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
      bookingData: {},
      chefData: {},
      isLoading: false,
    }
  }

  componentDidMount() {
    const {navigation} = this.props
    const {bookingData} = this.state
    if (navigation.state.params && navigation.state.params.bookingDatas) {
      const {bookingDatas} = navigation.state.params
      this.setState(
        {
          bookingData: bookingDatas,
          isLoading: true,
        },
        () => {
          console.log('bookingData', this.state.bookingData)
          if (this.state.bookingData && this.state.bookingData.chefId) {
            ProfileViewService.on(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
            ProfileViewService.getProfileDetails(this.state.bookingData.chefId)
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
    const {bookingData, chefData} = this.state
    console.log('getLocationValue', address, bookingData)
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
      chefId: bookingData.chefId,
      customerId: bookingData.customerId,
      chefBookingFromTime: bookingData.chefBookingFromTime,
      chefBookingToTime: bookingData.chefBookingToTime,
      chefProfile: bookingData.chefProfile,
      summary: bookingData.summary,
      locationAddress: address.locationAddress,
      locationLat: address.locationLat,
      locationLng: address.locationLng,
      addrLine1: address.addrLine1,
      addrLine2: address.addrLine2,
      state: address.state,
      country: address.country,
      city: address.city,
      postalCode: address.postalCode,
      bookingHistId: bookingData.bookingHistId,
    }

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
              if (bookingData) {
                BookingHistoryService.bookNow({
                  stripeCustomerId: null,
                  cardId: null,
                  chefId: bookingData.chefId,
                  customerId: bookingData.customerId,
                  fromTime: LocalToGMT(bookingData.chefBookingFromTime),
                  toTime: LocalToGMT(bookingData.chefBookingToTime),
                  notes: null,
                  dishTypeId: null,
                  summary: bookingData.summary ? JSON.stringify(bookingData.summary) : null,
                  allergyTypeIds: null,
                  otherAllergyTypes: null,
                  dietaryRestrictionsTypesIds: null,
                  otherDietaryRestrictionsTypes: null,
                  kitchenEquipmentTypeIds: null,
                  otherKitchenEquipmentTypes: null,
                  storeTypeIds: null,
                  otherStoreTypes: null,
                  noOfGuests: null,
                  complexity: null,
                  additionalServices: null,
                  locationAddress: address.locationAddress ? address.locationAddress : null,
                  locationLat: address.locationLat ? address.locationLat : null,
                  locationLng: address.locationLng ? address.locationLng : null,
                  addrLine1: address.addrLine1 ? address.addrLine1 : null,
                  addrLine2: address.addrLine2 ? address.addrLine2 : null,
                  state: address.state ? address.state : null,
                  country: address.country ? address.country : null,
                  city: address.city ? address.city : null,
                  postalCode: address.postalCode ? address.postalCode : null,
                  isDraftYn: true,
                  bookingHistId: bookingData.bookingHistId,
                })
                  .then(detail => {
                    navigation.navigate(RouteNames.BOOK_ALLERGY, {bookingData: obj})
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
                  onPress: () => navigation.navigate(RouteNames.BOOK_ALLERGY, {bookingData: obj}),
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
                onPress: () => navigation.navigate(RouteNames.BOOK_ALLERGY, {bookingData: obj}),
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
    const {bookingData, chefData, isLoading} = this.state
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
          bookingData={bookingData}
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
