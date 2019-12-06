/** @format */
import React, {Component} from 'react'
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
} from 'native-base'
import Slider from '@react-native-community/slider'
import {View, ScrollView} from 'react-native'
import {Languages} from '@translations'
import {CommonButton, Spinner} from '@components'
import {AuthContext, ChefPreferenceService, BasicProfileService} from '@services'
import styles from './styles'

export default class RateService extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseRate: 0,
      gratuity: 0,
      minimumGuest: 1,
      maximumGuest: 100,
      personCount: 0,
      discountVal: 0,
      guestCount: 0,
      minGuestCount: 0,
      maxGuestCount: 0,
      minGuest: 1,
      maxGuest: 100,
      isFetching: false,
    }
  }

  componentDidMount() {
    this.setState(
      {
        isFetching: true,
      },
      () => {
        this.loadData()
      }
    )
  }

  loadData = async () => {
    const {getProfile} = this.context
    const profile = await getProfile()
    console.log('rateService profile', profile)
    this.setState({isFetching: false})
    if (profile.chefProfileExtendedsByChefId) {
      const {nodes} = profile.chefProfileExtendedsByChefId
      this.setState({
        baseRate: nodes[0].chefPricePerHour ? nodes[0].chefPricePerHour.toString() : null,
        gratuity: nodes[0].chefGratuity ? nodes[0].chefGratuity.toString() : null,
        personCount: nodes[0].personsCount ? nodes[0].personsCount.toString() : null,
        discountVal: nodes[0].discount ? nodes[0].discount.toString() : null,
        guestCount: nodes[0].noOfGuestsCanServe ? nodes[0].noOfGuestsCanServe.toString() : null,
        minGuestCount: nodes[0].noOfGuestsMin,
        maxGuestCount: nodes[0].noOfGuestsMax,
      })
    }
  }

  onChangeBaseRate = value => {
    this.setState({
      baseRate: value,
    })
  }

  onChangeGratuity = value => {
    this.setState({
      gratuity: value,
    })
  }

  onChangeDiscount = value => {
    this.setState({
      discountVal: value,
    })
  }

  onChangePerson = value => {
    this.setState({
      personCount: value,
    })
  }

  onChangeGuestCount = value => {
    this.setState({
      guestCount: value,
    })
  }

  onSave = () => {
    const {currentUser} = this.context
    const {
      baseRate,
      gratuity,
      minGuestCount,
      maxGuestCount,
      personCount,
      discountVal,
      guestCount,
    } = this.state
    if (currentUser && currentUser !== null && currentUser !== undefined) {
      const params = {
        chefProfileExtendedId: currentUser.chefProfileExtendedId,
        chefPricePerHour: baseRate ? parseInt(baseRate) : null,
        chefGratuity: gratuity ? parseFloat(gratuity) : null,
        noOfGuestsMin: minGuestCount,
        noOfGuestsMax: maxGuestCount,
        noOfGuestsCanServe: guestCount ? parseInt(guestCount) : null,
        discount: discountVal ? parseFloat(discountVal) : null,
        personsCount: personCount ? parseInt(personCount) : null,
      }
      console.log('rate save', params)
      this.setState(
        {
          isFetching: true,
        },
        () => {
          ChefPreferenceService.updateRatePreferencesData({params})
            .then(data => {
              this.setState({isFetching: false})
              BasicProfileService.emitProfileEvent()
              console.log('rate data', data)
              this.loadData()
            })
            .catch(error => {
              console.log('rate error', error)
            })
        }
      )
    }
  }

  render() {
    const {
      baseRate,
      gratuity,
      minimumGuest,
      maximumGuest,
      maxGuestCount,
      minGuestCount,
      personCount,
      discountVal,
      guestCount,
      minGuest,
      maxGuest,
      isFetching,
    } = this.state

    if (isFetching) {
      return <Spinner mode="full" />
    }
    return (
      <ScrollView style={{marginHorizontal: '5%', paddingBottom: '10%'}}>
        <View>
          <Label style={styles.label}>Base Rate</Label>
          <Text style={styles.textStyle}>
            Base rate is what you aproximately want to make per hour. Number of guests, complexity
            of the menu and addition services will determine your final payout. You can change the
            base rate any time under your profile.
          </Text>
          <Input
            onChangeText={this.onChangeBaseRate}
            value={baseRate}
            placeholder={Languages.rateService.placeholderLabel.base_rate}
            style={styles.baseRateText}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.baseRateView}>
          <Label style={styles.label}>Gratuity </Label>
          <View>
            <Text style={styles.textStyle}>
              We will include a gratuity right away, but if the services or food has been poor we
              will refund the customer.
            </Text>
          </View>
          <View style={styles.gratuityView}>
            <Text>Default gratuity amount:</Text>
            <Input
              onChangeText={this.onChangeGratuity}
              value={gratuity}
              keyboardType="number-pad"
              placeholder={Languages.optionList.placeholderLabel.gratutity}
              style={styles.gratuityText}
            />
          </View>
        </View>
        <View style={styles.baseRateView}>
          <Label style={styles.label}>Number of Guests </Label>
          <View>
            <View>
              <Text style={styles.textStyle}> I can cook for the Minimum</Text>
              <Slider
                style={{width: 300}}
                step={1}
                minimumValue={minimumGuest}
                maximumValue={maximumGuest}
                value={minGuestCount}
                onValueChange={val => this.setState({minGuestCount: val})}
                maximumTrackTintColor="#000000"
                minimumTrackTintColor="blue"
              />
              <View style={styles.textCon}>
                <Text style={styles.colorGrey}>{minimumGuest}</Text>
                <Text style={styles.colorYellow}>{minGuestCount}</Text>
                <Text style={styles.colorGrey}>{maximumGuest} </Text>
              </View>
              <Text style={styles.textStyle}> and Maximum </Text>
              <Slider
                style={{width: 300}}
                step={1}
                minimumValue={minGuest}
                maximumValue={maxGuest}
                value={maxGuestCount}
                onValueChange={val => this.setState({maxGuestCount: val})}
                maximumTrackTintColor="#000000"
                minimumTrackTintColor="blue"
              />
              <View style={styles.textCon}>
                <Text style={styles.colorGrey}>{minGuest}</Text>
                <Text style={styles.colorYellow}>{maxGuestCount}</Text>
                <Text style={styles.colorGrey}>{maxGuest} </Text>
              </View>
              <Text style={styles.textStyle}> guests. </Text>
            </View>
            <Text style={styles.textStyle}>
              Now let's decide how adding an extra customer will effect the total price. Don't worry
              you can play with pricing calculator and change the rates any time.
            </Text>
            <View>
              <Text style={styles.textStyle}>Each guest an additional</Text>
              <Input
                onChangeText={this.onChangeGuestCount}
                value={guestCount}
                keyboardType="number-pad"
                placeholder={Languages.optionList.placeholderLabel.guestCount}
                style={styles.gratuityText}
              />
              <Text style={styles.textStyle}>X your base rate. </Text>
            </View>
            <Text style={styles.textStyle}>Discount of </Text>
            <Input
              onChangeText={this.onChangeDiscount}
              value={discountVal}
              keyboardType="number-pad"
              placeholder={Languages.optionList.placeholderLabel.discount}
              style={styles.gratuityText}
            />
            <Text style={styles.textStyle}>for each guest after </Text>
            <Input
              onChangeText={this.onChangePerson}
              value={personCount}
              keyboardType="number-pad"
              placeholder={Languages.optionList.placeholderLabel.person}
              style={styles.gratuityText}
            />
          </View>
        </View>
        <CommonButton
          btnText={Languages.rateService.btnLabel.save}
          containerStyle={styles.saveBtn}
          onPress={this.onSave}
        />
      </ScrollView>
    )
  }
}

RateService.contextType = AuthContext
