/** @format */

import React, {PureComponent} from 'react'
import {View, Alert, Image} from 'react-native'
import {Item, Icon, Text, Input, Toast} from 'native-base'
import {Languages} from '@translations'
import {CONSTANTS} from '@common'
import {Images} from '@images'
import styles from './styles'
import {RouteNames} from '@navigation'

export default class PreRegister extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onBack = () => {
    const {navigation} = this.props
    navigation.goBack()
  }

  onRegisterPress = role => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.REGISTER_SCREEN, {role})
  }

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.viewTop}>
          <Icon
            style={styles.arrowLeft}
            type="MaterialCommunityIcons"
            name="arrow-left"
            onPress={() => {
              this.onBack()
            }}
          />
          <Image style={styles.imageStyle} source={Images.role.chefImage} />
          <Text style={styles.topText}>Are you a private chef?</Text>
          <Icon
            style={styles.arrowRight}
            type="MaterialCommunityIcons"
            name="arrow-right-circle"
            onPress={() => {
              this.onRegisterPress(CONSTANTS.ROLE.CHEF)
            }}
          />
        </View>
        <View style={styles.viewBottom}>
          <Image style={styles.imageBottom} source={Images.role.customerImage} />
          <Text style={styles.topText}>Are you looking for a private chef?</Text>
          <Icon
            style={styles.arrowRight}
            type="MaterialCommunityIcons"
            name="arrow-right-circle"
            onPress={() => {
              this.onRegisterPress(CONSTANTS.ROLE.CUSTOMER)
            }}
          />
        </View>
      </View>
    )
  }
}
