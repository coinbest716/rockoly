/** @format */

import React, {Component} from 'react'
import {View, ScrollView, Alert} from 'react-native'
import {
  Text,
  Item,
  Icon,
  Input,
  Label,
  ListItem,
  CheckBox,
  Body,
  Card,
  Button,
  Right,
  Toast,
  Left,
  Radio,
} from 'native-base'
import _ from 'lodash'
import {Languages} from '@translations'
import {CommonButton, Spinner} from '@components'
import {
  AuthContext,
  ChefPreferenceService,
  CHEF_PREFERNCE_EVENT,
  BasicProfileService,
} from '@services'
import {Theme} from '@theme'
import styles from './styles'

export default class OptionList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      additionalServices: [],
      agreeChecked: false,
      additionalServiceTypeId: [],
      isFetching: false,
    }
  }

  componentDidMount() {
    ChefPreferenceService.on(CHEF_PREFERNCE_EVENT.ADDITIONAL_SERVICES, this.additionalServicesList)
    this.setState(
      {
        isFetching: true,
      },
      () => {
        this.loadData()
        this.loadAdditionalServices()
      }
    )
  }

  componentWillUnmount() {
    ChefPreferenceService.off(CHEF_PREFERNCE_EVENT.ADDITIONAL_SERVICES, this.additionalServicesList)
  }

  loadAdditionalServices = () => {
    ChefPreferenceService.getAdditionalServices()
  }

  additionalServicesList = ({additionalServiceData}) => {
    this.setState({isFetching: false})
    const temp = []
    if (additionalServiceData && additionalServiceData.length > 0) {
      additionalServiceData.map((item, value) => {
        const val = {
          label: item.additionalServiceTypeName,
          id: item.additionalServiceTypeId,
          checked: false,
          priceValue: '',
        }
        temp.push(val)
      })
      this.setState(
        {
          additionalServices: temp,
        },
        () => {
          this.loadCheckedServiceList()
        }
      )
    } else {
      this.setState({
        additionalServices: [],
      })
    }
  }

  loadCheckedServiceList = async () => {
    const {additionalServices} = this.state
    const {getProfile} = this.context
    const profile = await getProfile()
    if (profile && profile.chefProfileExtendedsByChefId) {
      if (
        profile.chefProfileExtendedsByChefId &&
        profile.chefProfileExtendedsByChefId.nodes.length > 0
      ) {
        const preferences = profile.chefProfileExtendedsByChefId.nodes[0]

        const additionalServicesType = additionalServices

        const temp = []

        additionalServicesType.map((res, index) => {
          let val = {}
          if (
            preferences &&
            preferences.additionalServiceDetails &&
            preferences.additionalServiceDetails.length > 0
          ) {
            val = _.find(JSON.parse(preferences.additionalServiceDetails), o => {
              return o.id === res.id
            })
          }
          const obj = {
            label: res.label,
            id: res.id,
            checked:
              preferences && preferences.additionalServiceDetails
                ? !JSON.parse(preferences.additionalServiceDetails).every(
                    item => item.id !== res.id
                  )
                : false,
            priceValue: val && val !== undefined ? val.price : '',
          }
          temp.push(obj)
        })

        this.setState({
          additionalServices: temp,
        })
      }
    }
  }

  loadData = async () => {
    const {getProfile} = this.context
    const profile = await getProfile()
    this.setState({isFetching: false})
    if (profile) {
      const profileExtended = profile.chefProfileExtendedsByChefId.nodes[0]
      this.setState({
        agreeChecked: profileExtended.isChefEnabledShoppingLocationYn,
      })
    }
  }

  renderLine = () => {
    return <View style={styles.border} />
  }

  onChangePriceValue = (index, value) => {
    const {additionalServices} = this.state
    const temp = additionalServices

    if (temp[index]) {
      temp[index].priceValue = value
    }

    this.setState(
      {
        additionalServices: temp,
      },
      async () => {
        await this.getIdValue()
      }
    )
  }

  // onGiveRating = (index, checked, item) => {
  //   const {rating} = this.state
  //   const temp = rating
  //   console.log('temp', temp[index])
  //   if (temp[index]) {
  //     temp[index].checked = !checked
  //   }
  //   this.setState(
  //     {
  //       rating: temp,
  //     },
  //     async () => {
  //       let val = ''
  //       let value = ''
  //       console.log('rating', rating)
  //       await rating.map((itemVal, key) => {
  //         console.log('itemVal', itemVal)
  //         if (itemVal.checked === true) {
  //           console.log(itemVal)
  //           itemVal.value.map((itemValue, itemIndex) => {
  //             console.log('valueIndex', itemValue, itemIndex)
  //             val = `${`${val},${itemValue.toString()}`}`
  //             // if (itemValue.length - 1 !== itemIndex && itemValue.length !== 1) val += ','
  //             // val.push(itemValue)
  //           })
  //         }
  //       })

  //       value = `{${_.trim(val, ',')}}`
  //       console.log('val', value)
  //       this.setState({
  //         ratingOptionValue: value,
  //       })
  //     }
  //   )
  // }

  onItemPress = (index, checked) => {
    const {additionalServices} = this.state
    const temp = additionalServices
    console.log('temp', temp)
    if (temp[index]) {
      temp[index].checked = !checked
    }

    this.setState(
      {
        additionalServices: temp,
      },
      async () => {
        await this.getIdValue()
      }
    )
  }

  getIdValue = async () => {
    const {additionalServices} = this.state
    const val = []
    await additionalServices.map((itemVal, key) => {
      if (itemVal.checked === true) {
        const obj = {
          service: itemVal.id,
          price: itemVal.priceValue,
        }
        val.push(obj)
      }
    })
    this.setState({
      additionalServiceTypeId: val,
    })
  }

  onChecked = checked => {
    this.setState({
      agreeChecked: !checked,
    })
  }

  onSave = async () => {
    const {currentUser} = this.context
    const {onSaveCallBack} = this.props
    const {agreeChecked, additionalServiceTypeId} = this.state
    console.log('additionalServiceTypeId', additionalServiceTypeId)

    if (!agreeChecked) {
      Alert.alert('Please click agree to continue')
      return
    }

    let valid = true

    if (additionalServiceTypeId) {
      await additionalServiceTypeId.map((res, index) => {
        if (
          !res.price ||
          res.price === null ||
          res.price === undefined ||
          res.price === '' ||
          res.price === ' ' ||
          parseInt(res.price) <= 0 ||
          !Number.isInteger(parseFloat(res.price))
        ) {
          valid = false
        }
      })
    }

    if (!valid) {
      Alert.alert('Info', 'Please add price')
      return
    }

    if (valid && currentUser && currentUser !== null && currentUser !== undefined) {
      const obj = {
        chefProfileExtendedId: currentUser.chefProfileExtendedId,
        chefAdditionalServices: additionalServiceTypeId
          ? JSON.stringify(additionalServiceTypeId)
          : null,
        isChefEnabledShoppingLocationYn: agreeChecked,
      }
      this.setState({
        isFetching: true,
      })
      ChefPreferenceService.updateService(obj)
        .then(data => {
          this.setState({isFetching: false})
          // BasicProfileService.emitProfileEvent()
          if (onSaveCallBack) {
            onSaveCallBack()
          }
          // this.loadData()
        })
        .catch(error => {
          console.log('option error', error)
        })
    }
  }

  render() {
    const {
      additionalServices,
      agreeChecked,
      isFetching,
      price,
      additionalServiceTypeId,
    } = this.state
    const {onSaveCallBack} = this.props
    if (isFetching) {
      return <Spinner mode="full" />
    }
    return (
      <ScrollView>
        <View style={styles.container}>
          <Label style={styles.label}>Additional Services </Label>
          <Text style={styles.textStyle}>
            What additional services can you provide? You can change the prices any time under your
            profile.
          </Text>
          <Card style={styles.cardStyle}>
            <ScrollView>
              {additionalServices &&
                additionalServices.length > 0 &&
                additionalServices.map((item, index) => {
                  return (
                    <ListItem style={{borderBottomWidth: 0}}>
                      <CheckBox
                        checked={item.checked}
                        color={Theme.Colors.primary}
                        onPress={() => this.onItemPress(index, item.checked)}
                      />
                      <Body style={{marginLeft: 5}}>
                        <Text>{item.label}</Text>
                      </Body>
                      <Item
                        style={{
                          width: 110,
                          borderBottomWidth: 0,
                          alignSelf: 'center',
                          backgroundColor: '#F1F1F1',
                          borderRadius: 20,
                          marginHorizontal: 10,
                        }}>
                        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
                          <Icon
                            name="currency-usd"
                            type="MaterialCommunityIcons"
                            style={styles.iconStyle}
                          />
                          <Input
                            onChangeText={value => this.onChangePriceValue(index, value)}
                            value={item.priceValue}
                            keyboardType="number-pad"
                            placeholder={Languages.optionList.placeholderLabel.price}
                            style={styles.gratuityText}
                          />
                        </View>
                      </Item>
                    </ListItem>
                  )
                })}
            </ScrollView>
          </Card>
          {onSaveCallBack && (
            <View style={styles.guestView}>
              <Label style={styles.label}>Shopping Location </Label>
              <View>
                <Text style={styles.textStyle}>
                  We don't charge the customer for the ingredients. Will you be able to pick up the
                  ingredients for the customer at the store of their choice and provide the customer
                  with ingredients receipt.
                </Text>
              </View>
              <ListItem style={{borderBottomWidth: 0}}>
                <CheckBox
                  checked={agreeChecked}
                  color={Theme.Colors.primary}
                  onPress={() => this.onChecked(agreeChecked)}
                />
                <Body style={{marginLeft: 5}}>
                  <Text>I agree</Text>
                </Body>
              </ListItem>
            </View>
          )}
          <CommonButton
            btnText={Languages.optionList.btnLabel.save}
            containerStyle={styles.saveBtn}
            onPress={this.onSave}
          />
        </View>
      </ScrollView>
    )
  }
}

OptionList.contextType = AuthContext
