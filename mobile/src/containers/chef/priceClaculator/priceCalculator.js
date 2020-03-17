/** @format */

import React, {Component} from 'react'
import {View, ScrollView, Platform, Alert} from 'react-native'
import {
  Item,
  Textarea,
  Text,
  CheckBox,
  ListItem,
  Body,
  Icon,
  Button,
  Label,
  Toast,
  Card,
  Picker,
  CardItem,
} from 'native-base'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import Slider from '@react-native-community/slider'
import _ from 'lodash'
import {CommonButton, Spinner, Header} from '@components'
import {Theme} from '@theme'
import {
  AuthContext,
  ProfileViewService,
  PROFILE_VIEW_EVENT,
  PriceCalculationService,
  PRICE_EVENT,
  BookingDetailService,
  SettingsService,
  BOOKING_DETAIL_EVENT,
  BookingHistoryService,
} from '@services'
import {LocalToGMT} from '@utils'
import {Languages} from '@translations'
import styles from './styles'
import {RouteNames} from '@navigation'

export default class priceCalculation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      chefDetail: {},
      guestMin: 0,
      guestMax: 0,
      stripeCents: 0,
      stripePercentage: 0,
      guestCount: 0,
      foodCostMin: 1,
      foodCostMax: 500,
      complexity: [],
      foodCost: 1,
      additionalServices: [],
      bookingData: {},
      complexitySelected: '',
      additionalPrice: [],
      shopName: undefined,
      otherShopName: '',
      additionalServiceData: [],
      storeData: [],
      storeTypeIdValue: [],
      bookingDetail: {},
      chefProfile: {},
      additionalServiceValues: [],
      invalidGuest: false,
      invalidComplexity: false,
    }
  }

  async componentDidMount() {
    const {navigation} = this.props
    ProfileViewService.on(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
    PriceCalculationService.on(PRICE_EVENT.STORE, this.getStoreList)
    this.onLoadData()
    this.loadStoreData()
  }

  componentWillUnmount() {
    ProfileViewService.off(PROFILE_VIEW_EVENT.PROFILE_VIEW, this.setList)
    PriceCalculationService.off(PRICE_EVENT.STORE, this.getStoreList)
  }

  onLoadData = () => {
    const {currentUser} = this.context
    console.log('currentUser', currentUser)
    SettingsService.getStripeCents()
      .then(res => {
        console.log('res', res)
        this.setState({
          stripeCents: res / 100,
        })
      })
      .catch(e => {
        console.log('debgging e', e)
      })

    SettingsService.getStripePercentage()
      .then(res => {
        console.log('getStripePercentage', res)
        this.setState({
          stripePercentage: res,
        })
      })
      .catch(e => {
        console.log('getStripePercentagedebgging e', e)
      })
    this.setState(
      {
        isLoading: true,
      },
      () => {
        ProfileViewService.getProfileDetails(currentUser.chefId)
      }
    )
  }

  loadBookingData = () => {
    const {bookingData} = this.state
    console.log('bookingData', bookingData)
    if (bookingData && bookingData.bookingHistId) {
      BookingDetailService.getBookingDetail(bookingData.bookingHistId)
    }
  }

  loadStoreData = () => {
    PriceCalculationService.getStoreData()
  }

  getStoreList = ({storeData}) => {
    console.log('storeData', storeData)
    this.setState(
      {
        storeData,
      },
      () => {}
    )
  }

  setList = ({profileDetails}) => {
    this.setState({
      isLoading: false,
    })
    console.log('profileDetails', profileDetails)
    if (profileDetails) {
      if (
        profileDetails.chefProfileByChefId &&
        profileDetails.chefProfileByChefId.chefProfileExtendedsByChefId &&
        profileDetails.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]
      ) {
        const chefData = profileDetails.chefProfileByChefId.chefProfileExtendedsByChefId.nodes[0]

        this.setState(
          {
            chefDetail: chefData,
            guestCount: chefData.noOfGuestsMin,
            guestMin: chefData.noOfGuestsMin ? chefData.noOfGuestsMin : 0,
            // guestCount: chefData.noOfGuestsMin ? chefData.noOfGuestsMin : 0,
            guestMax: chefData.noOfGuestsMax ? chefData.noOfGuestsMax : 0,
            complexity: chefData.chefComplexity ? JSON.parse(chefData.chefComplexity) : null,
            additionalServices: chefData.additionalServiceDetails
              ? JSON.parse(chefData.additionalServiceDetails)
              : null,
            // originalAdditionalServices: chefData.additionalServiceDetails
            //   ? JSON.parse(chefData.additionalServiceDetails)
            //   : null,
          },
          () => {
            // this.loadComplexity()
            this.loadAdditionalServices()
          }
        )
      }
    }
  }

  // loadComplexity = () => {
  //   const {complexity} = this.state
  //   const temp = []
  //   complexity.map((item, index) => {
  //     const val = {
  //       complexcityLevel: item.complexcityLevel,
  //       dishes: item.dishes,
  //       noOfItems: {
  //         min: item.noOfItems.min,
  //         max: item.noOfItems.max,
  //       },
  //       checked: false,
  //     }
  //     temp.push(val)
  //   })
  //   this.setState(
  //     {
  //       complexity: temp,
  //     },
  //     () => {}
  //   )
  // }

  loadAdditionalServices = () => {
    const {additionalServices, bookingDetail} = this.state
    const temp = []
    if (additionalServices) {
      additionalServices.map((item, index) => {
        const value = parseFloat(item.price)
        const priceVal = value.toFixed(2)
        const val = {
          id: item.id,
          price: priceVal,
          checked: false,
          name: item.name,
          desc: item.desc,
        }
        temp.push(val)
      })
      this.setState(
        {
          additionalServices: temp,
        },
        () => {
          if (bookingDetail && bookingDetail.additionalServiceDetails) {
            this.loadServices()
          }
        }
      )
    }
  }

  loadServices = () => {
    const {bookingDetail, additionalServices} = this.state

    const additionalServicesType = additionalServices

    const temp = []

    additionalServicesType.map((res, index) => {
      const obj = {
        id: res.id,
        price: res.price,
        checked:
          bookingDetail && bookingDetail.additionalServiceDetails
            ? !JSON.parse(bookingDetail.additionalServiceDetails).every(item => item.id !== res.id)
            : false,
        name: res.name,
        desc: res.desc,
        disabled:
          bookingDetail && bookingDetail.additionalServiceDetails
            ? !JSON.parse(bookingDetail.additionalServiceDetails).every(item => item.id !== res.id)
            : false,
      }
      temp.push(obj)
    })

    this.setState(
      {
        additionalServices: temp,
      },
      async () => {
        console.log('additionalServices', additionalServices, temp)
        this.checkAdditionalValues()
      }
    )
  }

  checkAdditionalValues = async () => {
    const {additionalServices} = this.state
    const val = []
    const additionalServiceValues = []

    await additionalServices.map((itemVal, index) => {
      console.log('itemVal', itemVal)
      if (itemVal.checked === true) {
        const value = parseFloat(itemVal.price)
        const priceVal = value.toFixed(2)
        val.push(parseFloat(priceVal))

        const additionalData = {
          id: itemVal.id,
          price: itemVal.price,
          checked: itemVal.checked,
          name: itemVal.name,
          desc: itemVal.desc,
        }
        additionalServiceValues.push(additionalData)
      }
    })
    this.setState(
      {
        additionalPrice: val,
        additionalServiceValues,
      },
      () => {}
    )
  }

  // onChecked = (index, checked) => {
  //   console.log('onChecked', index, checked)
  //   const {complexity} = this.state
  //   const temp = complexity

  //   if (temp[index]) {
  //     temp[index].checked = !checked
  //   }

  //   this.setState(
  //     {
  //       complexity: temp,
  //     },
  //     async () => {
  //       console.log('complexity', complexity)
  //     }
  //   )
  // }

  onServiceChecked = (index, checked) => {
    console.log('onServiceChecked', index, checked)
    const {additionalServices} = this.state
    const temp = additionalServices

    if (temp[index]) {
      temp[index].checked = !checked
    }

    this.setState(
      {
        additionalServices: temp,
      },
      async () => {
        const val = []
        const services = []
        const additionalServiceValues = []
        await additionalServices.map((itemVal, index) => {
          if (itemVal.checked === true) {
            const value = parseFloat(itemVal.price)
            const priceVal = value.toFixed(2)
            const obj = {
              service: itemVal.id,
              price: parseFloat(priceVal),
            }
            const additionalData = {
              id: itemVal.id,
              price: itemVal.price,
              checked: itemVal.checked,
              name: itemVal.name,
              desc: itemVal.desc,
            }
            additionalServiceValues.push(additionalData)
            services.push(obj)
            val.push(parseFloat(priceVal))
          }
        })
        this.setState(
          {
            additionalPrice: val,
            additionalServiceData: services,
            additionalServiceValues,
          },
          () => {}
        )
      }
    )
  }

  onSelected = complexcityLevel => {
    this.setState(
      {
        complexitySelected: complexcityLevel,
      },
      () => {
        this.checkComplexity()
      }
    )
  }

  checkComplexity = () => {
    const {complexitySelected, originalComplexity} = this.state
    let selectedValue
    let originalSelectedvalue

    if (originalComplexity && complexitySelected) {
      if (complexitySelected === '1X') {
        selectedValue = 1
      } else if (complexitySelected === '1.5X') {
        selectedValue = 1.5
      } else if (complexitySelected === '2X') {
        selectedValue = 2
      }

      if (originalComplexity === '1X') {
        originalSelectedvalue = 1
      } else if (originalComplexity === '1.5X') {
        originalSelectedvalue = 1.5
      } else if (originalComplexity === '2X') {
        originalSelectedvalue = 2
      }
      console.log('complexitySelected', selectedValue, originalSelectedvalue)
      if (selectedValue && originalSelectedvalue) {
        if (selectedValue >= originalSelectedvalue) {
          this.setState({
            invalidComplexity: false,
          })
        } else {
          this.setState({
            invalidComplexity: true,
          })
        }
      }
    }
  }

  onChangeShop = value => {
    const {storeData} = this.state
    this.setState(
      {
        shopName: value,
      },
      () => {
        const storeId = []
        storeData.map((item, key) => {
          if (item.storeTypeId.trim() === value.trim()) {
            storeId.push(value)
          }
        })
        this.setState({
          storeTypeIdValue: storeId,
        })
      }
    )
  }

  onChangeOtherShop = value => {
    this.setState({
      otherShopName: value,
    })
  }

  getTotalPrice = (selectedValue, chefPrice, guestCount, additionalPrice) => {
    console.log('getTotalPrice', selectedValue, chefPrice, guestCount, additionalPrice)
    let chefTotalCharge = 0
    if (guestCount > 5) {
      chefTotalCharge += chefPrice * 5
      chefTotalCharge += (guestCount - 5) * (chefPrice / 2)
      chefTotalCharge *= selectedValue
      chefTotalCharge += _.sum(additionalPrice)
      return chefTotalCharge
    }
    if (guestCount <= 5) {
      chefTotalCharge = chefPrice * guestCount * selectedValue + _.sum(additionalPrice)
      return chefTotalCharge
    }
  }

  onChangeGuestCount = value => {
    this.setState({
      guestCount: value,
    })
  }

  radioButton = props => {
    return (
      <View
        style={[
          {
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: props.selected ? props.selectedColor : Theme.Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          },
          props.style,
        ]}>
        {props.selected ? (
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: props.selected ? props.selectedColor : Theme.Colors.primary,
            }}
          />
        ) : null}
      </View>
    )
  }

  render() {
    const {
      isLoading,
      chefDetail,
      guestMin,
      guestMax,
      guestCount,
      complexity,
      foodCostMax,
      foodCostMin,
      foodCost,
      additionalServices,
      shopName,
      otherShopName,
      storeData,
      bookingDetail,
      bookingData,
      additionalServiceValues,
      additionalPrice,
      complexitySelected,
      originalAdditionalServices,
      stripeCents,
      stripePercentage,
      additionalServiceData,
      originalNoOfGuest,
      originalComplexity,
      invalidGuest,
      invalidComplexity,
      hideRequestBtn,
    } = this.state
    console.log('chefDetail', stripeCents, stripePercentage)
    console.log('bookingDetail', bookingDetail)
    let chefPrice
    let chefCharge
    let rockolyCharge
    let stripePercentagevalue
    let discount
    let guestPrice
    let totalPay
    let totalAmount = 0
    let chefCharge2 = 0
    let complexityUpcharge = 0
    let additionalTotalPrice = 0
    let selectedValue
    let newService = []
    let newAdditionalPrice = []
    let originalSelectedvalue
    let newComplexity
    let newGuest
    let newAdditionalTotalPrice = 0
    let chefTotal = 0
    const newPrice = 0

    if (chefDetail.chefPricePerHour) {
      chefPrice = chefDetail.chefPricePerHour
    }
    if (guestCount) {
      discount = (guestCount - 5) * (chefPrice / 2)
    }

    if (chefDetail.chefPricePerHour && guestCount) {
      chefCharge = chefDetail.chefPricePerHour * guestCount
    }

    if (chefCharge && discount) {
      chefCharge2 = chefCharge - discount
    }

    if (additionalPrice) {
      additionalTotalPrice = _.sum(additionalPrice)
    }

    if (guestCount && originalNoOfGuest && guestCount >= originalNoOfGuest) {
      newGuest = guestCount - originalNoOfGuest
    } else {
      newGuest = 0
    }

    if (
      originalAdditionalServices &&
      originalAdditionalServices.length &&
      additionalServiceValues &&
      additionalServiceValues.length
    ) {
      additionalServiceValues.map(item => {
        const findItem = _.find(originalAdditionalServices, org => {
          console.log('org', org)
          return org.id === item.id
        })
        if (!findItem) {
          const value = parseFloat(item.price)
          const priceVal = value.toFixed(2)
          newService.push(item)
          newAdditionalPrice.push(parseFloat(priceVal))
        }
      })
    } else {
      newService =
        additionalServiceValues && additionalServiceValues.length > 0
          ? additionalServiceValues
          : null
      newAdditionalPrice = additionalPrice
    }

    console.log('newAdditionalPrice', newAdditionalPrice, newAdditionalTotalPrice)

    if (newAdditionalPrice) {
      newAdditionalTotalPrice = _.sum(newAdditionalPrice)
    }

    if (complexitySelected === '1X') {
      selectedValue = 1
    } else if (complexitySelected === '1.5X') {
      selectedValue = 1.5
    } else if (complexitySelected === '2X') {
      selectedValue = 2
    }

    if (originalComplexity === '1X') {
      originalSelectedvalue = 1
    } else if (originalComplexity === '1.5X') {
      originalSelectedvalue = 1.5
    } else if (originalComplexity === '2X') {
      originalSelectedvalue = 2
    }

    if (selectedValue && chefCharge && guestCount) {
      if (guestCount <= 5) {
        complexityUpcharge = chefCharge * selectedValue - chefCharge
      } else if (guestCount > 5) {
        complexityUpcharge = chefCharge2 * selectedValue - chefCharge2
      }
    }
    if (selectedValue && originalSelectedvalue && selectedValue > originalSelectedvalue) {
      newComplexity = selectedValue
    } else {
      newComplexity = originalSelectedvalue
    }

    if (guestCount <= 5) {
      if (chefCharge && complexityUpcharge && newAdditionalTotalPrice) {
        totalAmount = chefCharge + complexityUpcharge + newAdditionalTotalPrice
      } else if (chefCharge && complexityUpcharge) {
        totalAmount = chefCharge + complexityUpcharge
      } else if (chefCharge && newAdditionalTotalPrice) {
        totalAmount = chefCharge + newAdditionalTotalPrice
      } else if (chefCharge) {
        totalAmount = chefCharge
      }
    } else if (guestCount > 5) {
      if (chefCharge2 && complexityUpcharge && newAdditionalTotalPrice) {
        totalAmount = chefCharge2 + complexityUpcharge + newAdditionalTotalPrice
      } else if (chefCharge2 && complexityUpcharge) {
        totalAmount = chefCharge2 + complexityUpcharge
      } else if (chefCharge2 && newAdditionalTotalPrice) {
        totalAmount = chefCharge2 + newAdditionalTotalPrice
      } else if (chefCharge2) {
        totalAmount = chefCharge2
      }
    }
    if (chefPrice) {
      guestPrice = chefPrice / 2
    }
    if (stripePercentage && totalAmount) {
      stripePercentagevalue = (stripePercentage * totalAmount) / 100
    }
    if (stripePercentagevalue && stripeCents) {
      rockolyCharge = stripeCents + stripePercentagevalue
    }
    if (totalAmount && rockolyCharge) {
      totalPay = totalAmount - rockolyCharge
    }

    const commissionCost = 0

    const totalPrice = newPrice + commissionCost

    const newTotalPrice = totalPrice.toFixed(2)

    if (commissionCost && newTotalPrice) {
      chefTotal = newTotalPrice - commissionCost
    }

    if (isLoading) {
      return <Spinner mode="full" />
    }
    return (
      <View style={{flex: 1}}>
        <Header showBack title={Languages.book.labels.pricing_calculator} showBell={false} />
        <ScrollView style={{marginHorizontal: '2.5%', paddingBottom: '10%'}}>
          <View
            style={{
              marginVertical: 15,
              marginHorizontal: 10,
              flexDirection: 'column',
            }}>
            <Text style={{color: 'black'}}>Chef Base Rate</Text>
            <Text style={{marginTop: 10}}>${chefPrice}</Text>
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              marginVertical: 5,
              marginHorizontal: 5,
              justifyContent: 'space-between',
            }}>
            <Label>Gratuity</Label>
            <Text>{gratuity} %</Text>
          </View> */}
          <View
            style={{
              marginVertical: 15,
              marginHorizontal: 10,
            }}>
            <Text style={{color: 'black'}}>Number of Guests</Text>
            <Slider
              style={{width: 'auto', marginTop: 10}}
              step={1}
              minimumValue={guestMin}
              maximumValue={guestMax}
              value={guestCount}
              onValueChange={val => this.onChangeGuestCount(val)}
              maximumTrackTintColor="#000000"
              minimumTrackTintColor={Theme.Colors.primary}
            />
            <View style={styles.textCon}>
              <Text>{guestMin}</Text>
              <Text>{guestCount || guestMin}</Text>
              <Text>{guestMax} </Text>
            </View>
          </View>

          <Card style={styles.cardStyle}>
            <CardItem header bordered>
              <Text style={{color: 'black'}}>Select Complexity</Text>
            </CardItem>
            {complexity &&
              complexity.length > 0 &&
              complexity.map((item, index) => {
                return (
                  <CardItem bordered={complexity.length !== index + 1}>
                    <Body>
                      <View style={{display: 'flex', flexDirection: 'column'}}>
                        {/* <ListItem style={{borderBottomWidth: 0}}>
                      <CheckBox
                        checked={item.checked}
                        onPress={() => this.onChecked(index, item.checked)}
                        color={Theme.Colors.primary}
                      />
                      <Body>
                        <Text>{item.complexcityLevel}</Text>
                      </Body>
                    </ListItem> */}
                        <View>
                          <ListItem
                            style={{borderBottomWidth: 0}}
                            key={index}
                            onPress={() => this.onSelected(item.complexcityLevel)}>
                            {this.radioButton({
                              selected: item.complexcityLevel === this.state.complexitySelected,
                              selectedColor: Theme.Colors.primary,
                            })}
                            <Text style={styles.complexityText}>
                              Select {item.complexcityLevel}
                            </Text>
                          </ListItem>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                          <Text style={styles.label}>
                            Desired Dishes : <Text style={{fontSize: 14}}>{item.dishes}</Text>
                          </Text>
                          <Text style={styles.label}>
                            Between <Text style={{fontSize: 14}}>{item.noOfItems.min}</Text>
                            <Text style={{fontSize: 14}}> - </Text>
                            <Text style={{fontSize: 14}}>{item.noOfItems.max}</Text> Menu Items
                          </Text>
                        </View>
                      </View>
                    </Body>
                  </CardItem>
                )
              })}
          </Card>
          {invalidComplexity === true && (
            <Text
              style={{
                textAlign: 'center',
                color: Theme.Colors.error,
                fontSize: 14,
                marginTop: 10,
                marginHorizontal: 3,
              }}>
              Complexity should be greater than booking complexity
            </Text>
          )}
          <Card style={styles.cardStyle}>
            <CardItem header bordered>
              <Text style={{color: 'black'}}>Select Additional Services Provided by Chef</Text>
            </CardItem>

            {additionalServices &&
              additionalServices.length > 0 &&
              additionalServices.map((item, index) => {
                return (
                  <View>
                    <View>
                      <ListItem style={{borderBottomWidth: 0}}>
                        {item.disabled === true ? (
                          <CheckBox checked={item.checked} color={Theme.Colors.lightgrey} />
                        ) : (
                          <CheckBox
                            checked={item.checked}
                            onPress={() => this.onServiceChecked(index, item.checked)}
                            color={Theme.Colors.primary}
                          />
                        )}
                        <Body>
                          <Text>{item.name}</Text>
                        </Body>
                      </ListItem>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                      <Label style={styles.label}>Price</Label>
                      <Text>${item.price}</Text>
                    </View>
                  </View>
                )
              })}
          </Card>
          {invalidGuest === false && invalidComplexity === false && (
            <Card style={styles.cardStyle}>
              <CardItem header bordered>
                <Text style={{color: 'black'}}>Charges</Text>
              </CardItem>
              <View style={styles.iconText}>
                <Text style={styles.heading}>No of guests</Text>
                <Text style={styles.biilingRightText}>{guestCount}</Text>
              </View>
              {guestCount <= 5 ? (
                <View style={styles.iconText}>
                  <Text style={styles.heading}>
                    Chef Base rate (${chefPrice}) X {guestCount}
                  </Text>
                  <Text style={styles.biilingRightText}>
                    ${chefCharge ? chefCharge.toFixed(2) : 0}
                  </Text>
                </View>
              ) : (
                <View>
                  <View style={styles.iconText}>
                    <Text style={styles.heading}>
                      Chef Base rate (${chefPrice}) X {guestCount}
                    </Text>
                    <Text style={styles.biilingRightText}>
                      ${chefCharge ? chefCharge.toFixed(2) : 0}
                    </Text>
                  </View>
                  <View style={styles.iconText}>
                    <Text style={styles.discount}>
                      {' '}
                      Discount - Over 5 ({guestCount}) guests half chef Base Rate (
                      {`$${guestPrice}`})
                    </Text>
                    <Text style={styles.biilingRightText}>
                      ${discount ? discount.toFixed(2) : 0}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.iconText}>
                <Text style={styles.heading}>Complexity Upcharge ({selectedValue}X)</Text>
                <Text style={styles.biilingRightText}>
                  ${complexityUpcharge ? complexityUpcharge.toFixed(2) : 0}
                </Text>
              </View>

              {/* <View style={styles.iconText}>
                <Text style={styles.heading}>
                  {Languages.bookingDetail.labels.extra_service_provided}
                </Text>
                {newService && newService.length > 0 ? (
                  <View style={styles.dishView}>
                    {newService.map((item, key) => {
                      const chip = []
                      chip.push(
                        <Button small rounded light style={styles.dishItem}>
                          <Text style={styles.locationText}>
                            {item.name} : {Languages.bookingDetail.labels.dollar}
                            {item.price}
                          </Text>
                        </Button>
                      )
                      return chip
                    })}
                  </View>
                ) : (
                  <Text style={styles.biilingRightText}>
                    {Languages.chefProfile.labels.no_service}
                  </Text>
                )}
              </View> */}
              {/* <View style={styles.iconText}>
                <Text style={styles.heading}>
                  {Languages.bookingDetail.labels.rockoly_payment_charge}
                </Text>
                <Text style={styles.biilingRightText}>
                  {commissionCost ? `$${parseFloat(commissionCost).toFixed(2)}` : `$${0}`}
                </Text>
              </View> */}
              <View style={styles.iconText}>
                <Text style={styles.heading}>
                  {Languages.bookingDetail.labels.extra_services_amount}
                </Text>
                <Text style={styles.biilingRightText}>
                  {newAdditionalTotalPrice
                    ? `$${parseFloat(newAdditionalTotalPrice).toFixed(2)}`
                    : `$${0}`}
                </Text>
              </View>
              <View style={styles.iconText}>
                <Text style={styles.heading}>
                  {Languages.bookingDetail.labels.rockoly_payment_charge}
                </Text>
                <Text style={styles.biilingRightText}>
                  {rockolyCharge ? `$${parseFloat(rockolyCharge).toFixed(2)}` : `$${0}`}
                </Text>
              </View>
              <View
                style={{borderWidth: 0.5, borderColor: Theme.Colors.borderColor, marginTop: 10}}
              />
              <View style={styles.iconText}>
                <Text style={styles.heading}>{Languages.bookingDetail.labels.total_amount} </Text>
                <Text style={styles.biilingRightText}>
                  {Languages.bookingDetail.labels.dollar}
                  {totalPay ? `${parseFloat(totalPay).toFixed(2)}` : null}
                </Text>
              </View>
              <View style={{marginBottom: 5}} />
            </Card>
          )}
          {/* {bookingData.bookingHistId && invalidGuest === false && invalidComplexity === false && (
            <View style={styles.iconText}>
              <View>
                <Text style={styles.heading}>
                  Admin will send you the amount :{' '}
                  <Text style={styles.destext}>
                    {chefTotal ? `$${chefTotal.toFixed(2)}` : `$${0}`}
                  </Text>
                </Text>
              </View>
            </View>
          )} */}
          {Platform.OS === 'ios' && <KeyboardSpacer />}
        </ScrollView>
      </View>
    )
  }
}

priceCalculation.contextType = AuthContext
