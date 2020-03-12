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
} from 'native-base'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import _ from 'lodash'
import {CommonButton, Spinner} from '@components'
import {Theme} from '@theme'
import {AuthContext, CustomerPreferenceService, CUSTOMER_PREFERNCE_EVENT} from '@services'
import {Languages} from '@translations'
import styles from './styles'

export default class Allergies extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allergies: [],
      allergyTypeId: [],
      newAllergies: '',
      isLoading: false,
    }
  }

  async componentDidMount() {
    CustomerPreferenceService.on(CUSTOMER_PREFERNCE_EVENT.ALLERGY, this.allergyList)
    this.onLoadData()
    const {allergies} = this.state
    const {getProfile} = this.context
    const profile = await getProfile()
    console.log('allergy prefernces', profile)
    if (profile && profile.customerPreferenceProfilesByCustomerId) {
      if (
        profile.customerPreferenceProfilesByCustomerId &&
        profile.customerPreferenceProfilesByCustomerId.nodes.length > 0
      ) {
        const preferences = profile.customerPreferenceProfilesByCustomerId.nodes[0]
        const temp = []
        preferences.allergyTypes.nodes.map((item, value) => {
          const val = {
            label: item.allergyTypeName,
            id: item.allergyTypeId,
            checked: true,
          }
          temp.push(val)
        })
        console.log('temp', temp)
        this.setState(
          {
            newAllergies: preferences.customerOtherAllergyTypes
              ? JSON.parse(preferences.customerOtherAllergyTypes)
              : '',
            allergyTypeId: preferences.customerAllergyTypeId,
          },
          () => {}
        )
      }
    }
  }

  componentWillUnmount() {
    CustomerPreferenceService.off(CUSTOMER_PREFERNCE_EVENT.CUISINES, this.cuisineList)
  }

  getAllergy = () => {
    const {allergyTypeId, newAllergies} = this.state
    return {allergyTypeId, newAllergies}
  }

  onLoadData = async () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        CustomerPreferenceService.getAllergyData()
      }
    )
  }

  allergyList = ({allergyData}) => {
    this.setState({isLoading: false})
    const temp = []
    allergyData.map((item, value) => {
      const val = {
        label: item.allergyTypeDesc,
        id: item.allergyTypeId,
        checked: false,
      }
      temp.push(val)
    })
    this.setState(
      {
        allergies: temp,
      },
      () => {
        this.loadAllergyData()
      }
    )
  }

  loadAllergyData = async () => {
    const {allergies} = this.state
    const {getProfile} = this.context
    const profile = await getProfile()
    console.log('allergy prefernces', profile)
    if (profile && profile.customerPreferenceProfilesByCustomerId) {
      if (
        profile.customerPreferenceProfilesByCustomerId &&
        profile.customerPreferenceProfilesByCustomerId.nodes.length > 0
      ) {
        const preferences = profile.customerPreferenceProfilesByCustomerId.nodes[0]

        const allergyType = allergies

        const temp = []
        allergyType.map((res, index) => {
          console.log('res', res)
          const obj = {
            label: res.label,
            id: res.id,
            checked:
              preferences && preferences.customerAllergyTypeId
                ? !preferences.customerAllergyTypeId.every(item => item !== res.id)
                : false,
          }
          temp.push(obj)
        })

        console.log('allergyType', temp)
        this.setState({
          allergies: temp,
        })
      }
    }
  }

  onAllergiesItemPress = (index, checked) => {
    const {allergies} = this.state
    const temp = allergies

    if (temp[index]) {
      temp[index].checked = !checked
    }

    this.setState(
      {
        allergies: temp,
      },
      async () => {
        const val = []
        await allergies.map((itemVal, key) => {
          if (itemVal.checked === true) {
            val.push(itemVal.id)
          }
        })
        this.setState(
          {
            allergyTypeId: val,
          },
          () => {}
        )
      }
    )
  }

  onAddNewAllergies = value => {
    this.setState(
      {
        newAllergies: value,
      },
      () => {}
    )
  }

  onSave = () => {
    const {allergyTypeId, newAllergies} = this.state
    const {onSaveCallBack, getValue, hideSave} = this.props
    const {currentUser} = this.context
    console.log('currentUser', currentUser)
    if (currentUser !== null && currentUser !== undefined) {
      const obj = {
        customerPreferenceId: currentUser.customerPreferenceId,
        customerAllergyTypeId: allergyTypeId && allergyTypeId.length > 0 ? allergyTypeId : null,
        customerOtherAllergyTypes: newAllergies ? JSON.stringify(newAllergies) : null,
      }
      console.log('onSave obj', obj)
      CustomerPreferenceService.updatePreferencesData(obj)
        .then(data => {
          console.log('preferences data', data)
          if (onSaveCallBack) {
            onSaveCallBack()
          }

          if (getValue) {
            getValue(obj)
          }

          if (!hideSave) {
            Toast.show({
              duration: 5000,
              text: Languages.customerPreference.toast_messages.allergiesMessage,
            })
          }
        })
        .catch(error => {
          console.log('preferences error', error)
        })
    }
  }

  render() {
    const {allergies, newAllergies, allergyTypeId, isLoading} = this.state
    const {hideSave} = this.props
    console.log('allergies', allergies)
    if (isLoading) {
      return (
        <View style={styles.alignScreenCenter}>
          <Spinner mode="full" animating />
        </View>
      )
    }
    return (
      <ScrollView style={{marginHorizontal: 10, paddingVertical: 5, flex: 1}}>
        <Label style={styles.allergiesLabel}>Do you have any allergies?</Label>
        <View>
          {allergies &&
            allergies.length > 0 &&
            allergies.map((item, index) => {
              return (
                <ListItem style={{borderBottomWidth: 0}}>
                  <CheckBox
                    checked={item.checked}
                    color={Theme.Colors.primary}
                    onPress={() => this.onAllergiesItemPress(index, item.checked)}
                  />
                  <Body style={{marginLeft: 5}}>
                    <Text>{item.label}</Text>
                  </Body>
                </ListItem>
              )
            })}
        </View>
        <View style={styles.textAreaContent}>
          <Textarea
            style={styles.textAreaStyle}
            rowSpan={5}
            bordered
            value={newAllergies}
            onChangeText={value => this.onAddNewAllergies(value)}
            placeholder="If applicable, please list additional allergies restrictions"
          />
        </View>

        <CommonButton
          btnText={
            hideSave
              ? Languages.customerPreference.labels.next
              : Languages.customerPreference.labels.save
          }
          containerStyle={styles.saveBtn}
          onPress={this.onSave}
        />
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </ScrollView>
    )
  }
}

Allergies.contextType = AuthContext
