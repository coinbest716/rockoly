/** @format */

/** @format */

import React, {Component} from 'react'
import {View, Platform, Alert, Image, PermissionsAndroid} from 'react-native'
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
} from 'native-base'
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler'
import MultiSelect from 'react-native-multiple-select'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import {Theme} from '@theme'
import {Allergies, Dietary, FavouriteCuisine, KitchenEquipment} from '@containers'
import {AuthContext, CustomerPreferenceService, CUSTOMER_PREFERNCE_EVENT} from '@services'
import {Languages} from '@translations'
import {Header, CommonButton} from '@components'
import styles from './styles'

export default class CustomerPreferences extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // allergies: [],
      // dietary: [],
      // kitchenEquipment: [],
      // newAllergies: '',
      // newDietry: '',
      // newKitchenEquipment: '',
      // cuisineItems: [],
      // displaySelectedCuisineItems: [],
      // cuisineTypes: [],
      // newCuisineItems: '',
      // allergyTypeId: [],
      // dietryTypeId: [],
      // kitchenEquipmentId: [],
    }
  }

  // async componentDidMount() {
  //   CustomerPreferenceService.on(CUSTOMER_PREFERNCE_EVENT.CUISINES, this.cuisineList)
  //   CustomerPreferenceService.on(CUSTOMER_PREFERNCE_EVENT.ALLERGY, this.allergyList)
  //   CustomerPreferenceService.on(CUSTOMER_PREFERNCE_EVENT.DIETRY, this.dietaryList)
  //   CustomerPreferenceService.on(CUSTOMER_PREFERNCE_EVENT.KITCHEN_EQUIPMENT, this.equipmentList)
  //   this.onLoadData()
  //   const {getProfile} = this.context
  //   const profile = await getProfile()
  //   console.log('profile prefernces', profile)
  //   if (profile && profile.customerPreferenceProfilesByCustomerId) {
  //     if (
  //       profile.customerPreferenceProfilesByCustomerId &&
  //       profile.customerPreferenceProfilesByCustomerId.nodes.length > 0
  //     ) {
  //       const preferences = profile.customerPreferenceProfilesByCustomerId.nodes[0]
  //       this.setState(
  //         {
  //           newAllergies: preferences.customerOtherAllergyTypes
  //             ? JSON.parse(preferences.customerOtherAllergyTypes)
  //             : '',
  //           newCuisineItems: preferences.customerOtherCuisineTypes
  //             ? JSON.parse(preferences.customerOtherCuisineTypes)
  //             : '',
  //           newDietry: preferences.customerOtherDietaryRestrictionsTypes
  //             ? JSON.parse(preferences.customerOtherDietaryRestrictionsTypes)
  //             : '',
  //           newKitchenEquipment: preferences.customerOtherKitchenEquipmentTypes
  //             ? JSON.parse(preferences.customerOtherKitchenEquipmentTypes)
  //             : '',
  //           cuisineItems: preferences.customerCuisineTypeId,
  //           dietryTypeId: preferences.customerDietaryRestrictionsTypeId,
  //           kitchenEquipmentId: preferences.customerKitchenEquipmentTypeId,
  //           allergyTypeId: preferences.customerAllergyTypeId,
  //         },
  //         () => {
  //           this.onSelectedCuisineItemsChange(preferences.customerCuisineTypeId)
  //         }
  //       )
  //     }
  //   }
  // }

  // componentWillUnmount() {
  //   CustomerPreferenceService.off(CUSTOMER_PREFERNCE_EVENT.CUISINES, this.cuisineList)
  //   CustomerPreferenceService.off(CUSTOMER_PREFERNCE_EVENT.ALLERGY, this.allergyList)
  //   CustomerPreferenceService.off(CUSTOMER_PREFERNCE_EVENT.DIETRY, this.dietaryList)
  //   CustomerPreferenceService.off(CUSTOMER_PREFERNCE_EVENT.KITCHEN_EQUIPMENT, this.equipmentList)
  // }

  // onLoadData = async () => {
  //   CustomerPreferenceService.getCuisineData()
  //   CustomerPreferenceService.getAllergyData()
  //   CustomerPreferenceService.getDietryData()
  //   CustomerPreferenceService.getKitchenEquipmentData()
  // }

  // cuisineList = ({cuisineData}) => {
  //   this.setState({
  //     cuisineTypes: cuisineData,
  //   })
  // }

  // allergyList = ({allergyData}) => {
  //   console.log('allergyData', allergyData)
  //   const temp = []
  //   allergyData.map((item, value) => {
  //     const val = {
  //       label: item.allergyTypeDesc,
  //       id: item.allergyTypeId,
  //       checked: false,
  //     }
  //     temp.push(val)
  //   })
  //   this.setState({
  //     allergies: temp,
  //   })
  // }

  // dietaryList = ({dietryData}) => {
  //   console.log('dietryData', dietryData)
  //   const temp = []
  //   dietryData.map((item, value) => {
  //     const val = {
  //       label: item.dietaryRestrictionsTypeDesc,
  //       id: item.dietaryRestrictionsTypeId,
  //       checked: false,
  //     }
  //     temp.push(val)
  //   })
  //   this.setState({
  //     dietary: temp,
  //   })
  // }

  // equipmentList = ({kitchenEquipment}) => {
  //   console.log('kitchenEquipment', kitchenEquipment)
  //   const temp = []
  //   kitchenEquipment.map((item, value) => {
  //     const val = {
  //       label: item.kitchenEquipmentTypeDesc,
  //       id: item.kitchenEquipmentTypeId,
  //       checked: false,
  //     }
  //     temp.push(val)
  //   })
  //   this.setState({
  //     kitchenEquipment: temp,
  //   })
  // }

  // onAllergiesItemPress = (index, checked) => {
  //   const {allergies} = this.state
  //   const temp = allergies

  //   if (temp[index]) {
  //     temp[index].checked = !checked
  //   }

  //   console.log('temp', temp)
  //   this.setState(
  //     {
  //       allergies: temp,
  //     },
  //     async () => {
  //       const val = []
  //       await allergies.map((itemVal, key) => {
  //         if (itemVal.checked === true) {
  //           val.push(itemVal.id)
  //         }
  //       })
  //       this.setState({
  //         allergyTypeId: val,
  //       })
  //     }
  //   )
  // }

  // onDietryItemPress = (index, checked) => {
  //   const {dietary} = this.state
  //   const temp = dietary

  //   if (temp[index]) {
  //     temp[index].checked = !checked
  //   }

  //   this.setState(
  //     {
  //       dietary: temp,
  //     },
  //     async () => {
  //       const val = []
  //       await dietary.map((itemVal, key) => {
  //         if (itemVal.checked === true) {
  //           val.push(itemVal.id)
  //         }
  //       })
  //       this.setState({
  //         dietryTypeId: val,
  //       })
  //     }
  //   )
  // }

  // onEquipmentPress = (index, checked) => {
  //   const {kitchenEquipment} = this.state
  //   const temp = kitchenEquipment

  //   if (temp[index]) {
  //     temp[index].checked = !checked
  //   }

  //   this.setState(
  //     {
  //       kitchenEquipment: temp,
  //     },
  //     async () => {
  //       const val = []
  //       await kitchenEquipment.map((itemVal, key) => {
  //         if (itemVal.checked === true) {
  //           val.push(itemVal.id)
  //         }
  //       })
  //       this.setState({
  //         kitchenEquipmentId: val,
  //       })
  //     }
  //   )
  // }

  // onAddNewAllergies = value => {
  //   this.setState({
  //     newAllergies: value,
  //   })
  // }

  // onAddNewDietry = value => {
  //   this.setState({
  //     newDietry: value,
  //   })
  // }

  // onAddNewEquipment = value => {
  //   this.setState({
  //     newKitchenEquipment: value,
  //   })
  // }

  // onAddNewCuisineItems = value => {
  //   this.setState({
  //     newCuisineItems: value,
  //   })
  // }

  // onSelectedCuisineItemsChange = cuisineItem => {
  //   const {cuisineTypes} = this.state
  //   let displaySelectedCuisineItems = []
  //   displaySelectedCuisineItems = _.filter(cuisineTypes, item => {
  //     if (cuisineItem.indexOf(item.cuisineTypeId) !== -1) {
  //       return true
  //     }
  //   })
  //   this.setState({cuisineItems: cuisineItem, displaySelectedCuisineItems}, () => {
  //     // this.updateCuisineFilter(cuisineItem)
  //   })
  // }

  // removeSelectedCuisineItem = removeId => {
  //   const {cuisineItems, displaySelectedCuisineItems} = this.state
  //   let newSelectedIds = []
  //   newSelectedIds = _.filter(cuisineItems, item => item !== removeId)

  //   let newDisplaySelectedCuisineItems = []
  //   newDisplaySelectedCuisineItems = _.filter(
  //     displaySelectedCuisineItems,
  //     item => item.cuisineTypeId !== removeId
  //   )

  //   this.setState(
  //     {
  //       cuisineItems: newSelectedIds,
  //       displaySelectedCuisineItems: newDisplaySelectedCuisineItems,
  //     },
  //     () => {
  //       // this.updateCuisineFilter(newSelectedIds)
  //     }
  //   )
  // }

  onAllergyComplete = () => {}

  onSave = async () => {
    console.log('onSave')
    const {currentUser, getProfile} = this.context
    console.log('currentUser', currentUser)
    const profile = await getProfile()
    console.log('profile prefernces', profile)

    let preferences = []
    if (profile && profile.customerPreferenceProfilesByCustomerId) {
      if (
        profile.customerPreferenceProfilesByCustomerId &&
        profile.customerPreferenceProfilesByCustomerId.nodes.length > 0
      ) {
        const {nodes} = profile.customerPreferenceProfilesByCustomerId
        preferences = nodes
      }
    }

    if (currentUser !== null && currentUser !== undefined) {
      const obj = {
        customerPreferenceId: currentUser.customerPreferenceId,
        customerCuisineTypeId: preferences[0].customerCuisineTypeId,
        customerOtherCuisineTypes: preferences[0].customerOtherCuisineTypes
          ? JSON.stringify(preferences[0].customerOtherCuisineTypes)
          : null,
        customerAllergyTypeId: preferences[0].customerAllergyTypeId,
        customerOtherAllergyTypes: preferences[0].customerOtherAllergyTypes
          ? JSON.stringify(preferences[0].customerOtherAllergyTypes)
          : null,
        customerDietaryRestrictionsTypeId: preferences[0].customerDietaryRestrictionsTypeId,
        customerOtherDietaryRestrictionsTypes: preferences[0].customerOtherDietaryRestrictionsTypes
          ? JSON.stringify(preferences[0].customerOtherDietaryRestrictionsTypes)
          : null,
        customerKitchenEquipmentTypeId: preferences[0].customerKitchenEquipmentTypeId,
        customerOtherKitchenEquipmentTypes: preferences[0].customerOtherKitchenEquipmentTypes
          ? JSON.stringify(preferences[0].customerOtherKitchenEquipmentTypes)
          : null,
      }
      console.log('onSave obj', obj)
      CustomerPreferenceService.updatePreferencesData(obj)
        .then(data => {
          console.log('preferences data', data)
        })
        .catch(error => {
          console.log('preferences error', error)
        })
    }
  }

  render() {
    const {
      allergies,
      dietary,
      kitchenEquipment,
      newAllergies,
      newDietry,
      newKitchenEquipment,
      cuisineTypes,
      cuisineItems,
      displaySelectedCuisineItems,
      newCuisineItems,
      allergyTypeId,
      dietryTypeId,
      kitchenEquipmentId,
    } = this.state

    const {navigation} = this.props

    return (
      <View style={styles.container}>
        <Header showBack title={Languages.customerPreference.title} showBell={false} />
        <ScrollView>
          {/* <View>
            <Label style={styles.allergiesLabel}>Please provide your allergies if any.</Label>
            <View>
              {allergies &&
                allergies.length > 0 &&
                allergies.map((item, index) => {
                  return (
                    <ListItem style={{borderBottomWidth: 0}}>
                      <CheckBox
                        checked={item.checked}
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
                placeholder={Languages.customerPreference.labels.allergiesPlaceholder}
              />
            </View>
          </View>
          <View>
            <Label style={styles.allergiesLabel}>
              Please provide your dietary restrictions if any.
            </Label>
            <View>
              {dietary &&
                dietary.length > 0 &&
                dietary.map((item, index) => {
                  return (
                    <ListItem style={{borderBottomWidth: 0}}>
                      <CheckBox
                        checked={item.checked}
                        onPress={() => this.onDietryItemPress(index, item.checked)}
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
                value={newDietry}
                onChangeText={value => this.onAddNewDietry(value)}
                placeholder={Languages.customerPreference.labels.dietryPlaceholder}
              />
            </View>
          </View>
          <View>
            <Label style={styles.allergiesLabel}>
              What type of kitchen equipment do you have ?
            </Label>
            <View>
              {kitchenEquipment &&
                kitchenEquipment.length > 0 &&
                kitchenEquipment.map((item, index) => {
                  return (
                    <ListItem style={{borderBottomWidth: 0}}>
                      <CheckBox
                        checked={item.checked}
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
          </View>
          <View>
            <Label style={styles.allergiesLabel}>What is your favourite cuisine ?</Label>
            <MultiSelect
              hideTags
              items={cuisineTypes}
              uniqueKey="cuisineTypeId"
              ref={component => {
                this.cuisineSelect = component
              }}
              onSelectedItemsChange={this.onSelectedCuisineItemsChange}
              selectedItems={cuisineItems}
              selectText={Languages.filter.labels.select_cuisine}
              searchInputPlaceholderText={Languages.filter.labels.search}
              onChangeInput={text => console.log(text)}
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="cuisineTypeDesc"
              searchInputStyle={{color: '#CCC'}}
              submitButtonColor={Theme.Colors.primary}
              submitButtonText="Submit"
              hideDropdown
            />
            <View style={styles.cusineTagBody}>
              {displaySelectedCuisineItems && displaySelectedCuisineItems.length
                ? displaySelectedCuisineItems.map((item, key) => {
                    return (
                      <Button key={key} iconRight rounded light style={styles.chipItem}>
                        <Text style={styles.locationText1}>{item.cusineTypeName}</Text>
                        <Icon
                          style={{
                            // paddingHorizontal: 3,
                            color: '#ccc',
                          }}
                          onPress={() => this.removeSelectedCuisineItem(item.cuisineTypeId)}
                          name="close-circle"
                        />
                      </Button>
                    )
                  })
                : null}
            </View>
            <View style={styles.textAreaContent} />
            <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={newCuisineItems}
              onChangeText={value => this.onAddNewCuisineItems(value)}
              placeholder={Languages.customerPreference.labels.cuisinePlaceholder}
            />
          </View> */}
          <Allergies navigation={navigation} />
          <Dietary navigation={navigation} />
          <KitchenEquipment navigation={navigation} />
          <FavouriteCuisine navigation={navigation} />
          <CommonButton
            btnText={Languages.customerPreference.labels.save}
            containerStyle={styles.saveBtn}
            onPress={this.onSave}
          />
        </ScrollView>
      </View>
    )
  }
}

CustomerPreferences.contextType = AuthContext
