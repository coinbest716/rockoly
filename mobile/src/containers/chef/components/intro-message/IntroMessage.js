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
import {CommonButton} from '@components'
import {Languages} from '@translations'
import styles from './styles'

export default class IntroMessage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onNext = () => {
    this.props.onNext()
  }

  render() {
    const {onNext} = this.props
    return (
      <ScrollView style={{marginHorizontal: 10, marginVertical: 5}}>
        <Label style={styles.label}>Pricing Model</Label>
        <Text style={styles.textStyle}>
          At Rockoly, our goal is to provide fair, transparent pricing for the customer while
          maintaining a trustworthy platform for consumer to chef interaction.
        </Text>
        <Text style={styles.label}>Our customer pricing is driven by:</Text>
        <View style={styles.bodyContainer}>
          <Text style={styles.bullet}> {'\u2B24'}</Text>
          <Text style={styles.pricingtextStyle}>Base rate </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bullet}> {'\u2B24'}</Text>
          <Text style={styles.pricingtextStyle}>Amount of people </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bullet}> {'\u2B24'}</Text>
          <Text style={styles.pricingtextStyle}>Complexity of the menu</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bullet}> {'\u2B24'}</Text>
          <Text style={styles.pricingtextStyle}>Additional services</Text>
        </View>
        <Text style={styles.textStyle}>
          We have created a pricing model that is based on the skill and creativity of the chef, not
          on the cost of ingredients or event type. Ingredient cost is a separate expense and is
          paid by the customer once purchasing receipts are provided.
        </Text>
        <Text style={styles.textStyle}>
          By upholding the integrity of our unique pricing model and user friendly environment, we
          strive to provide a gourmet, one of a kind experience for everyone involved.
        </Text>
        {onNext && (
          <CommonButton
            btnText={Languages.complexity.btnLabel.agree}
            containerStyle={styles.saveBtn}
            onPress={this.onNext}
          />
        )}
      </ScrollView>
    )
  }
}
