/** @format */
/** @format */

import React, {PureComponent} from 'react'
import {View, Alert} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Text, Item, Icon, Input, Toast, Right} from 'native-base'
import firebase from 'react-native-firebase'
import {Header, CommonButton, Spinner} from '@components'
import {Languages} from '@translations'
import {RegisterService, LoginService, AuthContext} from '@services'
import styles from './styles'
import {RouteNames, ResetAction} from '@navigation'

class ChangePassword extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      showPasswordError: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      isLoading: false,
      isChef: false,
      eyeIconNewPasswordShow: false,
      eyeIconConfirmPasswordShow: false,
    }
  }

  componentDidMount() {
    const {isChef, isLoggedIn} = this.context
  }

  onOldPasswordHandle = currentPassword => {
    this.setState({currentPassword})
  }

  onPasswordEditHandle = newPassword => {
    this.setState({newPassword})
  }

  onConfirmPasswordEditHandle = confirmPassword => {
    const {newPassword} = this.state
    this.setState({confirmPassword, showPasswordError: newPassword !== confirmPassword})
  }

  logout = () => {
    const {logout} = this.context
    const {navigation} = this.props
    logout(() => {
      ResetAction(navigation, RouteNames.CUSTOMER_SWITCH)
    })
  }

  onResetPress = () => {
    const user = firebase.auth().currentUser
    const {currentPassword, newPassword} = this.state
    // const newpass = newPassword
    if (currentPassword && newPassword) {
      try {
        this.setState(
          {
            isLoading: true,
          },
          () => {
            // reauthenticating
            this.reauthenticate(currentPassword)
              .then(() => {
                // updating password
                user.updatePassword(newPassword)
                this.setState({isLoading: false}, () => {
                  Toast.show({
                    text: Languages.changePassword.reg_form_label.password_sucsess,
                    duration: 3000,
                  })
                  Alert.alert(
                    Languages.changePassword.reg_form_label.alert_title,
                    Languages.changePassword.reg_form_label.alert_message
                  )
                })

                this.logout()
              })
              .catch(error => {
                const errorCode = error.code
                const errorMessage = error.message
                // alertMessage('warning', errorMessage);
                Toast.show({
                  text: Languages.changePassword.reg_form_label.error_change_password,
                  duration: 3000,
                })
                this.setState({isLoading: false})
              })
          }
        )
      } catch (error) {
        this.setState({isLoading: false})
        Toast.show({
          text: Languages.changePassword.reg_form_label.error_reset_password,
          duration: 3000,
        })
        console.log(error)
      }
    } else {
      Alert.alert(Languages.changePassword.title, Languages.changePassword.reg_form_label.fill_form)
    }
  }

  setLoading = isLoading => {
    this.setState({
      isLoading,
    })
  }

  reauthenticate = currentPassword => {
    if (
      currentPassword &&
      currentPassword !== '' &&
      currentPassword !== undefined &&
      currentPassword !== null
    ) {
      const user = firebase.auth().currentUser
      const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword)
      return user.reauthenticateAndRetrieveDataWithCredential(cred)
    }
  }

  // this function is used to save the user details

  render() {
    const {
      confirmPassword,
      currentPassword,
      newPassword,
      isChef,
      isLoading,
      showPasswordError,
      eyeIconNewPasswordShow,
      eyeIconConfirmPasswordShow,
    } = this.state
    return (
      <View style={styles.container}>
        <Header showBack title={Languages.changePassword.title} showBell={false} />
        <KeyboardAwareScrollView>
          <View style={styles.regView}>
            <Item>
              <Icon style={styles.iconColor} name="lock" />
              <Input
                onChangeText={this.onOldPasswordHandle}
                value={currentPassword}
                placeholder={Languages.changePassword.reg_form_label.oldPassword}
              />
            </Item>
            {eyeIconNewPasswordShow === false ? (
              <Item>
                <Icon style={styles.iconColor} name="lock" />
                <Input
                  onChangeText={this.onPasswordEditHandle}
                  secureTextEntry
                  value={newPassword}
                  placeholder={Languages.changePassword.reg_form_label.newpassword}
                />
                <Right>
                  <Icon
                    onPress={() => this.setState({eyeIconNewPasswordShow: !eyeIconNewPasswordShow})}
                    style={styles.iconColor}
                    type="MaterialCommunityIcons"
                    active
                    name="eye-off-outline"
                  />
                </Right>
              </Item>
            ) : (
              <Item>
                <Icon style={styles.iconColor} name="lock" />
                <Input
                  onChangeText={this.onPasswordEditHandle}
                  value={newPassword}
                  placeholder={Languages.changePassword.reg_form_label.newpassword}
                />
                <Right>
                  <Icon
                    onPress={() => this.setState({eyeIconNewPasswordShow: !eyeIconNewPasswordShow})}
                    style={styles.iconColor}
                    type="MaterialCommunityIcons"
                    active
                    name="eye-outline"
                  />
                </Right>
              </Item>
            )}
            {eyeIconConfirmPasswordShow === false ? (
              <Item>
                <Icon style={styles.iconColor} name="lock" />
                <Input
                  onChangeText={this.onConfirmPasswordEditHandle}
                  secureTextEntry
                  value={confirmPassword}
                  placeholder={Languages.changePassword.reg_form_label.confirmPassword}
                />
                <Right>
                  <Icon
                    onPress={() =>
                      this.setState({eyeIconConfirmPasswordShow: !eyeIconConfirmPasswordShow})
                    }
                    style={styles.iconColor}
                    type="MaterialCommunityIcons"
                    active
                    name="eye-off-outline"
                  />
                </Right>
              </Item>
            ) : (
              <Item>
                <Icon style={styles.iconColor} name="lock" />
                <Input
                  onChangeText={this.onConfirmPasswordEditHandle}
                  value={confirmPassword}
                  placeholder={Languages.changePassword.reg_form_label.confirmPassword}
                />
                <Right>
                  <Icon
                    onPress={() =>
                      this.setState({eyeIconConfirmPasswordShow: !eyeIconConfirmPasswordShow})
                    }
                    style={styles.iconColor}
                    type="MaterialCommunityIcons"
                    active
                    name="eye-outline"
                  />
                </Right>
              </Item>
            )}
            {showPasswordError && newPassword !== confirmPassword && (
              <Text style={styles.passwordError}>
                {Languages.changePassword.reg_form_label.password_not_match}
              </Text>
            )}
            {!showPasswordError && (
              <Text style={styles.passwordInfo}>
                {Languages.changePassword.reg_form_label.password_info}
              </Text>
            )}
          </View>
          <CommonButton
            disabled={isLoading}
            containerStyle={styles.registerBtn}
            btnText={Languages.changePassword.buttonLabels.changePassword}
            onPress={this.onResetPress}
          />
          {isLoading ? <Spinner animating mode="full" /> : null}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

ChangePassword.contextType = AuthContext

export default ChangePassword
