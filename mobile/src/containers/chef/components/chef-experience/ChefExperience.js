/** @format */

import React, {Component} from 'react'
import {View, ScrollView, Platform} from 'react-native'
import MultiSelect from 'react-native-multiple-select'
import {
  Icon,
  Button,
  Textarea,
  Text,
  Label,
  ListItem,
  CheckBox,
  Body,
  Card,
  Input,
  Content,
  Form,
  Toast,
} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import KeyBoardSpacer from 'react-native-keyboard-spacer'
import {Theme} from '@theme'
import {
  ChefProfileService,
  PROFILE_DETAIL_EVENT,
  BasicProfileService,
  UPDATE_BASIC_PROFILE_EVENT,
  AuthContext,
  ChefPreferenceService,
} from '@services'
import {Languages} from '@translations'
import {CommonButton, Spinner} from '@components'
import styles from './styles'

export default class ChefExperience extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cuisineTypes: [],
      dishTypes: [],
      dishAddItems: true,
      canAddItems: true,
      cuisineItems: [],
      dishItems: [],
      isFetching: false,
      displaySelectedCuisineItems: [],
      displaySelectedDishItems: [],
      profile: {},
      workExperience: '',
    }
  }

  async componentDidMount() {
    ChefProfileService.on(PROFILE_DETAIL_EVENT.CUISINES, this.cuisineList)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.SAVE_NEW_CUSINE_ITEM, this.setNewCuisineItem)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.SAVE_NEW_DISH_ITEM, this.setNewDishItem)
    this.onCuisineTypes()
    this.onDishTypes()
    this.setState(
      {
        isFetching: true,
      },
      () => {
        // give some timeout for loading and setting the cuisine/dish types
        setTimeout(() => {
          this.loadData()
        }, 1500)
      }
    )
  }

  componentWillUnmount() {
    ChefProfileService.off(PROFILE_DETAIL_EVENT.CUISINES, this.cuisineList)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)
  }

  loadData = async () => {
    const {isLoggedIn, getProfile} = this.context
    if (isLoggedIn) {
      const profile = await getProfile()

      this.setState(
        {
          profile,
        },
        () => {
          this.loadProfileData()
        }
      )
    }
  }

  loadProfileData = () => {
    const {profile} = this.state
    this.setState({
      isFetching: false,
    })
    if (profile) {
      const chefProfile = profile
      if (
        chefProfile &&
        chefProfile.chefProfileExtendedsByChefId &&
        chefProfile.chefProfileExtendedsByChefId.nodes &&
        chefProfile.chefProfileExtendedsByChefId.nodes.length
      ) {
        const profileExtended = chefProfile.chefProfileExtendedsByChefId.nodes[0]
        let chefDesc = null

        if (profileExtended.chefDesc) {
          chefDesc = profileExtended.chefDesc
            ? JSON.parse(JSON.stringify(profileExtended.chefDesc))
            : null
        }

        let cuisineItems = []
        let dishItems = []
        if (
          chefProfile.chefSpecializationProfilesByChefId &&
          chefProfile.chefSpecializationProfilesByChefId.nodes &&
          chefProfile.chefSpecializationProfilesByChefId.nodes.length
        ) {
          cuisineItems = chefProfile.chefSpecializationProfilesByChefId.nodes[0].chefCuisineTypeId
            ? chefProfile.chefSpecializationProfilesByChefId.nodes[0].chefCuisineTypeId
            : []
          dishItems = chefProfile.chefSpecializationProfilesByChefId.nodes[0].chefDishTypeId
            ? chefProfile.chefSpecializationProfilesByChefId.nodes[0].chefDishTypeId
            : []
        }

        this.setState(
          {
            cuisineItems,
            workExperience: chefDesc,
            dishItems,
          },
          () => {
            this.onSelectedCuisineItemsChange(cuisineItems)

            this.onSelectedDishItemsChange(dishItems)
          }
        )
      }
    }
  }

  onCuisineTypes = async () => {
    const {currentUser} = this.context
    if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
      ChefProfileService.getCuisineData(currentUser.chefId)
    }
  }

  cuisineList = ({cuisineData}) => {
    if (cuisineData.hasOwnProperty('getCuisineTypes')) {
      const val = cuisineData.getCuisineTypes
      if (val && val.nodes !== [] && val.nodes !== undefined && val.nodes !== null) {
        this.setState({
          cuisineTypes: val.nodes,
        })
      }
    }
  }

  onDishTypes = async () => {
    const {currentUser} = this.context
    if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
      ChefProfileService.getDishesData(currentUser.chefId)
    }
  }

  dishesList = ({dishesData}) => {
    if (dishesData.hasOwnProperty('getDishTypes')) {
      const val = dishesData.getDishTypes
      if (val && val.nodes !== [] && val.nodes !== undefined && val.nodes !== null) {
        this.setState({
          dishTypes: val.nodes,
        })
      }
    }
  }

  onSelectedCuisineItemsChange = cuisineItems => {
    const {cuisineTypes} = this.state
    let displaySelectedCuisineItems = []
    displaySelectedCuisineItems = _.filter(cuisineTypes, item => {
      if (cuisineItems.indexOf(item.cuisineTypeId) !== -1) {
        return true
      }
    })
    this.setState({cuisineItems, displaySelectedCuisineItems})
  }

  onSelectedDishItemsChange = dishItems => {
    const {dishTypes} = this.state
    let displaySelectedDishItems = []
    displaySelectedDishItems = _.filter(dishTypes, item => {
      if (dishItems.indexOf(item.dishTypeId) !== -1) {
        return true
      }
    })
    this.setState({dishItems, displaySelectedDishItems})
  }

  removeSelectedCuisineItem = removeId => {
    const {cuisineItems, displaySelectedCuisineItems} = this.state
    let newSelectedIds = []
    newSelectedIds = _.filter(cuisineItems, item => item != removeId)

    let newDisplaySelectedCuisineItems = []
    newDisplaySelectedCuisineItems = _.filter(
      displaySelectedCuisineItems,
      item => item.cuisineTypeId != removeId
    )

    this.setState({
      cuisineItems: newSelectedIds,
      displaySelectedCuisineItems: newDisplaySelectedCuisineItems,
    })
  }

  removeSelectedDishItem = removeId => {
    const {dishItems, displaySelectedDishItems} = this.state
    let newSelectedIds = []
    newSelectedIds = _.filter(dishItems, item => item != removeId)

    let newDisplaySelectedDishItems = []
    newDisplaySelectedDishItems = _.filter(
      displaySelectedDishItems,
      item => item.dishTypeId !== removeId
    )

    this.setState({
      dishItems: newSelectedIds,
      displaySelectedDishItems: newDisplaySelectedDishItems,
    })
  }

  onChangeWorkExp = value => {
    this.setState({
      workExperience: value,
    })
  }

  renderLine = () => {
    return <View style={styles.border} />
  }

  onSave = () => {
    const {currentUser} = this.context
    const {onSaveCallBack} = this.props
    const {cuisineItems, workExperience, dishItems} = this.state
    if (currentUser && currentUser !== null && currentUser !== undefined) {
      const obj = {
        chefProfileExtendedId: currentUser.chefProfileExtendedId,
        chefDesc: workExperience || null,
        chefSpecializationId: currentUser.chefSpecializationId,
        chefCuisineTypeId: cuisineItems,
        chefDishTypeId: dishItems,
      }
      this.setState(
        {
          isFetching: true,
        },
        () => {
          ChefPreferenceService.updateChefWorkData(obj)
            .then(data => {
              this.setState({isFetching: false})
              BasicProfileService.emitProfileEvent()
              if (onSaveCallBack) {
                onSaveCallBack()
              }
              this.loadData()
            })
            .catch(error => {})
        }
      )
    }
  }

  onChangedishInput = value => {
    const {dishTypes} = this.state
    const count = dishTypes && dishTypes.length
    let dishAddItems = true
    dishTypes.map((item, key) => {
      if (value === item.dishTypeDesc) {
        dishAddItems = false
      }

      if (key + 1 === count) {
        this.setState({
          dishAddItems,
        })
      }
    })
  }

  addDishItem = value => {
    const {dishTypes} = this.state
    const count = dishTypes && dishTypes.length
    let saveVal = true
    dishTypes.map((item, key) => {
      const val = value[value.length - 1]
      if (val.name === item.dishTypeDesc) {
        saveVal = false
      }
      if (key + 1 === count && saveVal === false) {
        Toast.show({text: 'This Dish is already exists.'})
      }
      if (key + 1 === count && saveVal) {
        const {currentUser} = this.context

        const obj = {
          dishTypeName: val.name,
          chefId: currentUser.chefId,
          customerId: null,
        }

        ChefProfileService.saveDishItem(obj)
      }
    })
  }

  onChangeCuisineInput = value => {
    const {cuisineTypes} = this.state
    const count = cuisineTypes && cuisineTypes.length
    let canAddItems = true
    cuisineTypes.map((item, key) => {
      if (value === item.cuisineTypeDesc) {
        canAddItems = false
      }

      if (key + 1 === count) {
        this.setState({
          canAddItems,
        })
      }
    })
  }

  addCuisineItem = value => {
    const {cuisineTypes} = this.state
    const count = cuisineTypes && cuisineTypes.length
    let saveVal = true
    cuisineTypes.map((item, key) => {
      const val = value[value.length - 1]
      if (val.name === item.cuisineTypeDesc) {
        saveVal = false
      }

      if (key + 1 === count && saveVal === false) {
        Toast.show({text: 'This Cuisine is already exists.'})
      }

      if (key + 1 === count && saveVal) {
        const {currentUser} = this.context
        const obj = {
          cusineTypeName: val.name,
          chefId: currentUser.chefId,
          customerId: null,
        }

        ChefProfileService.saveCuisineItem(obj)
      }
    })
  }

  setNewDishItem = ({newDishItem}) => {
    const {dishTypes} = this.state
    console.log('newDishItem', newDishItem)
    let temp = []
    if (
      newDishItem.hasOwnProperty('createDishTypeMaster') &&
      newDishItem.createDishTypeMaster !== {}
    ) {
      if (
        newDishItem.createDishTypeMaster.hasOwnProperty('dishTypeMaster') &&
        newDishItem.createDishTypeMaster.dishTypeMaster !== {}
      ) {
        const value = newDishItem.createDishTypeMaster.dishTypeMaster

        temp = dishTypes

        const obj = {
          chefId: value.chefId,
          dishTypeDesc: value.dishTypeDesc,
          dishTypeId: value.dishTypeId,
          dishTypeName: value.dishTypeName,
          isAdminApprovedYn: value.isAdminApprovedYn,
          isManuallyYn: value.isManuallyYn,
        }
        temp.push(obj)
        this.setState(
          {
            dishTypes: temp,
          },
          () => {
            const {dishItems} = this.state
            dishItems.pop()
            const newarray = dishItems
            newarray.push(value.dishTypeId)
            this.onSelectedDishItemsChange(newarray)
          }
        )
      }
    }
  }

  setNewCuisineItem = ({newCuisineItem}) => {
    const {cuisineTypes} = this.state
    let temp = []
    if (
      newCuisineItem.hasOwnProperty('createCuisineTypeMaster') &&
      newCuisineItem.createCuisineTypeMaster !== {}
    ) {
      if (
        newCuisineItem.createCuisineTypeMaster.hasOwnProperty('cuisineTypeMaster') &&
        newCuisineItem.createCuisineTypeMaster.cuisineTypeMaster !== {}
      ) {
        const value = newCuisineItem.createCuisineTypeMaster.cuisineTypeMaster
        temp = cuisineTypes
        const obj = {
          chefId: value.chefId,
          cuisineTypeDesc: value.cuisineTypeDesc,
          cuisineTypeId: value.cuisineTypeId,
          cusineTypeName: value.cusineTypeName,
          isAdminApprovedYn: value.isAdminApprovedYn,
          isManuallyYn: value.isManuallyYn,
        }
        temp.push(obj)
        this.setState(
          {
            cuisineTypes: temp,
          },
          () => {
            const {cuisineItems} = this.state
            cuisineItems.pop()
            const newarray = cuisineItems
            newarray.push(value.cuisineTypeId)
            this.onSelectedCuisineItemsChange(newarray)
          }
        )
      }
    }
  }

  render() {
    // const {navigation} = this.props
    const {
      cuisineTypes,
      dishTypes,
      cuisineItems,
      dishItems,
      displaySelectedCuisineItems,
      displaySelectedDishItems,
      workExperience,
      isFetching,
    } = this.state
    let cuisineTypesValue = []
    let cuisineItemsValue = []
    let dishTypesValue = []
    let dishItemsValue = []
    if (cuisineTypes && cuisineTypes !== undefined && cuisineTypes !== null) {
      cuisineTypesValue = cuisineTypes
    }
    if (dishTypes && dishTypes !== undefined && dishTypes !== null) {
      dishTypesValue = dishTypes
    }

    if (dishItems && dishItems !== undefined && dishItems !== null) {
      dishItemsValue = dishItems
    }
    if (cuisineItems && cuisineItems !== undefined && cuisineItems !== null) {
      cuisineItemsValue = cuisineItems
    }
    if (isFetching) {
      return <Spinner mode="full" />
    }
    return (
      <ScrollView style={{paddingBottom: '10%'}}>
        <View style={styles.container}>
          <Label style={styles.label}>Cuisine specialties</Label>
          <View style={styles.formContainer}>
            <MultiSelect
              hideTags
              items={cuisineTypesValue}
              uniqueKey="cuisineTypeId"
              ref={component => {
                this.cuisineSelect = component
              }}
              onChangeInput={text => this.onChangeCuisineInput(text)}
              onSelectedItemsChange={this.onSelectedCuisineItemsChange}
              selectedItems={cuisineItemsValue}
              selectText="Pick Cuisine Items"
              searchInputPlaceholderText="Search Items..."
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
              canAddItems={this.state.canAddItems}
              onAddItem={value => this.addCuisineItem(value)}
            />
            <View style={styles.cusineTagBody}>
              {displaySelectedCuisineItems && displaySelectedCuisineItems.length
                ? displaySelectedCuisineItems.map((item, key) => {
                    return (
                      <Button
                        key={`cuisine-${key}`}
                        iconRight
                        small
                        rounded
                        light
                        style={styles.chipItem}>
                        <Text style={styles.locationText1}>{item.cusineTypeName}</Text>
                        <Icon
                          style={{
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
          </View>
          <Label style={styles.label}>Specialty Dishes</Label>
          <View style={styles.formContainer}>
            <MultiSelect
              hideTags
              items={dishTypesValue}
              uniqueKey="dishTypeId"
              ref={component => {
                this.dishSelect = component
              }}
              onChangeInput={text => this.onChangedishInput(text)}
              onSelectedItemsChange={this.onSelectedDishItemsChange}
              selectedItems={dishItemsValue}
              selectText="Pick Dish Items"
              searchInputPlaceholderText="Search Items..."
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="dishTypeDesc"
              searchInputStyle={{color: '#CCC'}}
              submitButtonColor={Theme.Colors.primary}
              submitButtonText="Submit"
              canAddItems={this.state.dishAddItems}
              onAddItem={value => this.addDishItem(value)}
            />
            <View style={styles.cusineTagBody}>
              {displaySelectedDishItems && displaySelectedDishItems.length
                ? displaySelectedDishItems.map((item, key) => {
                    return (
                      <Button
                        key={`dish-${key}`}
                        iconRight
                        small
                        rounded
                        light
                        style={styles.chipItem}>
                        <Text style={styles.locationText1}>{item.dishTypeName}</Text>
                        <Icon
                          style={{
                            color: '#ccc',
                          }}
                          onPress={() => this.removeSelectedDishItem(item.dishTypeId)}
                          name="close-circle"
                        />
                      </Button>
                    )
                  })
                : null}
            </View>
          </View>
          <Card style={styles.cardStyle}>
            <Label style={styles.label}>Describe your related work experience </Label>
            <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={workExperience}
              onChangeText={value => this.onChangeWorkExp(value)}
              placeholder="Work Experience"
            />
          </Card>
        </View>
        <CommonButton
          btnText={Languages.chefExperience.btnLabel.save}
          containerStyle={styles.saveBtn}
          onPress={this.onSave}
        />
        {Platform.OS === 'ios' && <KeyBoardSpacer />}
      </ScrollView>
    )
  }
}

ChefExperience.contextType = AuthContext
