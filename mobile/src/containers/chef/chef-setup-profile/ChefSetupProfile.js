/** @format */

import React, {PureComponent} from 'react'
import {View} from 'react-native'
import {Icon, Button, Textarea, Text, Item, Input, Content, Form} from 'native-base'
import DateTimePicker from 'react-native-modal-datetime-picker'
import MultiSelect from 'react-native-multiple-select'
import _ from 'lodash'
import moment, {lang} from 'moment'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Spinner, Header} from '@components'
import {
  ChefProfileService,
  PROFILE_DETAIL_EVENT,
  BasicProfileService,
  UPDATE_BASIC_PROFILE_EVENT,
} from '@services'
import {Languages} from '@translations'
import {AuthContext} from '../../../AuthContext'
import {RouteNames} from '@navigation'
import Styles from './styles'
import {Theme} from '@theme'

export default class ChefSetupProfile extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isGalleryLoading: false,
      isDocLoading: false,
      facebookUrl: '',
      twitterUrl: '',
      cuisineTypes: [],
      dishTypes: [],
      cuisineItems: [],
      dishItems: [],
      experience: '',
      drivingLicenseNo: '',
      bookHours: 0,
      description: '',
      firstName: '',
      lastName: '',
      price: '',
      bussinessFromTime: null,
      bussinessToTime: null,
      chefIdValue: {},
      isFromTimePickerVisible: false,
      isToTimePickerVisible: false,
      isFetching: false,
      displaySelectedCuisineItems: [],
      displaySelectedDishItems: [],
      ingredientsDesc: '',
      profile: {},
    }
  }

  async componentDidMount() {
    BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updatedProfileInfo)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_DETAIL, this.setList)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.UPDATE_CHEF_PROFILE_DETAILS, this.setUpdateDetails)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_ATTACHMENTS, this.setAttachments)

    ChefProfileService.on(PROFILE_DETAIL_EVENT.CUISINES, this.cuisineList)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)

    ChefProfileService.on(PROFILE_DETAIL_EVENT.SAVE_NEW_CUSINE_ITEM, this.setNewCuisineItem)
    ChefProfileService.on(PROFILE_DETAIL_EVENT.SAVE_NEW_DISH_ITEM, this.setNewDishItem)

    const {isLoggedIn, currentUser} = this.context
    this.onCuisineTypes()
    this.onDishTypes()
    this.loadData()
    if (isLoggedIn === true) {
      if (currentUser !== undefined && currentUser !== null && currentUser !== {}) {
        this.setState(
          {
            chefIdValue: currentUser,
            isFetching: true,
          },
          () => {
            BasicProfileService.profileSubscriptionForChef(currentUser.chefId)

            ChefProfileService.getChefProfileDetail(currentUser.chefId)
          }
        )
      }
    }
  }

  componentWillUnmount() {
    BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updatedProfileInfo)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_DETAIL, this.setList)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.GET_CHEF_PROFILE_ATTACHMENTS, this.setAttachments)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.UPDATE_CHEF_PROFILE_DETAILS, this.setUpdateDetails)

    ChefProfileService.off(PROFILE_DETAIL_EVENT.CUISINES, this.cuisineList)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.DISHES, this.dishesList)

    ChefProfileService.off(PROFILE_DETAIL_EVENT.SAVE_NEW_CUSINE_ITEM, this.setNewCuisineItem)
    ChefProfileService.off(PROFILE_DETAIL_EVENT.SAVE_NEW_DISH_ITEM, this.setNewDishItem)
  }

  updatedProfileInfo = ({data}) => {
    const {isLoggedIn, currentUser} = this.context
    if (isLoggedIn && currentUser) {
      ChefProfileService.getChefProfileDetail(currentUser.chefId)
    }
  }

  onComplete = () => {
    const {
      description,
      experience,
      drivingLicenseNo,
      facebookUrl,
      twitterUrl,
      cuisineItems,
      dishItems,
      firstName,
      lastName,
      bussinessFromTime,
      bussinessToTime,
      price,
      chefIdValue,
      ingredientsDesc,
      bookHours,
      profile,
    } = this.state
    const {isChef, isLoggedIn} = this.context
    let status = ``
    if (isChef && isLoggedIn && profile) {
      status = profile.chefStatusId && profile.chefStatusId.trim()
    }
    const temp = []
    temp.push(ingredientsDesc)
    const fromTime = bussinessFromTime ? moment(bussinessFromTime, 'hh:mm A').format('HH:mm') : null
    const toTime = bussinessToTime ? moment(bussinessToTime, 'hh:mm A').format('HH:mm') : null
    const params = {
      description,
      experience,
      drivingLicenseNo,
      facebookUrl,
      twitterUrl,
      cuisineItems,
      dishItems,
      firstName,
      lastName,
      bussinessFromTime: fromTime,
      bussinessToTime: toTime,
      price: price ? parseFloat(price) : null,
      chefIdValue,
      ingredientsDesc: JSON.stringify(temp),
      customerBookingHours: bookHours ? bookHours * 60 : null,
    }
    if (
      chefIdValue !== undefined &&
      chefIdValue !== '' &&
      chefIdValue !== null &&
      chefIdValue !== {}
    ) {
      this.setState(
        {
          isFetching: true,
        },
        () => {
          ChefProfileService.updateChefProfileDetails(params)
        }
      )
    }
    this.goToProfileStack()
  }

  setUpdateDetails = ({updateProfileDetails}) => {
    this.setState({
      isFetching: false,
    })
  }

  handleTimePicked = (date, stateValue) => {
    const fromTime = moment(date).format('hh:mm A')
    this.setState({[stateValue]: fromTime})
    this.hideTimePicker('isFromTimePickerVisible')
    this.hideTimePicker('isToTimePickerVisible')
  }

  hideTimePicker = stateValue => {
    this.setState({[stateValue]: false}, () => {})
  }

  showTimePicker = stateValue => {
    this.setState({[stateValue]: true}, () => {})
  }

  setList = ({profileDetails}) => {
    this.setState({
      isFetching: false,
    })
    if (profileDetails.chefProfileByChefId) {
      const chefProfile = profileDetails.chefProfileByChefId
      if (
        chefProfile &&
        chefProfile.chefProfileExtendedsByChefId &&
        chefProfile.chefProfileExtendedsByChefId.nodes &&
        chefProfile.chefProfileExtendedsByChefId.nodes.length
      ) {
        const profileExtended = chefProfile.chefProfileExtendedsByChefId.nodes[0]
        let minimumHours = null

        if (profileExtended.minimumNoOfMinutesForBooking) {
          minimumHours = profileExtended.minimumNoOfMinutesForBooking / 60
        }

        let cuisineItems = []
        let dishItems = []
        let ingredients = ''
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

          if (chefProfile.chefSpecializationProfilesByChefId.nodes[0].ingredientsDesc) {
            ingredients = JSON.parse(
              chefProfile.chefSpecializationProfilesByChefId.nodes[0].ingredientsDesc
            )
          }
        }

        this.setState(
          {
            firstName: chefProfile.chefFirstName,
            lastName: chefProfile.chefLastName,
            drivingLicenseNo: profileExtended.chefDrivingLicenseNo,
            experience: profileExtended.chefExperience,
            description: profileExtended.chefDesc,
            facebookUrl: profileExtended.chefFacebookUrl,
            twitterUrl: profileExtended.chefTwitterUrl,
            price: profileExtended.chefPricePerHour,
            bussinessFromTime: profileExtended.chefBusinessHoursFromTime,
            bussinessToTime: profileExtended.chefBusinessHoursToTime,
            cuisineItems,
            dishItems,
            ingredientsDesc: ingredients[0],
            bookHours: minimumHours ? minimumHours.toString() : null,
          },
          () => {
            this.onSelectedCuisineItemsChange(cuisineItems)

            this.onSelectedDishItemsChange(dishItems)
          }
        )
      }
      // get attachemnts
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

  onBack = () => {
    const {navigation} = this.props
    navigation.goBack()
  }

  removeSelectedDishItem = removeId => {
    const {dishItems, displaySelectedDishItems} = this.state
    let newSelectedIds = []
    newSelectedIds = _.filter(dishItems, item => item != removeId)

    let newDisplaySelectedDishItems = []
    newDisplaySelectedDishItems = _.filter(
      displaySelectedDishItems,
      item => item.dishTypeId != removeId
    )

    this.setState({
      dishItems: newSelectedIds,
      displaySelectedDishItems: newDisplaySelectedDishItems,
    })
  }

  close = () => {
    this.setState({
      visible: false,
    })
  }

  onChangeFacebook = value => {
    this.setState({
      facebookUrl: value,
    })
  }

  onSetAvailabiltyPress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.SET_AVAILABILITY_SCREEN)
  }

  onChangeTwitter = value => {
    this.setState({
      twitterUrl: value,
    })
  }

  onChangeExperience = value => {
    this.setState({
      experience: value,
    })
  }

  onChangeLicenseNumber = value => {
    this.setState({
      drivingLicenseNo: value,
    })
  }

  goToProfileStack = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_PROFILE_STACK)
  }

  goToSetAvailability = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.SET_AVAILABILITY_SCREEN)
  }

  onChangeBookingHours = value => {
    this.setState(
      {
        bookHours: value,
      },
      () => {}
    )
  }

  onChangeDescription = value => {
    this.setState({
      description: value,
    })
  }

  onChangeFirstName = value => {
    this.setState({
      firstName: value,
    })
  }

  onChangeLastName = value => {
    this.setState({
      lastName: value,
    })
  }

  onChangeFromTime = value => {
    this.setState({
      bussinessFromTime: value,
    })
  }

  onChangeToTime = value => {
    this.setState({
      bussinessToTime: value,
    })
  }

  onChangePrice = value => {
    this.setState({
      price: value,
    })
  }

  addCuisineItem = value => {
    const val = value[value.length - 1]
    const {chefIdValue} = this.state
    const obj = {
      cusineTypeName: val.name,
      chefId: chefIdValue.chefId,
      customerId: null,
    }

    ChefProfileService.saveCuisineItem(obj)
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

  addDishItem = value => {
    const val = value[value.length - 1]
    const {chefIdValue} = this.state
    const obj = {
      dishTypeName: val.name,
      chefId: chefIdValue.chefId,
      customerId: null,
    }

    ChefProfileService.saveDishItem(obj)
  }

  setNewDishItem = ({newDishItem}) => {
    const {dishTypes} = this.state
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

  onChangeIngredients = value => {
    this.setState({
      ingredientsDesc: value,
    })
  }

  loadData = async () => {
    const {isLoggedIn, getProfile} = this.context

    if (isLoggedIn) {
      const profile = await getProfile()

      this.setState({
        profile,
      })
    }
  }

  render() {
    const {navigation} = this.props
    const {
      isGalleryLoading,
      isDocLoading,
      cuisineTypes,
      dishTypes,
      cuisineItems,
      dishItems,
      experience,
      drivingLicenseNo,
      bookHours,
      description,
      price,
      bussinessFromTime,
      bussinessToTime,
      isFetching,
      isToTimePickerVisible,
      isFromTimePickerVisible,
      twitterUrl,
      facebookUrl,
      displaySelectedCuisineItems,
      displaySelectedDishItems,
      profile,
    } = this.state
    console.log('description', description)
    const {isChef, isLoggedIn} = this.context
    let status = ``
    if (isChef && isLoggedIn && profile) {
      status = profile.chefStatusId && profile.chefStatusId.trim()
    }
    let amount = ''
    if (price !== null && price !== undefined && price !== '') {
      amount = price.toString()
    }
    let cuisineTypesValue = []
    let cuisineItemsValue = []
    let dishTypesValue = []
    let dishItemsValue = []
    if (
      cuisineTypes &&
      cuisineTypes !== undefined &&
      cuisineTypes !== null &&
      cuisineTypes !== [] &&
      cuisineTypes.length !== 0
    ) {
      cuisineTypesValue = cuisineTypes
    }

    if (
      dishTypes &&
      dishTypes !== undefined &&
      dishTypes !== null &&
      dishTypes !== [] &&
      dishTypes.length !== 0
    ) {
      dishTypesValue = dishTypes
    }

    if (
      dishItems &&
      dishItems !== undefined &&
      dishItems !== null &&
      dishItems !== [] &&
      dishItems.length !== 0
    ) {
      dishItemsValue = dishItems
    }
    if (
      cuisineItems &&
      cuisineItems !== undefined &&
      cuisineItems !== null &&
      cuisineItems !== [] &&
      cuisineItems.length !== 0
    ) {
      cuisineItemsValue = cuisineItems
    }
    const displayBusinessFromTime =
      bussinessFromTime == null
        ? 'From Time'
        : moment(bussinessFromTime, 'hh:mm:ss A').format('hh:mm A')
    const displayBusinessToTime =
      bussinessToTime == null ? 'To Time' : moment(bussinessToTime, 'hh:mm:ss A').format('hh:mm A')

    return (
      <View style={Styles.container}>
        <Header showBack navigation={navigation} showTitle title="Chef Profile" />
        {isFetching ? (
          <View style={Styles.alignScreenCenter}>
            <Spinner mode="full" animating />
          </View>
        ) : (
          <KeyboardAwareScrollView style={Styles.viewStyle}>
            <Text style={Styles.body}>{Languages.chef_profile.chef_profile_lable.experience}</Text>
            <Item>
              <Icon
                style={{color: Theme.Colors.primary}}
                active
                name="chef-hat"
                type="MaterialCommunityIcons"
              />
              <Input
                placeholder="In years"
                keyboardType="number-pad"
                value={experience}
                onChangeText={value => this.onChangeExperience(value)}
              />
            </Item>
            <Content style={Styles.textAreaContent}>
              <Form>
                <Textarea
                  style={Styles.textAreaStyle}
                  rowSpan={5}
                  bordered
                  value={description}
                  onChangeText={value => this.onChangeDescription(value)}
                  placeholder="Description"
                />
              </Form>
            </Content>
            <Text style={Styles.body}>
              {Languages.chef_profile.chef_profile_lable.service_cost}
            </Text>
            <Item>
              <Icon
                style={{color: Theme.Colors.primary}}
                active
                name="currency-usd"
                type="MaterialCommunityIcons"
              />
              <Input
                placeholder="Price per hour"
                keyboardType="number-pad"
                value={amount}
                onChangeText={value => this.onChangePrice(value)}
              />
            </Item>
            <Text style={Styles.serviceCostText}>
              {Languages.chef_profile.chef_profile_lable.example_hours}
            </Text>

            <Text style={Styles.body}>
              {Languages.chef_profile.chef_profile_lable.customer_booking_hours}
            </Text>
            <Item>
              <Input
                placeholder="Hours"
                value={bookHours}
                keyboardType="number-pad"
                onChangeText={value => this.onChangeBookingHours(value)}
              />
            </Item>

            <Text style={Styles.body}>
              {Languages.chef_profile.chef_profile_lable.business_hours}
            </Text>
            <View style={Styles.timeView}>
              <Button iconLeft light onPress={() => this.showTimePicker('isFromTimePickerVisible')}>
                <Icon name="clock" style={{color: Theme.Colors.primary}} />
                <Text style={Styles.timeinputStyle}>{displayBusinessFromTime}</Text>
              </Button>
              <Button iconLeft light onPress={() => this.showTimePicker('isToTimePickerVisible')}>
                <Icon name="clock" style={{color: Theme.Colors.primary}} />
                <Text style={Styles.timeinputStyle}>{displayBusinessToTime}</Text>
              </Button>
            </View>
            <Button
              iconLeft
              onPress={() => this.goToSetAvailability()}
              style={Styles.checkAvailablity}>
              <Icon name="calendar" />
              <Text> {Languages.chefProfile.labels.set_availability}</Text>
              <Icon name="arrow-forward" />
            </Button>
            <Text style={Styles.body}>
              {Languages.chef_profile.chef_profile_lable.choose_specialization}
            </Text>
            <View style={Styles.formContainer}>
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
              <View style={Styles.cusineTagBody}>
                {displaySelectedCuisineItems && displaySelectedCuisineItems.length
                  ? displaySelectedCuisineItems.map((item, key) => {
                      return (
                        <Button key={key} iconRight rounded light style={Styles.chipItem}>
                          <Text style={Styles.locationText1}>{item.cusineTypeName}</Text>
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
            <View style={Styles.formContainer2}>
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
              <View style={Styles.cusineTagBody}>
                {displaySelectedDishItems && displaySelectedDishItems.length
                  ? displaySelectedDishItems.map((item, key) => {
                      return (
                        <Button key={key} iconRight rounded light style={Styles.chipItem}>
                          <Text style={Styles.locationText1}>{item.dishTypeName}</Text>
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
            <Text style={Styles.body}>{Languages.chef_profile.chef_profile_lable.license}</Text>
            <Item>
              <Input
                placeholder="Driving License number"
                value={drivingLicenseNo}
                onChangeText={value => this.onChangeLicenseNumber(value)}
              />
            </Item>
            <Text style={Styles.body}>
              {Languages.chef_profile.chef_profile_lable.social_media}
            </Text>
            <Item>
              <Icon
                active
                style={{color: '#3b5998'}}
                name="facebook"
                type="MaterialCommunityIcons"
              />
              <Input
                placeholder="Facebook URL"
                value={facebookUrl}
                onChangeText={value => this.onChangeFacebook(value)}
              />
            </Item>
            <Item>
              <Icon
                active
                style={{color: '#00acee'}}
                name="twitter"
                type="MaterialCommunityIcons"
              />
              <Input
                placeholder="Twitter URL"
                value={twitterUrl}
                onChangeText={value => this.onChangeTwitter(value)}
              />
            </Item>

            <Button style={Styles.locationBtn} onPress={() => this.onComplete()}>
              <Text style={Styles.locationText}>
                {Languages.chef_profile.chef_profile_lable.complete}
              </Text>
            </Button>
          </KeyboardAwareScrollView>
        )}

        <DateTimePicker
          isVisible={isFromTimePickerVisible}
          onConfirm={date => this.handleTimePicked(date, 'bussinessFromTime')}
          onCancel={() => this.hideTimePicker('isFromTimePickerVisible')}
          mode="time"
          is24Hour={false}
          date={new Date('8/3/2017 10:00 AM')}
        />
        <DateTimePicker
          isVisible={isToTimePickerVisible}
          onConfirm={date => this.handleTimePicked(date, 'bussinessToTime')}
          onCancel={() => this.hideTimePicker('isToTimePickerVisible')}
          mode="time"
          is24Hour={false}
          date={new Date('8/3/2017 8:00 PM')}
        />
      </View>
    )
  }
}

ChefSetupProfile.contextType = AuthContext
