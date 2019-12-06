/** @format */

import React, {Component} from 'react'
import {View, ScrollView} from 'react-native'
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
  Item,
  Input,
  Content,
  Form,
} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
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
      // dishTypes: [],
      cuisineItems: [],
      // dishItems: [],
      isFetching: false,
      displaySelectedCuisineItems: [],
      displaySelectedDishItems: [],
      profile: {},
      workExperience: '',
    }
  }

  async componentDidMount() {
    console.log('chef Experience')
    ChefProfileService.on(PROFILE_DETAIL_EVENT.CUISINES, this.cuisineList)
    // ChefProfileService.on(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)
    this.onCuisineTypes()
    // this.onDishTypes()
    this.setState(
      {
        isFetching: true,
      },
      () => {
        this.loadData()
      }
    )
  }

  componentWillUnmount() {
    ChefProfileService.off(PROFILE_DETAIL_EVENT.CUISINES, this.cuisineList)
    // ChefProfileService.off(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)
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
    console.log('loadProfileData', profile)
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
          chefDesc = profileExtended.chefDesc ? JSON.parse(profileExtended.chefDesc) : null
        }

        let cuisineItems = []
        // let dishItems = []
        if (
          chefProfile.chefSpecializationProfilesByChefId &&
          chefProfile.chefSpecializationProfilesByChefId.nodes &&
          chefProfile.chefSpecializationProfilesByChefId.nodes.length
        ) {
          cuisineItems = chefProfile.chefSpecializationProfilesByChefId.nodes[0].chefCuisineTypeId
            ? chefProfile.chefSpecializationProfilesByChefId.nodes[0].chefCuisineTypeId
            : []
          // dishItems = chefProfile.chefSpecializationProfilesByChefId.nodes[0].chefDishTypeId
          //   ? chefProfile.chefSpecializationProfilesByChefId.nodes[0].chefDishTypeId
          //   : []
        }

        this.setState(
          {
            cuisineItems,
            workExperience: chefDesc,
            // dishItems,
          },
          () => {
            this.onSelectedCuisineItemsChange(cuisineItems)

            // this.onSelectedDishItemsChange(dishItems)
          }
        )
      }
    }
  }

  onCuisineTypes = async () => {
    const {currentUser} = this.context
    console.log('onCuisineTypes', currentUser)
    if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
      ChefProfileService.getCuisineData(currentUser.chefId)
    }
  }

  cuisineList = ({cuisineData}) => {
    console.log('cuisineData', cuisineData)
    if (cuisineData.hasOwnProperty('getCuisineTypes')) {
      const val = cuisineData.getCuisineTypes
      if (val && val.nodes !== [] && val.nodes !== undefined && val.nodes !== null) {
        this.setState({
          cuisineTypes: val.nodes,
        })
      }
    }
  }

  // onDishTypes = async () => {
  //   const {currentUser} = this.context
  //   if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
  //     ChefProfileService.getDishesData(currentUser.chefId)
  //   }
  // }

  // dishesList = ({dishesData}) => {
  //   if (dishesData.hasOwnProperty('getDishTypes')) {
  //     const val = dishesData.getDishTypes
  //     if (val && val.nodes !== [] && val.nodes !== undefined && val.nodes !== null) {
  //       this.setState({
  //         dishTypes: val.nodes,
  //       })
  //     }
  //   }
  // }

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

  // onSelectedDishItemsChange = dishItems => {
  //   const {dishTypes} = this.state
  //   let displaySelectedDishItems = []
  //   displaySelectedDishItems = _.filter(dishTypes, item => {
  //     if (dishItems.indexOf(item.dishTypeId) !== -1) {
  //       return true
  //     }
  //   })
  //   this.setState({dishItems, displaySelectedDishItems})
  // }

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

  // removeSelectedDishItem = removeId => {
  //   const {dishItems, displaySelectedDishItems} = this.state
  //   let newSelectedIds = []
  //   newSelectedIds = _.filter(dishItems, item => item != removeId)

  //   let newDisplaySelectedDishItems = []
  //   newDisplaySelectedDishItems = _.filter(
  //     displaySelectedDishItems,
  //     item => item.dishTypeId !== removeId
  //   )

  //   this.setState({
  //     dishItems: newSelectedIds,
  //     displaySelectedDishItems: newDisplaySelectedDishItems,
  //   })
  // }

  onChangeWorkExp = value => {
    this.setState({
      workExperience: value,
    })
  }

  onSave = () => {
    const {currentUser} = this.context
    const {cuisineItems, workExperience} = this.state
    if (currentUser && currentUser !== null && currentUser !== undefined) {
      const obj = {
        chefProfileExtendedId: currentUser.chefProfileExtendedId,
        chefDesc: workExperience ? JSON.stringify(workExperience) : null,
        chefSpecializationId: currentUser.chefSpecializationId,
        chefCuisineTypeId: cuisineItems,
      }
      this.setState(
        {
          isFetching: true,
        },
        () => {
          console.log('Chef Experience save', obj)
          ChefPreferenceService.updateChefWorkData(obj)
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
    // let dishTypesValue = []
    // let dishItemsValue = []
    if (cuisineTypes && cuisineTypes !== undefined && cuisineTypes !== null) {
      cuisineTypesValue = cuisineTypes
    }

    // if (dishTypes && dishTypes !== undefined && dishTypes !== null) {
    //   dishTypesValue = dishTypes
    // }

    // if (dishItems && dishItems !== undefined && dishItems !== null) {
    //   dishItemsValue = dishItems
    // }
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
              canAddItems
              onAddItem={value => this.addCuisineItem(value)}
            />
            <View style={styles.cusineTagBody}>
              {displaySelectedCuisineItems && displaySelectedCuisineItems.length
                ? displaySelectedCuisineItems.map((item, key) => {
                    return (
                      <Button key={key} iconRight small rounded light style={styles.chipItem}>
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
          {/* <View style={styles.formContainer}>
            <MultiSelect
              hideTags
              items={dishTypesValue}
              uniqueKey="dishTypeId"
              ref={component => {
                this.dishSelect = component
              }}
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
              canAddItems
              onAddItem={value => this.addDishItem(value)}
            />
            <View style={styles.cusineTagBody}>
              {displaySelectedDishItems && displaySelectedDishItems.length
                ? displaySelectedDishItems.map((item, key) => {
                    return (
                      <Button key={key} iconRight small rounded light style={styles.chipItem}>
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
          </View> */}
          <View>
            <Label style={styles.label}>Describe your related work experience </Label>
            <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={workExperience}
              onChangeText={value => this.onChangeWorkExp(value)}
              placeholder="Work Experience"
            />
          </View>
        </View>
        <CommonButton
          btnText={Languages.chefExperience.btnLabel.save}
          containerStyle={styles.saveBtn}
          onPress={this.onSave}
        />
      </ScrollView>
    )
  }
}

ChefExperience.contextType = AuthContext
