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
      bookingDatas: {},
    }
  }

  componentDidMount() {
    const {navigation} = this.props
    if (navigation.state.params && navigation.state.params.bookingData) {
      console.log('navigation.state.params.bookingData', navigation.state.params.bookingData)
      const {bookingData} = navigation.state.params
      this.setState({
        bookingDatas: bookingData,
      })
    }
  }

  onNext = () => {
    const {navigation} = this.props
    const {bookingDatas} = this.state
    if (bookingDatas) {
      BookingHistoryService.bookNow({
        stripeCustomerId: null,
        cardId: null,
        chefId: bookingDatas.chefId,
        customerId: bookingDatas.customerId,
        fromTime: LocalToGMT(bookingDatas.chefBookingFromTime),
        toTime: LocalToGMT(bookingDatas.chefBookingToTime),
        notes: null,
        dishTypeId: null,
        summary: bookingDatas.summary ? JSON.stringify(bookingDatas.summary) : null,
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
        locationAddress: null,
        locationLat: null,
        locationLng: null,
        addrLine1: null,
        addrLine2: null,
        state: null,
        country: null,
        city: null,
        postalCode: null,
        isDraftYn: true,
        bookingHistId: bookingDatas.bookingHistId,
      })
        .then(value => {
          navigation.navigate(RouteNames.CHANGE_BOOK_LOCATION, {bookingDatas})
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
