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
      bookingDetail: {},
      chefProfile: {},
    }
  }

  componentDidMount() {
    const {navigation} = this.props
    if (navigation.state.params && navigation.state.params.bookingValue) {
      const {bookingValue, chefProfile} = navigation.state.params
      console.log('navigation.state.params', navigation.state.params)
      this.setState({
        bookingDetail: bookingValue,
        chefProfile,
      })
    }
  }

  getKitchenEquipmentValue = kitchenEquipmentValue => {
    const {navigation} = this.props
    const {bookingDetail, chefProfile} = this.state
    console.log('bookingDetail', bookingDetail)
    const variables = {
      stripeCustomerId: null,
      cardId: null,

      chefId: bookingDetail.chefId,
      customerId: bookingDetail.customerId,

      fromTime: bookingDetail.fromTime,
      toTime: bookingDetail.toTime,

      summary: bookingDetail.summary ? bookingDetail.summary : null,

      bookingHistId: bookingDetail.bookingHistId,

      isDraftYn: true,

      locationAddress: bookingDetail.locationAddress ? bookingDetail.locationAddress : null,
      locationLat: bookingDetail.locationLat ? bookingDetail.locationLat : null,
      locationLng: bookingDetail.locationLng ? bookingDetail.locationLng : null,

      addrLine1: bookingDetail.addrLine1 ? bookingDetail.addrLine1 : null,
      addrLine2: bookingDetail.addrLine2 ? bookingDetail.addrLine2 : null,
      city: bookingDetail.city ? bookingDetail.city : null,
      state: bookingDetail.state ? bookingDetail.state : null,
      country: bookingDetail.country ? bookingDetail.country : null,
      postalCode: bookingDetail.postalCode ? bookingDetail.postalCode : null,

      allergyTypeIds: bookingDetail.allergyTypeIds ? bookingDetail.allergyTypeIds : null,

      otherAllergyTypes: bookingDetail.otherAllergyTypes ? bookingDetail.otherAllergyTypes : null,
      dietaryRestrictionsTypesIds: bookingDetail.dietaryRestrictionsTypesIds
        ? bookingDetail.dietaryRestrictionsTypesIds
        : null,
      otherDietaryRestrictionsTypes: bookingDetail.otherDietaryRestrictionsTypes
        ? bookingDetail.otherDietaryRestrictionsTypes
        : null,

      kitchenEquipmentTypeIds: kitchenEquipmentValue.customerKitchenEquipmentTypeId
        ? kitchenEquipmentValue.customerKitchenEquipmentTypeId
        : bookingDetail.kitchenEquipmentTypeIds
        ? bookingDetail.kitchenEquipmentTypeIds
        : null,

      otherKitchenEquipmentTypes: kitchenEquipmentValue.customerOtherKitchenEquipmentTypes
        ? kitchenEquipmentValue.customerOtherKitchenEquipmentTypes
        : bookingDetail.otherKitchenEquipmentTypes
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
    if (bookingDetail) {
      BookingHistoryService.bookNow(variables)
        .then(detail => {
          navigation.navigate(RouteNames.BOOK_PRICE, {
            bookingValue: variables,
            chefProfile,
          })
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
