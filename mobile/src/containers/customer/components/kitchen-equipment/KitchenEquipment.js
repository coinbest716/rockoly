/** @format */

import React, {PureComponent} from 'react'
import {View, ScrollView, Platform} from 'react-native'
import {Textarea, Text, CheckBox, ListItem, Body, Label, Toast} from 'native-base'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import {CommonButton, Spinner} from '@components'
import {AuthContext, CustomerPreferenceService, CUSTOMER_PREFERNCE_EVENT} from '@services'
import {Languages} from '@translations'
import styles from './styles'
import {Theme} from '@theme'

export default class KitchenEquipment extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      kitchenEquipmentId: [],
      newKitchenEquipment: '',
      isLoading: false,
    }
  }

  async componentDidMount() {
    CustomerPreferenceService.on(CUSTOMER_PREFERNCE_EVENT.KITCHEN_EQUIPMENT, this.equipmentList)
    this.onLoadData()
    const {getProfile} = this.context
    const profile = await getProfile()
    console.log('equipment prefernces', profile)
    if (profile && profile.customerPreferenceProfilesByCustomerId) {
      if (
        profile.customerPreferenceProfilesByCustomerId &&
        profile.customerPreferenceProfilesByCustomerId.nodes.length > 0
      ) {
        const preferences = profile.customerPreferenceProfilesByCustomerId.nodes[0]
        this.setState(
          {
            newAllergies: preferences.customerOtherAllergyTypes
              ? JSON.parse(preferences.customerOtherAllergyTypes)
              : '',
            newCuisineItems: preferences.customerOtherCuisineTypes
              ? JSON.parse(preferences.customerOtherCuisineTypes)
              : '',
            newDietry: preferences.customerOtherDietaryRestrictionsTypes
              ? JSON.parse(preferences.customerOtherDietaryRestrictionsTypes)
              : '',
            newKitchenEquipment: preferences.customerOtherKitchenEquipmentTypes
              ? JSON.parse(preferences.customerOtherKitchenEquipmentTypes)
              : '',
            cuisineItems: preferences.customerCuisineTypeId,
            dietryTypeId: preferences.customerDietaryRestrictionsTypeId,
            kitchenEquipmentId: preferences.customerKitchenEquipmentTypeId,
            allergyTypeId: preferences.customerAllergyTypeId,
          },
          () => {
            // this.onSelectedCuisineItemsChange(preferences.customerCuisineTypeId)
          }
        )
      }
    }
  }

  componentWillUnmount() {
    CustomerPreferenceService.off(CUSTOMER_PREFERNCE_EVENT.KITCHEN_EQUIPMENT, this.equipmentList)
  }

  getKitchenEquipment = () => {
    const {kitchenEquipmentId, newKitchenEquipment} = this.state
    return {kitchenEquipmentId, newKitchenEquipment}
  }

  onLoadData = async () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        CustomerPreferenceService.getKitchenEquipmentData()
      }
    )
  }

  equipmentList = ({kitchenEquipment}) => {
    this.setState({isLoading: false})
    const temp = []
    kitchenEquipment.map((item, value) => {
      const val = {
        label: item.kitchenEquipmentTypeDesc,
        id: item.kitchenEquipmentTypeId,
        checked: false,
      }
      temp.push(val)
    })
    this.setState(
      {
        kitchenEquipment: temp,
      },
      () => {
        this.loadKitchenEquipmentData()
      }
    )
  }

  loadKitchenEquipmentData = async () => {
    const {kitchenEquipment} = this.state
    const {getProfile} = this.context
    const profile = await getProfile()
    console.log('dietary prefernces', profile)
    if (profile && profile.customerPreferenceProfilesByCustomerId) {
      if (
        profile.customerPreferenceProfilesByCustomerId &&
        profile.customerPreferenceProfilesByCustomerId.nodes.length > 0
      ) {
        const preferences = profile.customerPreferenceProfilesByCustomerId.nodes[0]
        const kitchenEquipmentType = kitchenEquipment

        const temp = []
        kitchenEquipmentType.map((res, index) => {
          console.log('res', res)
          const obj = {
            label: res.label,
            id: res.id,
            checked:
              preferences && preferences.customerKitchenEquipmentTypeId
                ? !preferences.customerKitchenEquipmentTypeId.every(item => item !== res.id)
                : false,
          }
          temp.push(obj)
        })

        console.log('kitchenEquipmentType', temp)
        this.setState({
          kitchenEquipment: temp,
        })
      }
    }
  }

  onEquipmentPress = (index, checked) => {
    const {kitchenEquipment} = this.state
    const temp = kitchenEquipment

    if (temp[index]) {
      temp[index].checked = !checked
    }

    this.setState(
      {
        kitchenEquipment: temp,
      },
      async () => {
        const val = []
        await kitchenEquipment.map((itemVal, key) => {
          if (itemVal.checked === true) {
            val.push(itemVal.id)
          }
        })
        this.setState({
          kitchenEquipmentId: val,
        })
      }
    )
  }

  onAddNewEquipment = value => {
    this.setState({
      newKitchenEquipment: value,
    })
  }

  onSave = () => {
    const {
      cuisineItems,
      newCuisineItems,
      allergyTypeId,
      newAllergies,
      dietryTypeId,
      newDietry,
      kitchenEquipmentId,
      newKitchenEquipment,
    } = this.state
    const {currentUser} = this.context
    const {onSaveCallBack, getValue, hideSave} = this.props
    console.log('currentUser', currentUser)
    if (currentUser !== null && currentUser !== undefined) {
      const obj = {
        customerPreferenceId: currentUser.customerPreferenceId,
        customerCuisineTypeId: cuisineItems,
        customerOtherCuisineTypes: newCuisineItems ? JSON.stringify(newCuisineItems) : null,
        customerAllergyTypeId: allergyTypeId,
        customerOtherAllergyTypes: newAllergies ? JSON.stringify(newAllergies) : null,
        customerDietaryRestrictionsTypeId: dietryTypeId,
        customerOtherDietaryRestrictionsTypes: newDietry ? JSON.stringify(newDietry) : null,
        customerKitchenEquipmentTypeId:
          kitchenEquipmentId && kitchenEquipmentId.length > 0 ? kitchenEquipmentId : null,
        customerOtherKitchenEquipmentTypes: newKitchenEquipment
          ? JSON.stringify(newKitchenEquipment)
          : null,
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
              text: Languages.customerPreference.toast_messages.kitchenEquipmentMessage,
            })
          }
        })
        .catch(error => {
          console.log('preferences error', error)
        })
    }
  }

  render() {
    const {kitchenEquipment, newKitchenEquipment, kitchenEquipmentId, isLoading} = this.state
    const {hideSave} = this.props
    if (isLoading) {
      return (
        <View style={styles.alignScreenCenter}>
          <Spinner mode="full" animating />
        </View>
      )
    }
    return (
      <ScrollView style={{marginTop: '5%'}}>
        <Label style={styles.allergiesLabel}>What type of kitchen equipment do you have?</Label>
        <View>
          {kitchenEquipment &&
            kitchenEquipment.length > 0 &&
            kitchenEquipment.map((item, index) => {
              return (
                <ListItem style={{borderBottomWidth: 0}}>
                  <CheckBox
                    checked={item.checked}
                    color={Theme.Colors.primary}
                    onPress={() => this.onEquipmentPress(index, item.checked)}
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
            value={newKitchenEquipment}
            onChangeText={value => this.onAddNewEquipment(value)}
            placeholder={Languages.customerPreference.labels.kitchenEquipmentPlaceholder}
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

KitchenEquipment.contextType = AuthContext
