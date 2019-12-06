/** @format */

import React, {PureComponent} from 'react'
import {View, Alert} from 'react-native'
import {Item, Icon, Text, Input, Toast} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Languages} from '@translations'
import {CommonButton, Header, Spinner} from '@components'
import {LoginService} from '@services'

import styles from './styles'
import {RouteNames} from '@navigation'

export default class ForgotPassword extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      isLoading: false,
    }
  }

  onChangeEmail = value => {
    this.setState({
      email: value,
    })
  }

  onLogin = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.LOGIN_SCREEN)
  }

  onResetPassword = () => {
    const {email} = this.state
    if (!email) {
      Toast.show({
        text: Languages.forgetPassword.alertMessage.enter_field,
        duration: 3000,
      })
    } else {
      this.setState({isLoading: true})

      LoginService.forgotPassword(email)
        .then(() => {
          Toast.show({
            text: Languages.forgetPassword.alertMessage.reset_link,
            duration: 3000,
          })
          this.setState({isLoading: false})
          this.onLogin()
        })
        .catch(error => {
          this.setState({isLoading: false}, () => {
            Alert.alert(
              'Reset Password',
              'Invalid Email',
              [{text: Languages.login.buttonLabels.ok, onPress: () => {}}],
              {
                cancelable: false,
              }
            )
          })
        })
    }
  }

  render() {
    const {email, isLoading} = this.state

    return (
      <View style={styles.mainView}>
        <Header showBack title={Languages.forgetPassword.title} showBell={false} />
        <KeyboardAwareScrollView>
          <View style={styles.viewStyle}>
            <View style={styles.forgotView}>
              <Text style={styles.forgotLabel}>{Languages.forgetPassword.title}</Text>
            </View>
            <View style={styles.labelView}>
              <Text style={styles.label}>{Languages.forgetPassword.buttonLabels.forgot_info}</Text>
            </View>
            <View style={styles.inputViewStyle}>
              <View style={styles.inputWrap}>
                <Item>
                  <Icon style={styles.iconColor} active name="mail" />
                  <Input
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={this.onChangeEmail}
                    placeholder={Languages.forgetPassword.buttonLabels.email}
                    returnKeyType="next"
                  />
                </Item>
              </View>
            </View>
          </View>

          <CommonButton
            containerStyle={styles.resetBtn}
            btnText={Languages.forgetPassword.buttonLabels.reset_password}
            onPress={this.onResetPassword}
          />
          {isLoading ? <Spinner animating mode="full" /> : null}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}
