/** @format */

import React, {PureComponent} from 'react'
import {View, ScrollView} from 'react-native'
import {
  Text,
  Item,
  Icon,
  Input,
  Label,
  ListItem,
  CheckBox,
  Body,
  Button,
  Right,
  Toast,
  Left,
  Radio,
} from 'native-base'
import {LocalToGMT} from '@utils'
import {BookingHistoryService} from '@services'
import {CommonButton, Header} from '@components'
import {Languages} from '@translations'
import {RouteNames} from '@navigation'
import styles from './styles'

export default class PricingModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      bookingDetail: {},
      chefProfile: {},
    }
  }

  componentDidMount() {
    const {navigation} = this.props
    if (navigation.state.params && navigation.state.params.bookingDetail) {
      const {bookingDetail, chefProfile} = navigation.state.params
      this.setState({
        bookingDetail,
        chefProfile,
      })
    }
  }

  onNext = () => {
    const {navigation} = this.props
    const {bookingDetail, chefProfile} = this.state
    console.log('bookingDetail, chefProfile', bookingDetail, chefProfile)
    if (bookingDetail) {
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
      console.log('debugging step 2 variables', variables)
      BookingHistoryService.bookNow(variables)
        .then(value => {
          navigation.navigate(RouteNames.CHANGE_BOOK_LOCATION, {
            bookingDetail: variables,
            chefProfile,
          })
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  }

  render() {
    const {onNext} = this.props
    return (
      <View style={{flex: 1}}>
        <Header showBack title="Pricing Model" showBell={false} />
        <ScrollView style={{marginHorizontal: 10, paddingVertical: 5, flex: 1}}>
          <Text style={styles.textStyle}>
            At Rockoly, our goal is to provide fair, transparent pricing for the customer while
            maintaining a trustworthy platform for consumer to chef interaction.
          </Text>
          <Text style={styles.label}>Our customer pricing is driven by:</Text>
          <View style={styles.bodyContainer}>
            <Text style={styles.bullet}> {'\u2B24'}</Text>
            <Text style={styles.pricingtextStyle}>Base rate </Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.bullet}> {'\u2B24'}</Text>
            <Text style={styles.pricingtextStyle}>Amount of people </Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.bullet}> {'\u2B24'}</Text>
            <Text style={styles.pricingtextStyle}>Complexity of the menu</Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.bullet}> {'\u2B24'}</Text>
            <Text style={styles.pricingtextStyle}>Additional services</Text>
          </View>
          <Text style={styles.textStyle}>
            We have created a pricing model that is based on the skill and creativity of the chef,
            not on the cost of ingredients or event type. Ingredient cost is a separate expense and
            is paid by the customer once purchasing receipts are provided.
          </Text>
          <Text style={styles.textStyle}>
            By upholding the integrity of our unique pricing model and user friendly environment, we
            strive to provide a gourmet, one of a kind experience for everyone involved.
          </Text>
          <CommonButton
            btnText={Languages.customerPreference.labels.next}
            containerStyle={styles.saveBtn}
            onPress={this.onNext}
          />
        </ScrollView>
      </View>
    )
  }
}
