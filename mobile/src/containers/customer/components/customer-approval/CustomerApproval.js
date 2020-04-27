/** @format */

import React, { PureComponent } from 'react'
import { View, ScrollView, Platform, Image } from 'react-native'
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
  Toast,
  Radio,
} from 'native-base'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import moment from 'moment'

import { CommonButton, Spinner } from '@components'
import { AuthContext } from '@services'
import { Languages } from '@translations'
import { Theme } from '@theme'
import styles from './styles'

const reciepts = [
  {
    receiptName: 'Whole Foods',
    amount: '$100',
    imageUrl: 'https://image.shutterstock.com/image-photo/chicken-rice-african-food-dish-600w-1219983955.jpg'
  },
  {
    receiptName: 'Wine Depot',
    amount: '$150',
    imageUrl: 'https://image.shutterstock.com/image-photo/italian-food-cooking-ingredients-on-600w-1134678446.jpg'
  },
]

const additonalServices = [
  {
    serviceName: 'Plating',
    amount: '$20'
  },
  {
    serviceName: 'Cleaning',
    amount: '$30'
  },
  {
    serviceName: 'Stayed 3hours extra',
    amount: '$180'
  },
]
const tipAmount = [
  {
    tipPercentage: '10%',
    tipAmount: '$100',
    tipId: '1',
  },
  {
    tipPercentage: '20%',
    tipAmount: '$200',
    tipId: '2',
  },
  {
    tipPercentage: '30%',
    tipAmount: '$300',
    tipId: '3',
  },
  {
    tipPercentage: 'Other Amount',
    tipAmount: null,
    tipId: 'Other',
  }
]

export default class CustomerApproval extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      profile: {},
      tipValue: '',
      otherTipValue: '',
    }
  }

  async componentDidMount() {
    const { getProfile } = this.context
    const profile = await getProfile()
    console.log('Customer Approval', profile)
    this.setState({
      profile
    })
  }

  onApprovePress = () => {
    console.log('onApprovePress')
  }

  onRejectPress = () => {
    console.log('onRejectPress')
  }

  onSelected = tipId => {
    this.setState({
      tipValue: tipId
    })
  }

  onChangeOtherTipValue = value => {
    this.setState({
      otherTipValue: value,
    })
  }

  render() {
    const { isLoading, profile, otherTipValue, tipValue } = this.state
    if (isLoading) {
      return (
        <View style={styles.alignScreenCenter}>
          <Spinner mode="full" animating />
        </View>
      )
    }
    return (
      <ScrollView style={{ marginHorizontal: 15, marginVertical: 15, flex: 1 }}>
        <Text style={styles.labelStyle}>Chef {profile.fullName} {moment(new Date()).format('MM/DD/YYYY')} Sign Off</Text>
        <View>
          <Text style={styles.labelStyle}>
            Uploaded Receipts
         </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {reciepts && reciepts.length > 0 ? (
              reciepts.map((item, key) => {
                return (
                  <View style={{ flexWrap: 'wrap', marginRight: 10 }}>
                    <Text style={styles.rightViewStyle}>{item.receiptName}: <Text>{item.amount}</Text></Text>
                    <Image
                      style={styles.recieptImage}
                      source={item.imageUrl ? { uri: item.imageUrl } : Images.common.defaultAvatar}
                    />
                  </View>
                )

              })
            )
              :
              <Text>
                No Receipts
              </Text>
            }
          </View>
          <Text style={styles.labelStyle}>
            Additional Services Performed
         </Text>
          <View>
            {additonalServices && additonalServices.length > 0 ? (
              additonalServices.map((item, key) => {
                return (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: '25%' }}>
                    <Text style={styles.rightViewStyle}>{item.serviceName}</Text>
                    <Text style={styles.rightViewStyle}>{item.amount}</Text>
                  </View>
                )

              })
            )
              :
              <Text>
                No Services
              </Text>
            }
          </View>
          <Text style={styles.labelStyle}>
            Tip Amount
         </Text>
          <View>
            {tipAmount && tipAmount.length > 0 ?
              tipAmount.map((item, index) => {
                return (
                  <ListItem
                    style={{ borderBottomWidth: 0 }}
                    key={index}
                    containerStyle={{ flexDirection: 'row' }}
                    onPress={() => this.onSelected(item.tipId)}>
                    <Radio
                      onPress={() => this.onSelected(item.tipId)}
                      selectedColor={Theme.Colors.primary}
                      selected={item.tipId === this.state.tipValue}
                    />
                    <Body>
                      <Text>
                        {item.tipPercentage ? item.tipPercentage : null} {item.tipAmount ? item.tipAmount : null}
                      </Text>
                    </Body>
                    {tipValue === 'Other' && item.tipId === this.state.tipValue && (
                        <Input
                          onChangeText={this.onChangeOtherTipValue}
                          value={otherTipValue}
                          placeholder={'Other'}
                          style={styles.otherTipStyle}
                          keyboardType="number-pad"
                        />
                      )}
                  </ListItem>
                )
              })
              :
              <Text>
                No Tips
          </Text>
            }

          </View>

          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View style={styles.viewStyle}>
              <Text style={styles.textStyle}>Food Cost: </Text>
              <Text style={styles.textStyle}>Food Deposit:</Text>
              <Text style={styles.textStyle}>Extra Services:</Text>
              <Text style={styles.textStyle}>TIP Amount:</Text>
            </View>
            <View>
              <Text style={styles.rightViewStyle}>$242.50</Text>
              <Text style={styles.rightViewStyle}>-$100</Text>
              <Text style={styles.rightViewStyle}>$100</Text>
              <Text style={styles.rightViewStyle}>$250</Text>
            </View>
          </View>


          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.labelStyle}>Request Total:</Text>
            <Text style={{ marginLeft: '5%', marginVertical: 7 }}>$495.50</Text>
          </View>
        </View>

        <View style={styles.loginBtnView}>
          <CommonButton
            textStyle={styles.loginBtnText}
            btnText={Languages.customerApproval.label.approve}
            containerStyle={styles.approveBtn}
            onPress={() => this.onApprovePress()}
          />
          <CommonButton
            textStyle={styles.loginBtnText}
            btnText={Languages.customerApproval.label.reject}
            containerStyle={styles.rejectBtn}
            onPress={() => this.onRejectPress()}
            danger
          />
        </View>

        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </ScrollView>
    )
  }
}

CustomerApproval.contextType = AuthContext
