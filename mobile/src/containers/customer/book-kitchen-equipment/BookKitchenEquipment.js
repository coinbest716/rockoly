/** @format */

import React, {Component} from 'react'
import {View, ScrollView, Platform} from 'react-native'
import {
  Container,
  Item,
  Textarea,
  Text,
  Input,
  Content,
  Form,
  CheckBox,
  ListItem,
  Body,
  Icon,
  Left,
  Button,
  Label,
  Toast,
  Card,
  Accordion,
} from 'native-base'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import _ from 'lodash'
import {Allergies, Dietary, KitchenEquipment} from '@containers'
import {CommonButton, Spinner, Header} from '@components'
import {Theme} from '@theme'
import {AuthContext, BookingHistoryService} from '@services'
import {LocalToGMT} from '@utils'
import {Languages} from '@translations'
import styles from './styles'
import {RouteNames} from '@navigation'

export default class BookDietary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookingData: {},
    }
  }

  componentDidMount() {
    const {navigation} = this.props
    if (navigation.state.params && navigation.state.params.bookingValue) {
      const {bookingValue} = navigation.state.params
      console.log('navigation.state.params', navigation.state.params)
      this.setState({
        bookingData: bookingValue,
      })
    }
  }

  getKitchenEquipmentValue = kitchenEquipmentValue => {
    const {navigation} = this.props
    const {bookingData} = this.state
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
        dietaryRestrictionsTypesIds: bookingData.otherAllergyTypes
          ? bookingData.otherAllergyTypes
          : null,
        otherDietaryRestrictionsTypes: bookingData.chef_booking_other_dietary_restrictions_types
          ? bookingData.chef_booking_other_dietary_restrictions_types
          : null,
        kitchenEquipmentTypeIds: kitchenEquipmentValue.customerKitchenEquipmentTypeId
          ? kitchenEquipmentValue.customerKitchenEquipmentTypeId
          : null,
        otherKitchenEquipmentTypes: kitchenEquipmentValue.customerOtherKitchenEquipmentTypes
          ? kitchenEquipmentValue.customerOtherKitchenEquipmentTypes
          : null,
        storeTypeIds: null,
        otherStoreTypes: null,
        noOfGuests: null,
        complexity: null,
        additionalServices: null,
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
          const bookingValue = {
            chefId: bookingData.chefId,
            customerId: bookingData.customerId,
            fromTime: LocalToGMT(bookingData.fromTime),
            toTime: LocalToGMT(bookingData.toTime),
            summary: bookingData.summary,
            chefProfile: bookingData.chefProfile,
            allergyTypeIds: bookingData.allergyTypeIds,
            otherAllergyTypes: bookingData.otherAllergyTypes,
            dietaryRestrictionsTypesIds: bookingData.dietaryRestrictionsTypesIds,
            otherDietaryRestrictionsTypes: bookingData.otherDietaryRestrictionsTypes,
            kitchenEquipmentTypeIds: kitchenEquipmentValue.customerKitchenEquipmentTypeId
              ? kitchenEquipmentValue.customerKitchenEquipmentTypeId
              : null,
            otherKitchenEquipmentTypes: kitchenEquipmentValue.customerOtherKitchenEquipmentTypes
              ? kitchenEquipmentValue.customerOtherKitchenEquipmentTypes
              : null,
            locationAddress: bookingData.locationAddress,
            locationLat: bookingData.locationLat,
            locationLng: bookingData.locationLng,
            addrLine1: bookingData.addrLine1,
            addrLine2: bookingData.addrLine2,
            state: bookingData.state,
            country: bookingData.country,
            city: bookingData.city,
            postalCode: bookingData.postalCode,
            isDraftYn: true,
            bookingHistId: bookingData.bookingHistId,
          }
          navigation.navigate(RouteNames.BOOK_PRICE, {bookingValue})
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  }

  render() {
    const {bookingData} = this.state
    return (
      <View style={{flex: 1}}>
        <Header showBack title={Languages.book.labels.kitchenEquipment} showBell={false} />
        <KitchenEquipment
          getValue={this.getKitchenEquipmentValue}
          bookingData={bookingData}
          hideSave
        />
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
    )
  }
}

BookDietary.contextType = AuthContext
