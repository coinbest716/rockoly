/** @format */

import React, {PureComponent} from 'react'
import {View} from 'react-native'
import {Text} from 'native-base'
import styles from './styles'

export default class RegisterProfile extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={styles.mainView}>
        <Text style={styles.topText}>RegisterProfile</Text>
      </View>
    )
  }
}
