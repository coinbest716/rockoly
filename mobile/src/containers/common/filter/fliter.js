/** @format */

import React, {Component} from 'react'
import {View, Text, Platform, TouchableOpacity, ScrollView} from 'react-native'
import {Container, Item, Input, CheckBox, ListItem, Body, Icon, Left, Button} from 'native-base'
import {Col, Grid, Row} from 'react-native-easy-grid'
import MultiSelect from 'react-native-multiple-select'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import _ from 'lodash'
import ChefListService, {CHEF_LIST_EVENT} from '../../../services/ChefListService'
import ChefProfileService, {PROFILE_DETAIL_EVENT} from '../../../services/ChefProfileService'
import {Header, CommonButton} from '@components'
import {RouteNames} from '@navigation'
import {Languages} from '@translations'
import {Theme} from '@theme'
import styles from './styles'

class Filter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minPrice: '',
      maxPrice: '',
      tabIndex: 0,
      cuisineItems: [],
      dishItems: [],
      ratingMaxValue: 0,
      cuisineFilterOptionValue: '',
      dishFilterOptionValue: '',
      dishTypes: [],
      cuisineTypes: [],
      latitude: '',
      longitude: '',
      experience: 0,
      errorMessage: '',
      rating: [
        {
          title: '5',
          checked: false,
          value: 5,
        },
        {
          title: '4',
          checked: false,
          value: 4,
        },
        {
          title: '3',
          checked: false,
          value: 3,
        },
        {
          title: '2',
          checked: false,
          value: 2,
        },
        {
          title: '1',
          checked: false,
          value: 1,
        },
      ],
    }
  }

  componentDidMount() {
    const {navigation, filterScreenValues, latitude, longitude} = this.props
    if (filterScreenValues && Object.keys(filterScreenValues).length !== 0) {
      const value = filterScreenValues
      this.setState({
        cuisineFilterOptionValue: value.filterListValue.cuisineFilterOptionValue,
        cuisineItems: value.filterListValue.cuisineItems,
        dishFilterOptionValue: value.filterListValue.dishFilterOptionValue,
        dishItems: value.filterListValue.dishItems,
        minPrice: value.filterListValue.minPrice,
        maxPrice: value.filterListValue.maxPrice,
        ratingMaxValue: value.filterListValue.ratingMaxValue,
        rating: value.filterListValue.rating,
        tabIndex: value.filterListValue.tabIndex,
        dishTypes: value.filterListValue.dishTypes,
        cuisineTypes: value.filterListValue.cuisineTypes,
        experience: value.filterListValue.experience,
      })
    }

    if (latitude && longitude) {
      this.setState({
        latitude,
        longitude,
      })
    }
    this.onCuisineTypes()
    this.onDishTypes()
  }

  handleClickTab = tabIndex => {
    this.setState({tabIndex})
  }

  setList = ({filterListValue}) => {
    // console.log('values', filterListValue)
  }

  onCuisineTypes = async () => {
    ChefProfileService.on(PROFILE_DETAIL_EVENT.CUISINETYPES, this.cuisineList)
    ChefProfileService.getCuisineTypesData()
  }

  onDishTypes = async () => {
    ChefProfileService.on(PROFILE_DETAIL_EVENT.DISHTYPES, this.dishesList)
    ChefProfileService.getDishTypesData()
  }

  cuisineList = ({cuisineTypesData}) => {
    if (cuisineTypesData.hasOwnProperty('allCuisineTypeMasters')) {
      const val = cuisineTypesData.allCuisineTypeMasters
      if (val && val.nodes !== [] && val.nodes !== undefined && val.nodes !== null) {
        this.setState(
          {
            cuisineTypes: val.nodes,
          },
          () => {}
        )
      }
    }
  }

  dishesList = ({dishTypesData}) => {
    if (dishTypesData.hasOwnProperty('allDishTypeMasters')) {
      const val = dishTypesData.allDishTypeMasters
      if (val && val.nodes !== [] && val.nodes !== undefined && val.nodes !== null) {
        this.setState(
          {
            dishTypes: val.nodes,
          },
          () => {}
        )
      }
    }
  }

  onChangeMinPrice = value => {
    this.setState({
      minPrice: value,
    })
  }

  onChangeMaxPrice = value => {
    this.setState({
      maxPrice: value,
    })
  }

  onChangeExperience = value => {
    this.setState({
      experience: value,
    })
  }

  onGiveRating = (index, checked, item) => {
    const {rating} = this.state
    const temp = rating

    if (temp[index]) {
      temp[index].checked = !checked
    }
    this.setState(
      {
        rating: temp,
      },
      async () => {
        const val = []
        let value = 0
        await rating.map((itemVal, key) => {
          if (itemVal.checked === true) {
            val.push(itemVal)
          }
        })

        if (val.length > 0) {
          value = Math.max.apply(
            Math,
            val.map(function(o) {
              return o.value
            })
          )
        }

        this.setState({
          ratingMaxValue: value,
        })
      }
    )
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
      this.updateCuisineFilter(cuisineItem)
    })
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

    this.setState(
      {
        cuisineItems: newSelectedIds,
        displaySelectedCuisineItems: newDisplaySelectedCuisineItems,
      },
      () => {
        this.updateCuisineFilter(newSelectedIds)
      }
    )
  }

  updateCuisineFilter = cuisineItem => {
    const cuisineOptionsArray = []
    let cuisineValue = ''
    cuisineOptionsArray.push(cuisineItem)
    // After adding the cuisineItems Need to loop and concatenate
    cuisineOptionsArray.map(cuisineOption => {
      if (cuisineOption) {
        cuisineOption.map((cuisine, index) => {
          if (index === 0) {
            cuisineValue = cuisine.trim()
          } else {
            cuisineValue = `${cuisineValue},${cuisine.trim()}`
          }
        })
      }
    })
    cuisineValue = `{${cuisineValue}}`
    this.setState({
      cuisineFilterOptionValue: cuisineValue,
    })
  }

  onSelectedDishItemsChange = dishItem => {
    const {dishTypes} = this.state
    let displaySelectedDishItems = []
    displaySelectedDishItems = _.filter(dishTypes, item => {
      if (dishItem.indexOf(item.dishTypeId) !== -1) {
        return true
      }
    })

    this.setState({dishItems: dishItem, displaySelectedDishItems}, () => {
      this.updateDishFilter(dishItem)
    })
  }

  updateDishFilter = dishItem => {
    const dishOptionsArray = []
    let dishValue = ''
    dishOptionsArray.push(dishItem)
    // After adding the cuisineItems Need to loop and concatenate
    dishOptionsArray.map(dishOption => {
      if (dishOption) {
        dishOption.map((dish, index) => {
          if (index === 0) {
            dishValue = dish.trim()
          } else {
            dishValue = `${dishValue},${dish.trim()}`
          }
        })
      }
    })
    dishValue = `{${dishValue}}`
    this.setState({
      dishFilterOptionValue: dishValue,
    })
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

    this.setState(
      {
        dishItems: newSelectedIds,
        displaySelectedDishItems: newDisplaySelectedDishItems,
      },
      () => {
        this.updateDishFilter(newSelectedIds)
      }
    )
  }

  onCancel = () => {
    const {onFilterComplete} = this.props
    // navigation.goBack()
    if (onFilterComplete) {
      onFilterComplete()
    }
  }

  onApply = async () => {
    const {minPrice, maxPrice} = this.state
    if (minPrice !== '' && maxPrice !== '') {
      if (parseInt(minPrice) < parseInt(maxPrice)) {
        this.onComplete()
      } else {
        this.setState({
          errorMessage: 'Min Price should be greater than Max Price',
        })
      }
    } else {
      this.onComplete()
    }
  }

  onComplete = () => {
    const {onFilterComplete} = this.props
    const {
      dishFilterOptionValue,
      cuisineFilterOptionValue,
      cuisineItems,
      dishItems,
      minPrice,
      maxPrice,
      ratingMaxValue,
      rating,
      tabIndex,
      dishTypes,
      cuisineTypes,
      longitude,
      latitude,
      experience,
      errorMessage,
    } = this.state

    const filterOption = this.checkFilters()

    const obj = {
      cuisineFilterOptionValue,
      cuisineItems,
      dishFilterOptionValue,
      dishItems,
      minPrice,
      maxPrice,
      ratingMaxValue,
      filterOption,
      rating,
      tabIndex,
      dishTypes,
      cuisineTypes,
      longitude,
      latitude,
      experience,
      errorMessage,
    }
    ChefListService.on(CHEF_LIST_EVENT.FILTER_LIST, this.setList)
    ChefListService.filterList(obj)

    if (onFilterComplete) {
      onFilterComplete()
    }
  }

  onClearFilter = () => {
    // const {close, onComplete} = this.props
    const {onFilterComplete} = this.props
    this.setState(
      {
        minPrice: '',
        maxPrice: '',
        tabIndex: 0,
        cuisineItems: [],
        dishItems: [],
        ratingMaxValue: 0,
        cuisineFilterOptionValue: '',
        dishFilterOptionValue: '',
        dishTypes: [],
        cuisineTypes: [],
        experience: 0,
        errorMessage: '',
        rating: [
          {
            title: '5',
            checked: false,
            value: 5,
          },
          {
            title: '4',
            checked: false,
            value: 4,
          },
          {
            title: '3',
            checked: false,
            value: 3,
          },
          {
            title: '2',
            checked: false,
            value: 2,
          },
          {
            title: '1',
            checked: false,
            value: 1,
          },
        ],
      },
      () => {
        // const filterOption = JSON.stringify({})
        // console.log('onClearFilter', filterOption)
        // const filter = JSON.stringify(filterOption)
        // console.log('onClearFilter1111', filter)

        const {
          dishFilterOptionValue,
          cuisineFilterOptionValue,
          cuisineItems,
          dishItems,
          minPrice,
          maxPrice,
          ratingMaxValue,
          rating,
          tabIndex,
          dishTypes,
          cuisineTypes,
          longitude,
          latitude,
          experience,
          errorMessage,
        } = this.state

        const filterOption = this.checkFilters()

        const obj = {
          cuisineFilterOptionValue,
          cuisineItems,
          dishFilterOptionValue,
          dishItems,
          minPrice,
          maxPrice,
          ratingMaxValue,
          filterOption,
          rating,
          tabIndex,
          dishTypes,
          cuisineTypes,
          longitude,
          latitude,
          experience,
          errorMessage,
        }

        ChefListService.on(CHEF_LIST_EVENT.FILTER_LIST, this.setList)
        ChefListService.filterList(obj)

        if (onFilterComplete) {
          onFilterComplete()
        }
      }

      // navigation.goBack()
    )
  }

  checkFilters = () => {
    const {
      minPrice,
      maxPrice,
      ratingMaxValue,
      dishFilterOptionValue,
      cuisineFilterOptionValue,
      latitude,
      longitude,
      experience,
    } = this.state
    let rangeObj = {}
    // const cuisineObj = {}

    if (
      cuisineFilterOptionValue !== '' ||
      dishFilterOptionValue !== '' ||
      (minPrice !== '' && maxPrice !== '') ||
      ratingMaxValue !== 0 ||
      (latitude !== '' && longitude !== '') ||
      experience !== 0
    ) {
      rangeObj = {
        min_rating: ratingMaxValue !== 0 ? ratingMaxValue : undefined,
        min_price: minPrice !== '' ? minPrice : undefined,
        max_price: maxPrice !== '' ? maxPrice : undefined,
        cuisine: cuisineFilterOptionValue !== '' ? cuisineFilterOptionValue : undefined,
        dish: dishFilterOptionValue !== '' ? dishFilterOptionValue : undefined,
        lat: latitude !== '' ? latitude : undefined,
        lng: longitude !== '' ? longitude : undefined,
        experience: experience !== 0 ? experience : undefined,
      }
      // rangeObj = JSON.stringify(rangeObj)
      // rangeObj = JSON.stringify(rangeObj)
      return rangeObj
    }
    return {}
  }

  render() {
    const {
      cuisineTypes,
      dishTypes,
      displaySelectedDishItems,
      displaySelectedCuisineItems,
    } = this.state
    const {
      tabIndex,
      minPrice,
      maxPrice,
      rating,
      ratingMaxValue,
      dishItems,
      cuisineItems,
      experience,
      errorMessage,
    } = this.state
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

    console.log('rating', rating)
    return (
      <View style={{flex: 1}}>
        <Grid>
          <Row style={[{height: '10%'}, styles.clearFilter]}>
            <Button transparent onPress={() => this.onClearFilter()}>
              <Text style={styles.clearText}>{Languages.filter.labels.clear_filter}</Text>
            </Button>
          </Row>
          <Row style={{height: '80%'}}>
            <Col style={styles.leftSideView} size={30}>
              <TouchableOpacity
                style={[
                  styles.labelView,
                  {backgroundColor: tabIndex === 0 ? Theme.Colors.primary : Theme.Colors.white},
                ]}
                onPress={() => this.handleClickTab(0)}>
                <Text style={{fontSize: 14}}>{Languages.filter.labels.price}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.labelView,
                  {backgroundColor: tabIndex === 1 ? Theme.Colors.primary : Theme.Colors.white},
                ]}
                onPress={() => this.handleClickTab(1)}>
                <Text style={{fontSize: 14}}>{Languages.filter.labels.rating}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.labelView,
                  {backgroundColor: tabIndex === 2 ? Theme.Colors.primary : Theme.Colors.white},
                ]}
                onPress={() => this.handleClickTab(2)}>
                <Text style={{fontSize: 14}}>{Languages.filter.labels.dish_type}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.labelView,
                  {backgroundColor: tabIndex === 3 ? Theme.Colors.primary : Theme.Colors.white},
                ]}
                onPress={() => this.handleClickTab(3)}>
                <Text style={{fontSize: 14}}>{Languages.filter.labels.cuisine_type}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.labelView,
                  {backgroundColor: tabIndex === 4 ? Theme.Colors.primary : Theme.Colors.white},
                ]}
                onPress={() => this.handleClickTab(4)}>
                <Text style={{fontSize: 14}}>{Languages.filter.labels.experience}</Text>
              </TouchableOpacity>
            </Col>
            <Col style={styles.rightSideView} size={70}>
              {tabIndex === 0 && (
                <View style={{marginLeft: 5}}>
                  <Item>
                    <Input
                      placeholder={Languages.filter.labels.min_price}
                      onChangeText={this.onChangeMinPrice}
                      value={minPrice}
                      keyboardType="number-pad"
                    />
                  </Item>
                  <Item>
                    <Input
                      placeholder={Languages.filter.labels.max_price}
                      onChangeText={this.onChangeMaxPrice}
                      value={maxPrice}
                      keyboardType="number-pad"
                    />
                  </Item>
                </View>
              )}
              {tabIndex === 1 && (
                <View>
                  {rating &&
                    rating.map((item, index) => {
                      return (
                        <ListItem>
                          <CheckBox
                            checked={item.checked}
                            onPress={() => this.onGiveRating(index, item.checked, item)}
                          />
                          <Body style={{marginLeft: 5}}>
                            <Text>
                              {item.title}
                              <Icon
                                name="star"
                                type="MaterialCommunityIcons"
                                style={{fontSize: 12}}
                              />{' '}
                              {Languages.filter.labels.above}
                            </Text>
                          </Body>
                        </ListItem>
                      )
                    })}
                </View>
              )}
              {tabIndex === 2 && (
                <ScrollView style={{marginVertical: 10, flex: 1}}>
                  <MultiSelect
                    hideTags
                    items={dishTypesValue}
                    uniqueKey="dishTypeId"
                    ref={component => {
                      this.dishSelect = component
                    }}
                    onSelectedItemsChange={this.onSelectedDishItemsChange}
                    selectedItems={dishItemsValue}
                    selectText={Languages.filter.labels.select_dish}
                    searchInputPlaceholderText={Languages.filter.labels.search}
                    onChangeInput={text => console.log(text)}
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="dishTypeDesc"
                    searchInputStyle={{color: '#CCC'}}
                    // submitButtonColor="#CCC"
                    // submitButtonText="Submit"
                    hideSubmitButton
                    hideDropdown
                  />
                  <View style={styles.cusineTagBody}>
                    {displaySelectedDishItems && displaySelectedDishItems.length
                      ? displaySelectedDishItems.map((item, key) => {
                          return (
                            <Button key={key} iconRight rounded light style={styles.chipItem}>
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
                </ScrollView>
              )}
              {tabIndex === 3 && (
                <ScrollView style={{marginVertical: 10, flex: 1}}>
                  <MultiSelect
                    hideTags
                    items={cuisineTypesValue}
                    uniqueKey="cuisineTypeId"
                    ref={component => {
                      this.cuisineSelect = component
                    }}
                    onSelectedItemsChange={this.onSelectedCuisineItemsChange}
                    selectedItems={cuisineItemsValue}
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
                    // submitButtonColor="#CCC"
                    // submitButtonText="Submit"
                    hideSubmitButton
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
                </ScrollView>
              )}
              {tabIndex === 4 && (
                <View style={{marginLeft: 5}}>
                  <Item>
                    <Input
                      placeholder={Languages.filter.labels.experience}
                      onChangeText={this.onChangeExperience}
                      value={experience}
                      keyboardType="number-pad"
                    />
                  </Item>
                </View>
              )}
            </Col>
          </Row>
          {errorMessage !== '' ? (
            <Row style={styles.errView}>
              <View style={styles.errView}>
                <Text style={styles.errMsgTextStyle}>{errorMessage}</Text>
              </View>
            </Row>
          ) : null}
          <Row style={{height: '10%'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <CommonButton
                containerStyle={styles.cancelBtnView}
                btnText={Languages.chefList.cancel}
                onPress={this.onCancel}
              />
              <CommonButton
                containerStyle={styles.applyBtnView}
                btnText={Languages.chefList.apply}
                onPress={this.onApply}
              />
            </View>
          </Row>
        </Grid>
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
    )
  }
}

export default Filter
