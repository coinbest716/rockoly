/** @format */

import React, {PureComponent} from 'react'
import {View, ScrollView} from 'react-native'
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
import _ from 'lodash'
import MultiSelect from 'react-native-multiple-select'
import {CommonButton, Spinner} from '@components'
import {Theme} from '@theme'
import {AuthContext, CustomerPreferenceService, CUSTOMER_PREFERNCE_EVENT} from '@services'
import {Languages} from '@translations'
import styles from './styles'

export default class FavouriteCuisine extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      cuisineItems: [],
      displaySelectedCuisineItems: [],
      cuisineTypes: [],
      newCuisineItems: '',
      isLoading: false,
    }
  }

  async componentDidMount() {
    CustomerPreferenceService.on(CUSTOMER_PREFERNCE_EVENT.CUISINES, this.cuisineList)
    this.onLoadData()
    const {getProfile} = this.context
    const profile = await getProfile()
    console.log('cuisine prefernces', profile)
    if (profile && profile.customerPreferenceProfilesByCustomerId) {
      if (
        profile.customerPreferenceProfilesByCustomerId &&
        profile.customerPreferenceProfilesByCustomerId.nodes.length > 0
      ) {
        const preferences = profile.customerPreferenceProfilesByCustomerId.nodes[0]
        this.setState(
          {
            newDietry: preferences.customerOtherDietaryRestrictionsTypes
              ? JSON.parse(preferences.customerOtherDietaryRestrictionsTypes)
              : '',
            newAllergies: preferences.customerOtherAllergyTypes
              ? JSON.parse(preferences.customerOtherAllergyTypes)
              : '',
            dietryTypeId: preferences.customerDietaryRestrictionsTypeId,
            allergyTypeId: preferences.customerAllergyTypeId,
            cuisineItems:
              preferences.customerCuisineTypeId !== null ? preferences.customerCuisineTypeId : [],
            newCuisineItems: preferences.customerOtherCuisineTypes
              ? JSON.parse(preferences.customerOtherCuisineTypes)
              : '',
          },
          () => {
            this.onSelectedCuisineItemsChange(this.state.cuisineItems)
          }
        )
      }
    }
  }

  componentWillUnmount() {
    CustomerPreferenceService.off(CUSTOMER_PREFERNCE_EVENT.CUISINES, this.cuisineList)
  }

  onLoadData = async () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        CustomerPreferenceService.getCuisineData()
      }
    )
  }

  cuisineList = ({cuisineData}) => {
    this.setState({isLoading: false})
    this.setState({
      cuisineTypes: cuisineData,
    })
  }

  onAddNewCuisineItems = value => {
    this.setState({
      newCuisineItems: value,
    })
  }

  onSelectedCuisineItemsChange = cuisineItem => {
    const {cuisineTypes} = this.state
    let displaySelectedCuisineItems = []
    displaySelectedCuisineItems = _.filter(cuisineTypes, item => {
      if (cuisineItem.indexOf(item.cuisineTypeId) !== -1) {
        return true
      }
    })
    this.setState({cuisineItems: cuisineItem, displaySelectedCuisineItems}, () => {
      // this.updateCuisineFilter(cuisineItem)
    })
  }

  removeSelectedCuisineItem = removeId => {
    const {cuisineItems, displaySelectedCuisineItems} = this.state
    let newSelectedIds = []
    newSelectedIds = _.filter(cuisineItems, item => item !== removeId)

    let newDisplaySelectedCuisineItems = []
    newDisplaySelectedCuisineItems = _.filter(
      displaySelectedCuisineItems,
      item => item.cuisineTypeId !== removeId
    )

    this.setState(
      {
        cuisineItems: newSelectedIds,
        displaySelectedCuisineItems: newDisplaySelectedCuisineItems,
      },
      () => {
        // this.updateCuisineFilter(newSelectedIds)
      }
    )
  }

  onSave = () => {
    console.log('onSave')
    const {
      cuisineItems,
      newCuisineItems,
      allergyTypeId,
      newAllergies,
      dietryTypeId,
      newDietry,
    } = this.state
    const {currentUser} = this.context
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
      }
      console.log('onSave obj', obj)
      CustomerPreferenceService.updatePreferencesData(obj)
        .then(data => {
          console.log('preferences data', data)
          this.props.onSave()
        })
        .catch(error => {
          console.log('preferences error', error)
        })
    }
  }

  render() {
    const {
      cuisineTypes,
      cuisineItems,
      displaySelectedCuisineItems,
      newCuisineItems,
      isLoading,
    } = this.state
    if (isLoading) {
      return <Spinner mode="full" />
    }
    return (
      <ScrollView style={{marginTop: '5%'}}>
        <Label style={styles.allergiesLabel}>What is your favourite cuisine ?</Label>
        <View style={{marginHorizontal: 10}}>
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
                    <Button key={key} iconRight small rounded light style={styles.chipItem}>
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
        </View>
        <CommonButton
          btnText={Languages.customerPreference.labels.save}
          containerStyle={styles.saveBtn}
          onPress={this.onSave}
        />
      </ScrollView>
    )
  }
}

FavouriteCuisine.contextType = AuthContext
