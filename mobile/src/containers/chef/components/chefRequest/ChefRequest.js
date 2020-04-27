/** @format */

import React, {PureComponent} from 'react'
import {View, Image, ScrollView} from 'react-native'
import {
  Text,
  Form,
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
import {Header, CommonButton} from '@components'
import {Images} from '@images'
import {Theme} from '@theme'
import {RouteNames} from '@navigation'
import styles from './styles'

const additionalServices = [
  {
    text: 'Planting',
    price: 50,
    checked: false,
  },
  {
    text: 'Flowers',
    price: 25,
    checked: false,
  },
  {
    text: 'Extra Time',
    price: 36,
    checked: false,
  },
]

export default class ChefRequest extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
  }

  render() {
    const {isLoading} = this.state

    return (
      <View style={styles.mainView}>
        <Header showBack title="Chef Request" showBell={false} />
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.headline}>Boopathi S 4/22/2020 Sign off</Text>
            <Text style={styles.heading}>Uploaded Receipts </Text>
            <View style={styles.innerContainer}>
              <View>
                <Text style={styles.innerText}>Whole Foods: $ 150.00 </Text>
                <Image style={styles.receiptImage} source={Images.chef.chefBanner} />
              </View>
              <View>
                <Text style={styles.innerText}>Wine Depot: $ 100.00 </Text>
                <Image style={styles.receiptImage} source={Images.chef.leaf} />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Form style={{width: '50%'}}>
                <Item>
                  <Input placeholder="Amount" />
                </Item>
                <Item>
                  <Input placeholder="Decripition" />
                </Item>
              </Form>
              <CommonButton containerStyle={styles.updateBtn} btnText="Upload Receipt" />
            </View>
            <Text style={styles.heading}>Additional Services Performed: </Text>
            {additionalServices &&
              additionalServices.length > 0 &&
              additionalServices.map((item, index) => {
                console.log('item', item)
                return (
                  <ListItem style={{borderBottomWidth: 0}}>
                    <CheckBox
                      checked={item.checked}
                      color={Theme.Colors.primary}
                      // onPress={() => this.onItemPress(index, item.checked)}
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>{item.text}</Text>
                    </Body>
                    <Item
                      style={{
                        width: 'auto',
                        height: 40,
                        borderBottomWidth: 0,
                        alignSelf: 'center',
                        backgroundColor: '#F1F1F1',
                        borderRadius: 20,
                        marginHorizontal: 10,
                      }}>
                      <View style={{flexDirection: 'row', marginHorizontal: 20}}>
                        <Text>${item.price}</Text>
                      </View>
                    </Item>
                  </ListItem>
                )
              })}
            <View style={{flexDirection: 'row'}}>
              <Form style={{width: '50%'}}>
                <Item>
                  <Input placeholder="Amount" />
                </Item>
                <Item>
                  <Input placeholder="Decripition" />
                </Item>
              </Form>
              <CommonButton containerStyle={styles.updateBtn} btnText="Add Service" />
            </View>
            <Text style={styles.heading}>Request Total: $450.00 </Text>
            <CommonButton
              containerStyle={styles.updateBtn}
              btnText="Send for Approval"
              // onPress={this.onUpdateProfile}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}
