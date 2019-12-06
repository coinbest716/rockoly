/** @format */

import React, {PureComponent} from 'react'
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
import styles from './styles'

export default class IntroMessage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <ScrollView style={{marginHorizontal: '5%'}}>
        <Label style={styles.label}>Pricing Model</Label>
        <Text style={styles.textStyle}>
          Here at Rockoly our goal is to provide fair transparent pricing for the customer building
          trust and increasing the private chef industry market share and getting you more money in
          the long run.
        </Text>
        <Text style={styles.textStyle}>
          In order to do so we have created a pricing model that is based on amount of work you do
          and not on ingredients cost or a type of the event.{' '}
        </Text>
        <Text style={styles.label}>4 things drive the pricing model:</Text>
        <View style={styles.bodyContainer}>
          <Text style={styles.bullet}> {'\u2B24'}</Text>
          <Text style={styles.pricingtextStyle}>Your base rate </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bullet}> {'\u2B24'}</Text>
          <Text style={styles.pricingtextStyle}>Number of people you are cooking for </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bullet}> {'\u2B24'}</Text>
          <Text style={styles.pricingtextStyle}>Complexity of the preparation of the menu</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bullet}> {'\u2B24'}</Text>
          <Text style={styles.pricingtextStyle}>Additional services.</Text>
        </View>
        <Text style={styles.textStyle}>
          Let's tackle this one step at a time. Don't worry, you will be able to update the rates at
          any point in your profile and play around with the Pricing Model Calculator the client
          sees.{' '}
        </Text>
      </ScrollView>
    )
  }
}
