/** @format */

import React, {Component} from 'react'
import {View, Platform} from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import {OTPVerification} from '@containers'
import {Header} from '@components'
import {AuthContext} from '@services'
import {Languages} from '@translations'

export default class RegMobileVerification extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Header showBack title={Languages.OTPVerification.title} showBell={false} />
        <OTPVerification />
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
    )
  }
}

RegMobileVerification.contextType = AuthContext
