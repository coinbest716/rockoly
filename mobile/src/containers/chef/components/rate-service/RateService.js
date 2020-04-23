/** @format */
import React, {Component} from 'react'
import {
  Text,
  Item,
  Icon,
  Label,
  Card,
  CheckBox,
  Body,
  Button,
  Right,
  Input,
  Toast,
} from 'native-base'
import Slider from '@react-native-community/slider'
import NumericInput from 'react-native-numeric-input'
import {View, ScrollView, Alert} from 'react-native'
import {Languages} from '@translations'
import {CommonButton, Spinner} from '@components'
import {AuthContext, ChefPreferenceService, BasicProfileService} from '@services'
import styles from './styles'
import {Theme} from '@theme'

export default class RateService extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseRate: 0,
      gratuity: 0,
      minimumGuest: 0,
      maximumGuest: 5,
      // personCount: 0,
      // discountVal: 0,
      // guestCount: 0,
      minGuestCount: 0,
      maxGuestCount: 0,
      minGuest: 0,
      maxGuest: 40,
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
    this.setState({isFetching: false})
    if (profile.chefProfileExtendedsByChefId) {
      const {nodes} = profile.chefProfileExtendedsByChefId
      this.setState({
        baseRate: nodes[0].chefPricePerHour ? nodes[0].chefPricePerHour.toString() : null,
        // gratuity: nodes[0].chefGratuity ? nodes[0].chefGratuity.toString() : null,
        // personCount: nodes[0].personsCount ? nodes[0].personsCount.toString() : null,
        // discountVal: nodes[0].discount ? nodes[0].discount.toString() : null,
        // guestCount: nodes[0].noOfGuestsCanServe ? nodes[0].noOfGuestsCanServe.toString() : null,
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

  renderLine = () => {
    return <View style={styles.border} />
  }

  onChangeGratuity = value => {
    this.setState({
      gratuity: value,
    })
  }

  // onChangeDiscount = value => {
  //   this.setState({
  //     discountVal: value,
  //   })
  // }

  // onChangePerson = value => {
  //   this.setState({
  //     personCount: value,
  //   })
  // }

  // onChangeGuestCount = value => {
  //   this.setState({
  //     guestCount: value,
  //   })
  // }

  onSave = () => {
    const {currentUser} = this.context
    const {onSaveCallBack, showRate, showService} = this.props
    const {
      baseRate,
      gratuity,
      minGuestCount,
      maxGuestCount,
      // personCount,
      // discountVal,
      // guestCount,
    } = this.state

    console.log('minGuestCount', minGuestCount)

    if (!baseRate) {
      Alert.alert('Please fill up the form')
      return
    }
    if (baseRate <= 0) {
      Alert.alert('Minimum amount should be greater then 0')
      return
    }

    if (minGuestCount === 0 || maxGuestCount === 0) {
      Alert.alert(
        'Info',
        'Please select a minimum and maximum number of guests you are able to cook for.'
      )
      return
    }
    if (minGuestCount === null || maxGuestCount === null) {
      Alert.alert(
        'Info',
        'Please select a minimum and maximum number of guests you are able to cook for.'
      )
      return
    }

    if (minGuestCount > maxGuestCount) {
      Alert.alert('Info', 'Min count should be greater than Max count')
      return
    }
    console.log('minGuestCount', minGuestCount, maxGuestCount)
    if (
      currentUser &&
      currentUser !== null &&
      currentUser !== undefined &&
      minGuestCount !== 0 &&
      maxGuestCount !== 0
    ) {
      const params = {
        chefProfileExtendedId: currentUser.chefProfileExtendedId,
        chefPricePerHour: baseRate ? parseInt(baseRate) : null,
        // chefGratuity: gratuity ? parseFloat(gratuity) : null,
        noOfGuestsMin: minGuestCount,
        noOfGuestsMax: maxGuestCount,
        // noOfGuestsCanServe: guestCount ? parseInt(guestCount) : null,
        // discount: discountVal ? parseFloat(discountVal) : null,
        // personsCount: personCount ? parseInt(personCount) : null,
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
              // BasicProfileService.emitProfileEvent()
              console.log('rate data', data)
              if (showRate) {
                Toast.show({
                  text: 'Rate saved.',
                  duration: 3000,
                })
              }
              if (showService) {
                Toast.show({
                  text: 'Guests saved.',
                  duration: 3000,
                })
              }
              if (onSaveCallBack) {
                onSaveCallBack()
                Toast.show({
                  text: 'Rate and Guests saved.',
                  duration: 3000,
                })
              }
              // this.loadData()
            })
            .catch(error => {
              console.log('rate error', error)
            })
        }
      )
    } else {
      Alert.alert('Info', 'Please fill up the form')
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
      // personCount,
      // discountVal,
      // guestCount,
      minGuest,
      maxGuest,
      isFetching,
    } = this.state
    console.log('minGuest', minGuest, maxGuest)
    const {showService, showRate, onSaveCallBack} = this.props

    if (isFetching) {
      return <Spinner mode="full" />
    }
    return (
      <ScrollView style={{marginHorizontal: '5%', paddingBottom: '10%'}}>
        {(showRate || onSaveCallBack) && (
          <Card style={styles.cardStyle}>
            <Label style={styles.label}>Base Rate</Label>
            <Item style={styles.baseRateText}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="currency-usd" type="MaterialCommunityIcons" style={styles.iconStyle} />
                <Input
                  onChangeText={this.onChangeBaseRate}
                  value={baseRate}
                  placeholder={Languages.rateService.placeholderLabel.base_rate}
                  style={styles.baseText}
                  keyboardType="number-pad"
                />
              </View>
            </Item>
            <Text style={styles.textStyle}>
              Base rate is what you approximately want to make per hour. Number of guests,
              complexity of the menu and addition services will determine your final payout. You can
              change the base rate any time under your profile.
            </Text>
          </Card>
        )}
        {/* <Card style={styles.cardStyle}>
          <Label style={styles.label}>Gratuity </Label>
          <View>
            <View style={styles.gratuityView}>
              <Text style={{marginBottom: 5}}>Default gratuity amount:</Text>
              <Input
                onChangeText={this.onChangeGratuity}
                value={gratuity}
                keyboardType="number-pad"
                placeholder={Languages.optionList.placeholderLabel.gratutity}
                style={styles.baseRateText}
              />
            </View>
            <Text style={styles.textStyle}>
              We will include a gratuity right away, but if the services or food has been poor we
              will refund the customer.
            </Text>
          </View>
        </Card> */}
        {(showService || onSaveCallBack) && (
          <Card style={styles.cardStyle}>
            <Label style={styles.label}>Number of Guests </Label>
            <Text style={styles.textStyle}> I can cook for the Minimum</Text>
            {/* Hided for numeric input trial */}
            {/* <Slider
              style={{width: 'auto'}}
              step={1}
              minimumValue={minimumGuest}
              maximumValue={maximumGuest}
              value={minGuestCount}
              onValueChange={val => this.setState({minGuestCount: val})}
              maximumTrackTintColor="#000000"
              minimumTrackTintColor={Theme.Colors.primary}
            /> */}
               <NumericInput 
                value={minGuestCount} 
                onChange={value => this.setState({minGuestCount: value})} 
                minValue={minimumGuest}
                maxValue={maximumGuest}
                initValue={minGuestCount}
                onLimitReached={(isMax,msg) => Alert.alert("Info", msg)}
                totalWidth={150} 
                totalHeight={40} 
                iconSize={25}
                step={1}
                valueType='integer'
                rounded 
                textColor={Theme.Colors.primary}
                iconStyle={{ color: 'white' }} 
                rightButtonBackgroundColor={Theme.Colors.primary}
                leftButtonBackgroundColor={Theme.Colors.primary}
                containerStyle={styles.numericInputStyle}
            />
            <View style={styles.textCon}>
              <Text style={styles.colorGrey}>{minimumGuest}</Text>
              {/* Hided for numeric input trial  */}
              {/* <Text style={styles.colorYellow}>{minGuestCount}</Text> */} 
              <Text style={styles.colorGrey}>{maximumGuest} </Text>
            </View>
            <Text style={styles.textStyle}> and Maximum </Text>
            {/* <Slider
              style={{width: 'auto'}}
              step={1}
              minimumValue={minGuest}
              maximumValue={maxGuest}
              value={maxGuestCount}
              onValueChange={val => this.setState({maxGuestCount: val})}
              maximumTrackTintColor="#000000"
              minimumTrackTintColor={Theme.Colors.primary}
            /> */}
               <NumericInput 
                value={maxGuestCount} 
                onChange={value => this.setState({maxGuestCount: value})} 
                minValue={minGuest}
                maxValue={maxGuest}
                initValue={maxGuestCount}
                onLimitReached={(isMax,msg) => Alert.alert("Info Max", msg)}
                totalWidth={150} 
                totalHeight={40} 
                iconSize={25}
                step={1}
                valueType='integer'
                rounded 
                textColor={Theme.Colors.primary}
                iconStyle={{ color: 'white' }} 
                rightButtonBackgroundColor={Theme.Colors.primary}
                leftButtonBackgroundColor={Theme.Colors.primary}
                containerStyle={styles.numericInputStyle}
            />
            <View style={styles.textCon}>
              <Text style={styles.colorGrey}>{minGuest}</Text>
                {/* Hided for numeric input trial  */}
              {/* <Text style={styles.colorYellow}>{maxGuestCount}</Text> */}
              <Text style={styles.colorGrey}>{maxGuest} </Text>
            </View>
            <Text style={styles.textStyle}> guests. </Text>
          </Card>
        )}
        {/* <Card style={styles.cardStyle}>
          <Text style={styles.bottomtextStyle}>
            Now let's decide how adding an extra customer will effect the total price. Don't worry
            you can play with pricing calculator and change the rates any time.
          </Text>
          <View>
            <Text style={styles.rateLable}>Each guest an additional X your base rate.</Text>
            <Input
              onChangeText={this.onChangeGuestCount}
              value={guestCount}
              keyboardType="number-pad"
              placeholder={Languages.optionList.placeholderLabel.guestCount}
              style={styles.gratuityText}
            />
          </View>

          <Text style={styles.rateLable}>Discount for each guest after </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Input
              onChangeText={this.onChangeDiscount}
              value={discountVal}
              keyboardType="number-pad"
              placeholder={Languages.optionList.placeholderLabel.discount}
              style={styles.disText}
            />
            <Text style={styles.to}>To</Text>
            <Input
              onChangeText={this.onChangePerson}
              value={personCount}
              keyboardType="number-pad"
              placeholder={Languages.optionList.placeholderLabel.person}
              style={styles.disText}
            />
          </View>
        </Card> */}
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
