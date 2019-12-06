/** @format */

import React, {Component} from 'react'
import {View, ScrollView} from 'react-native'
import {
  Text,
  Item,
  Icon,
  Input,
  Label,
  ListItem,
  CheckBox,
  Body,
  Button,
  Right,
  Toast,
  Left,
  Radio,
} from 'native-base'
import {Languages} from '@translations'
import {CommonButton, Spinner} from '@components'
import {AuthContext, ChefPreferenceService, BasicProfileService} from '@services'
import {Theme} from '@theme'
import styles from './styles'

export default class OptionList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      additionalServices: [
        {
          label: 'Serve the food',
          value: 'Serve the food',
          checked: false,
        },
        {
          label: 'Cleaning',
          value: 'Cleaning',
          checked: false,
        },
        {
          label: 'Plating',
          value: 'Plating',
          checked: false,
        },
        {
          label: 'Flowers / Decoration',
          value: 'Flowers / Decoration',
          checked: false,
        },
        {
          label: 'Pouring service',
          value: 'Pouring service',
          checked: false,
        },
        {
          label: 'Extra server (If you have access to someone to help you)',
          value: 'Extra server (If you have access to someone to help you)',
          checked: false,
        },
      ],
      agreeChecked: false,
      additionalServiceTypeId: [],
      isFetching: false
    }
  }

  componentDidMount() {
    this.setState(
      {
        isFetching: true,
      },
      () => {
        this.loadData()
      }
    )
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

  onItemPress = (index, checked) => {
    console.log('onItemPress', index, checked)
    const {additionalServices} = this.state
    const temp = additionalServices

    if (temp[index]) {
      temp[index].checked = !checked
    }

    console.log('temp', temp)

    this.setState(
      {
        additionalServices: temp,
      },
      async () => {
        const val = []
        await additionalServices.map((itemVal, key) => {
          if (itemVal.checked === true) {
            val.push(itemVal.value)
          }
        })
        this.setState({
          additionalServiceTypeId: val,
        })
      }
    )
  }

  onChecked = checked => {
    this.setState({
      agreeChecked: !checked,
    })
  }

  onSave = () => {
    const {currentUser} = this.context
    const {agreeChecked, additionalServiceTypeId} = this.state
    if (currentUser && currentUser !== null && currentUser !== undefined) {
      const obj = {
        chefProfileExtendedId: currentUser.chefProfileExtendedId,
        chefAdditionalServices: null,
        isChefEnabledShoppingLocationYn: agreeChecked,
      }
      this.setState({
        isFetching: true,
      })
      console.log('OptionList save', obj)
      ChefPreferenceService.updateService(obj)
        .then(data => {
          this.setState({isFetching:false})
          BasicProfileService.emitProfileEvent()
          console.log('option data', data)
          this.loadData()
        })
        .catch(error => {
          console.log('option error', error)
        })
    }
  }

  render() {
    const {additionalServices, agreeChecked, isFetching, additionalServiceTypeId} = this.state
    if (isFetching) {
      return <Spinner mode="full" />
    }
    return (
      <ScrollView style={{paddingBottom: '10%'}}>
        <View style={styles.container}>
          <View style={styles.guestView}>
            <Label style={styles.label}>Additional Services </Label>
            <Text style={styles.textStyle}>
              What additional services can you provide? You can change the prices any time under
              your profile.
            </Text>
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
                  </ListItem>
                )
              })}
          </View>
          <View style={styles.guestView}>
            <Label style={styles.label}>Shopping Location </Label>
            <View>
              <Text style={styles.textStyle}>
                We don't charge the customer for the ingredients. Will you be able to pickup the
                ingredients for the customer at the store of their choice and provide the customer
                with the food bill.
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
        </View>
        <CommonButton
          btnText={Languages.optionList.btnLabel.save}
          containerStyle={styles.saveBtn}
          onPress={this.onSave}
        />
      </ScrollView>
    )
  }
}

OptionList.contextType = AuthContext
