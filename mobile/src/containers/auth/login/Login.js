/** @format */

import React, {PureComponent} from 'react'
import {View, Image, Switch, Alert} from 'react-native'
import {CheckBox, Item, Icon, Text, Button, Input, ListItem, Body, Left, Right} from 'native-base'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import firebase from 'react-native-firebase'
import {Header, CommonButton, Spinner} from '@components'
import {RouteNames, ResetAction} from '@navigation'
import {Languages} from '@translations'
import {LoginService, SOCIAL_LOGIN_TYPE, PushNotificationService} from '@services'
import {Theme} from '@theme'
import {Images} from '@images'
import {CONSTANTS} from '@common'
import {AuthContext} from '../../../AuthContext'

import styles from './styles'

class Login extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      checkbox: false,
      // isChef: false,
      // roleLabel: this.getRoleLabel(false),
      email: null,
      password: null,
      isLoading: false,
      eyeIconShow: false,
    }
  }

  setLoading(isLoading) {
    this.setState({
      isLoading,
    })
  }

  onUsernameEditHandle = email => {
    this.setState({email})
  }

  onPasswordEditHandle = password => this.setState({password})

  goBack = () => {
    const {navigation} = this
    ResetAction(navigation, RouteNames.CHEF_SWITCH)
  }

  goToForgotPassword = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.FORGOT_PASSWORD_SCREEN)
  }

  // getRoleLabel = isChef => {
  //   return isChef ? Languages.login.role.chef : Languages.login.role.customer
  // }

  onLoginPressHandle = async () => {
    console.log('debugging login pressed')
    const {navigation} = this.props
    const {email, password} = this.state
    const {updateCurrentUser} = this.context
    if (!email || !password) {
      return this.loginError(Languages.login.title, Languages.login.loginAlertMessage.fill_form)
    }
    const role = CONSTANTS.ROLE.CUSTOMER
    this.setLoading(true)
    return LoginService.firebaseEmailLogin(email, password)
      .then(async () => {
        const token = await LoginService.getIdToken()
        if (token) {
          LoginService.gqlLogin(token, role)
            .then(async gqlRes => {
              LoginService.onLogin({role, gqlRes, updateCurrentUser, navigation})
              // console.log('debugging login: gqlRes', gqlRes)
              // await updateCurrentUser({firebaseCurrentUser, currentUser: gqlRes}, () => {
              //   this.setLoading(false)
              //   PushNotificationService.syncToken(gqlRes.userId)
              //   if (role === CONSTANTS.ROLE.CHEF) {
              //     ResetAction(navigation, RouteNames.CHEF_SWITCH)
              //   } else {
              //     ResetAction(navigation, RouteNames.CUSTOMER_SWITCH)
              //   }
              // })
            })
            .catch(e => {
              console.log('login press', e)
              firebase.auth().signOut()
              if (e && e.message) {
                if (e.message == 'GraphQL error: YOUR_ACCOUNT_WAS_BLOCKED') {
                  this.loginError(
                    Languages.login.title,
                    Languages.login.loginAlertMessage.account_blocked
                  )
                } else {
                  this.loginError()
                }
              } else if (e === 'YOUR_ACCOUNT_WAS_BLOCKED') {
                this.loginError(
                  Languages.login.title,
                  Languages.login.loginAlertMessage.account_blocked
                )
              } else {
                this.loginError()
              }
            })
        } else {
          this.loginError()
          // log error
        }
      })
      .catch(e => {
        //
        if (e && e.code === 'auth/wrong-password') {
          this.loginError(null, Languages.login.loginAlertMessage.incorrect)
        } else if (e && e.code === 'auth/user-not-found') {
          this.loginError(null, Languages.login.loginAlertMessage.account_notfound)
        } else if (e && e.code === 'auth/invalid-email') {
          this.loginError(null, Languages.login.loginAlertMessage.invalid_email)
        } else {
          this.loginError()
        }
      })
  }

  loginError = (title, des) => {
    if (!title) {
      title = Languages.login.title
    }
    if (!des) {
      des = Languages.login.loginAlertMessage.try_again
    }
    this.setLoading(false)
    Alert.alert(title, des, [{text: Languages.login.buttonLabels.ok, onPress: () => {}}], {
      cancelable: false,
    })
  }

  onSocialLoginPressHandle = async type => {
    const {navigation} = this.props
    const {updateCurrentUser} = this.context
    this.setLoading(true)
    const role = CONSTANTS.ROLE.CUSTOMER
    const socialLogin =
      (await type) === SOCIAL_LOGIN_TYPE.GOOGLE
        ? LoginService.googleLogin()
        : LoginService.facebookLogin()

    socialLogin
      .then(async currentUser => {
        if (currentUser && currentUser.additionalUserInfo && currentUser.user) {
          if (currentUser.additionalUserInfo.isNewUser === false) {
            const token = await LoginService.getIdToken()
            console.log('token', token)
            if (token) {
              LoginService.gqlLogin(token, role)
                .then(async gqlRes => {
                  LoginService.onLogin({role, gqlRes, updateCurrentUser, navigation})
                  // console.log('debugging social login: gqlRes', type, gqlRes)
                  // await updateCurrentUser(
                  //   {firebaseCurrentUser: currentUser, currentUser: gqlRes},
                  //   () => {
                  //     PushNotificationService.syncToken(gqlRes.userId)
                  //     this.setLoading(false)
                  //     if (role === CONSTANTS.ROLE.CHEF) {
                  //       ResetAction(navigation, RouteNames.CHEF_SWITCH)
                  //     } else {
                  //       ResetAction(navigation, RouteNames.CUSTOMER_SWITCH)
                  //     }
                  //   }
                  // )
                })
                .catch(e => {
                  console.log('error message', e, e.message)
                  if (e && e.message) {
                    if (e.message === 'GraphQL error: YOUR_ACCOUNT_WAS_BLOCKED') {
                      this.loginError(
                        Languages.login.title,
                        Languages.login.loginAlertMessage.account_blocked
                      )
                    } else {
                      this.loginError()
                    }
                  } else if (e === 'YOUR_ACCOUNT_WAS_BLOCKED') {
                    this.loginError(
                      Languages.login.title,
                      Languages.login.loginAlertMessage.account_blocked
                    )
                  } else {
                    this.loginError()
                  }
                })
            } else {
              this.loginError()
              // log error
            }
          } else if (currentUser.additionalUserInfo.isNewUser === true) {
            // do account register later
            if (firebase.auth().currentUser) {
              firebase.auth().currentUser.delete()
            }
            // firebase.auth().signOut()
            this.loginError(
              Languages.login.loginAlertMessage.login_error,
              Languages.login.loginAlertMessage.account_not_exist
            )
          }
        }
      })
      .catch(e => {
        if (e && e.code && e.code === 'auth/account-exists-with-different-credential') {
          this.loginError(null, Languages.login.loginAlertMessage.account_already_exist)
        }
        this.loginError()
      })
  }

  onSignUpHandle = () => {
    const {role} = this.state
    const {navigation} = this.props
    navigation.navigate(RouteNames.REGISTER_SCREEN, {role})
  }

  checkBoxHandle = () => {
    const {checkbox} = this.state
    this.setState({
      checkbox: !checkbox,
    })
  }

  // changeRole = () => {
  //   const {isChef} = this.state
  //   this.setState({
  //     isChef: !isChef,
  //     roleLabel: this.getRoleLabel(!isChef),
  //   })
  // }

  onNotCheffHandle = () => {
    const {navigation} = this.props
  }

  renderSeperator = () => {
    return (
      <View style={styles.separatorWrap}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>{Languages.login.buttonLabels.or}</Text>
        <View style={styles.separator} />
      </View>
    )
  }

  render() {
    const {email, password, isLoading, checkbox, eyeIconShow} = this.state
    return (
      <View style={styles.container}>
        <Header
          showBack
          // navigateBackTo={RouteNames.CUSTOMER_MAIN_TAB}
          title="Login"
          showBell={false}
        />
        <KeyboardAwareScrollView>
          <View style={styles.logoWrap}>
            {/* <Text style={styles.loginTitle}>{roleLabel} Login</Text> */}
            <Image source={Images.logo.mainLogo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.loginForm}>
            <Item>
              <Icon style={styles.iconColor} active name="mail" />
              <Input
                keyboardType="email-address"
                value={email}
                onChangeText={e => {
                  this.onUsernameEditHandle(e)
                }}
                autoCapitalize="none"
                placeholder={Languages.login.buttonLabels.email}
                // onSubmitEditing={this.focusPassword}
                returnKeyType="next"
              />
            </Item>
            {/* <Item>
            <Icon style={styles.iconColor} active name="lock" />
            <Input
              secureTextEntry
              placeholder={Languages.login.buttonLabels.password}
              onChangeText={this.onPasswordEditHandle}
              returnKeyType="go"
              value={password}
            />
          </Item> */}
            {eyeIconShow === false ? (
              <Item>
                <Icon style={styles.iconColor} active name="lock" />
                <Input
                  secureTextEntry
                  placeholder={Languages.login.buttonLabels.password}
                  onChangeText={e => this.onPasswordEditHandle(e)}
                  returnKeyType="go"
                  value={password}
                />
                <Right>
                  <Icon
                    onPress={() => this.setState({eyeIconShow: !eyeIconShow})}
                    style={styles.iconColor}
                    type="MaterialCommunityIcons"
                    active
                    name="eye-off-outline"
                  />
                </Right>
              </Item>
            ) : (
              <Item>
                <Icon style={styles.iconColor} active name="lock" />
                <Input
                  placeholder={Languages.login.buttonLabels.password}
                  onChangeText={this.onPasswordEditHandle}
                  returnKeyType="go"
                  value={password}
                />
                <Right>
                  <Icon
                    onPress={() => this.setState({eyeIconShow: !eyeIconShow})}
                    style={styles.iconColor}
                    type="MaterialCommunityIcons"
                    active
                    name="eye-outline"
                  />
                </Right>
              </Item>
            )}
            {/* <Item style={styles.areYouChef}>
            <Icon style={styles.iconColor} type="MaterialCommunityIcons" active name="chef-hat" />
            <Text>Are you Chef</Text>
            <Right>
              <Switch
                trackColor={{true: Theme.Colors.accent}}
                onChange={() => this.changeRole()}
                value={isChef}
              />
            </Right>
          </Item> */}
          </View>
          <ListItem style={styles.checkboxItem}>
            {/* <CheckBox
              onPress={this.checkBoxHandle}
              color={Theme.Colors.primary}
              checked={checkbox}
              style={styles.checkboxStyle}
            />
            <Body style={styles.noBorder}>
              <Text style={styles.checkBoxText}>
                {Languages.login.buttonLabels.keep_me_logged_in}
              </Text>
            </Body> */}
            <Button transparent small onPress={this.goToForgotPassword}>
              <Text style={styles.forgotPasswordText}>
                {Languages.login.buttonLabels.forgot_password}
              </Text>
            </Button>
          </ListItem>
          <CommonButton
            disabled={isLoading}
            containerStyle={styles.loginBtn}
            btnText={Languages.login.buttonLabels.login}
            onPress={this.onLoginPressHandle}
          />

          {isLoading ? (
            <View style={styles.spinner}>
              <Spinner animating mode="full" />
            </View>
          ) : null}
          <View style={styles.socialBtnView}>
            <Button
              disabled={isLoading}
              iconLeft
              style={styles.googleBtn}
              onPress={() => this.onSocialLoginPressHandle(SOCIAL_LOGIN_TYPE.GOOGLE)}>
              <Icon name="google-plus" type="MaterialCommunityIcons" />
              <Text>{Languages.login.buttonLabels.google}</Text>
            </Button>
            <Button
              disabled={isLoading}
              iconLeft
              style={styles.fbBtn}
              onPress={() => this.onSocialLoginPressHandle(SOCIAL_LOGIN_TYPE.FACEBOOK)}>
              <Icon name="facebook" type="MaterialCommunityIcons" />
              <Text>{Languages.login.buttonLabels.facebook}</Text>
            </Button>
          </View>

          {this.renderSeperator()}
          <View style={styles.dontHaveView}>
            <Text style={styles.dontHaveStyle}>
              {Languages.login.buttonLabels.dont_have_account}
            </Text>
            <Button style={styles.clickHereBtn} transparent onPress={this.onSignUpHandle}>
              <Text style={styles.clickHere}>{Languages.login.buttonLabels.click_here}</Text>
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

export default Login

Login.contextType = AuthContext
