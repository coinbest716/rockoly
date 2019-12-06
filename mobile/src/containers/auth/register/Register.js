/** @format */

import React, {PureComponent} from 'react'
import {View, Alert, Image} from 'react-native'

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Text, Item, Icon, Input, Button, Right, Toast} from 'native-base'
import CountryPicker from 'react-native-country-picker-modal'
import firebase from 'react-native-firebase'
import {Header, CommonButton, Spinner} from '@components'
import {Images} from '@images'
import {RegisterService, LoginService, SOCIAL_LOGIN_TYPE, AuthContext} from '@services'
import styles from './styles'
import {RouteNames} from '@navigation'
import {Languages} from '@translations'
import {isEmailValid} from '@utils'

class Register extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      showEmailInputOnly: false,
      passwordMismatch: false,
      passwordLengthError: false,
      role: '',
      validEmail: true,
      cca2: 'US',
      callingCode: '1',
      callingCodeWithPlus: '+1',

      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',

      mobileNumber: '',
      isLoading: false,
      // isDateTimePickerVisible: false,
      // isChef: false,
      eyeIconPasswordShow: false,
      eyeIconConfirmPasswordShow: false,
    }

    this.onFirstNameEditHandle = firstName => this.setState({firstName})
    this.onLastNameEditHandle = lastName => this.setState({lastName})
    this.onEmailEditHandle = email => {
      let str = email
      if (str && str.length) {
        str = email.toLowerCase()
      }

      this.setState({email: str, validEmail: isEmailValid(str)})
    }
    this.onPasswordEditHandle = password => {
      let passwordLengthError = false
      if (!password || (password && password.length < 6)) {
        passwordLengthError = true
      }
      this.setState({password, passwordLengthError})
    }
    this.onConfirmPasswordEditHandle = confirmPassword => {
      const {password} = this.state
      this.setState({confirmPassword, passwordMismatch: password !== confirmPassword})
    }

    this.onMobileNumberEditHandle = mobileNumber => this.setState({mobileNumber})
  }

  componentDidMount() {
    try {
      const {navigation} = this.props

      if (
        navigation &&
        navigation.state &&
        navigation.state.params &&
        navigation.state.params.role
      ) {
        this.setState({
          role: navigation.state.params.role,
        })
      }
    } catch (e) {}
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true})
  }

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false})
  }

  handleDatePicked = dob => {
    // const date = new Date(dob)
    // const tempDate = `${(
    //   date.getMonth() + 1
    // ).toString()}/${date.getDate().toString()}/${date.getFullYear().toString()}`
    // // const tempMonth = (date.getMonth() + 1).toString()
    // // const tempYear = date.getFullYear().toString()
    // this.setState({dateOfBirthToDisplay: tempDate, dateOfBirth: dob})
    // this.hideDateTimePicker()
  }

  // chefReset = () => {
  //   const {navigation} = this.props
  //   AsyncStorage.setItem(STORAGE_KEY_NAME.CHEF_INTRO, JSON.stringify(false))
  //     .then(() => {
  //       setTimeout(() => {
  //         ResetAction(navigation, RouteNames.CHEF_SWITCH)
  //       }, 2000)
  //     })
  //     .catch(() => {
  //       ResetAction(navigation, RouteNames.CHEF_SWITCH)
  //     })
  // }

  onRegisterPressHandle = () => {
    const {
      firstName,
      lastName,
      email,
      validEmail,
      password,
      confirmPassword,
      mobileNumber,
      cca2,
      callingCode,
      role,
    } = this.state

    if (
      !firstName ||
      !lastName ||
      !email ||
      !validEmail ||
      !password ||
      !confirmPassword ||
      !password === confirmPassword ||
      !mobileNumber
    ) {
      Alert.alert(
        Languages.register.title,
        Languages.register.reg_alrt_msg.fill_form,
        [{text: Languages.register.buttonLabels.ok, onPress: () => console.log('OK Pressed')}],
        {cancelable: false}
      )
      return
    }

    // check email/mobile number already exists

    RegisterService.checkEmailAndMobileNoExists(email, `+${callingCode}${mobileNumber}`)
      .then(async res => {
        if (res) {
          const {updateCurrentUser} = this.context
          const {navigation} = this.props

          this.setLoading(true)
          if (firebase.auth().currentUser) {
            const token = await LoginService.getIdToken()
            if (token) {
              const userData = {
                firstname: firstName,
                lastname: lastName,
                mobileNumber: `${mobileNumber}`,
                dob: null,
                mobileCountryCode: `+${callingCode}`,
              }
              RegisterService.gqlRegister(token, role, userData)
                .then(async gqlRes => {
                  LoginService.onLogin({role, gqlRes, updateCurrentUser, navigation})
                })
                .catch(e => {
                  console.log(e)
                  this.registerError()
                })
            }
          } else {
            RegisterService.firebaseEmailRegister(email, password)
              .then(async firebaseCurrentUser => {
                if (
                  firebaseCurrentUser &&
                  firebaseCurrentUser.additionalUserInfo &&
                  firebaseCurrentUser.user
                ) {
                  // if (firebaseCurrentUser.additionalUserInfo.isNewUser === false) {
                  //   firebase.auth().signOut()
                  //   this.registerError(
                  //     Languages.register.reg_alrt_msg.reg_error,
                  //     Languages.register.reg_alrt_msg.account_email_exist
                  //   )
                  // } else
                  if (firebaseCurrentUser.additionalUserInfo.isNewUser === true) {
                    const token = await LoginService.getIdToken()
                    if (token) {
                      const userData = {
                        firstname: firstName,
                        lastname: lastName,
                        mobileNumber: `${mobileNumber}`,
                        dob: null,
                        mobileCountryCode: `+${callingCode}`,
                      }
                      RegisterService.gqlRegister(token, role, userData)
                        .then(async gqlRes => {
                          LoginService.onLogin({role, gqlRes, updateCurrentUser, navigation})
                        })
                        .catch(e => {
                          console.log(e)
                          this.registerError()
                        })
                    }
                  }
                }
              })
              .catch(e => {
                if (e && e.code === 'auth/email-already-in-use') {
                  this.registerError(null, Languages.register.reg_alrt_msg.mail_already_exist)
                } else if (e && e.code === 'auth/invalid-email') {
                  this.registerError(null, Languages.register.reg_alrt_msg.invalid_email)
                } else {
                  this.registerError()
                }
              })
          }
        }
      })
      .catch(e => {
        if (e) {
          if (e === 'EMAIL_IS_ALREADY_EXISTS') {
            this.registerError(
              Languages.register.title,
              Languages.register.reg_alrt_msg.mail_already_exist
            )
          } else if (e === 'MOBILE_NO_IS_ALREADY_EXISTS') {
            this.registerError(
              Languages.register.title,
              Languages.register.reg_alrt_msg.num_already_exist
            )
          } else if (e === 'EMAIL_AND_MOBILE_NO_IS_ALREADY_EXISTS') {
            this.registerError(
              Languages.register.title,
              Languages.register.reg_alrt_msg.email_num_exist
            )
          } else {
            this.registerError()
          }
        } else if (e && e.message) {
          if (e.message == 'GraphQL error: EMAIL_IS_ALREADY_EXISTS') {
            this.registerError(
              Languages.register.title,
              Languages.register.reg_alrt_msg.mail_already_exist
            )
          } else if (e.message == 'GraphQL error: MOBILE_NO_IS_ALREADY_EXISTS') {
            this.registerError(
              Languages.register.title,
              Languages.register.reg_alrt_msg.num_already_exist
            )
          } else if (e.message == 'GraphQL error: EMAIL_AND_MOBILE_NO_IS_ALREADY_EXISTS') {
            this.registerError(
              Languages.register.title,
              Languages.register.reg_alrt_msg.email_num_exist
            )
          } else {
            this.registerError()
          }
        } else {
          this.registerError()
        }
      })
  }

  setLoading = isLoading => {
    this.setState({
      isLoading,
    })
  }

  registerError = (title, des) => {
    if (!title) {
      title = Languages.register.title
    }
    if (!des) {
      des = Languages.register.reg_alrt_msg.try_again
    }

    this.setLoading(false)
    Alert.alert(title, des, [{text: Languages.register.buttonLabels.ok, onPress: () => {}}], {
      cancelable: false,
    })
  }

  renderSeperator = () => {
    return (
      <View style={styles.separatorWrap}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>{Languages.register.buttonLabels.or}</Text>
        <View style={styles.separator} />
      </View>
    )
  }

  goToLogin = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.LOGIN_SCREEN)
  }

  // changeRole = () => {
  //   const {isChef} = this.state
  //   this.setState({
  //     isChef: !isChef,
  //   })
  // }

  socialContinue = async () => {
    const {type, role, email} = this.state
    const {updateCurrentUser} = this.context
    const {navigation} = this.props
    const {currentUser} = firebase.auth()
    const token = await LoginService.getIdToken()
    if (token) {
      let firstName = ``
      let lastName = ``
      if (type === SOCIAL_LOGIN_TYPE.GOOGLE) {
        // google profile
        firstName = currentUser.additionalUserInfo
          ? currentUser.additionalUserInfo.profile.given_name
          : ''
        lastName = currentUser.additionalUserInfo
          ? currentUser.additionalUserInfo.profile.family_name
          : ''
      } else {
        // facebook profile
        firstName = currentUser.additionalUserInfo
          ? currentUser.additionalUserInfo.profile.first_name
          : ''
        lastName = currentUser.additionalUserInfo
          ? currentUser.additionalUserInfo.profile.last_name
          : ''
      }

      // profile.picture for getting the google profile pic
      const userData = {
        firstname: firstName,
        lastname: lastName,
        mobileNumber: null,
        dob: null,
        mobileCountryCode: null,
      }
      if (email) {
        userData.email = email
      }
      RegisterService.gqlRegister(token, role, userData)
        .then(async gqlRes => {
          Toast.show({
            text: Languages.register.reg_alrt_msg.reg_success,
            duration: 3000,
          })
          LoginService.onLogin({role, gqlRes, updateCurrentUser, navigation})
        })
        .catch(e => {
          this.registerError()
        })
    } else {
      this.registerError()
    }
  }

  onSocialRegisterPressHandle = async type => {
    const {role} = this.state

    this.setLoading(true)
    const socialRegister =
      (await type) === SOCIAL_LOGIN_TYPE.GOOGLE
        ? LoginService.googleLogin()
        : LoginService.facebookLogin()

    socialRegister
      .then(async currentUser => {
        if (currentUser && currentUser.additionalUserInfo && currentUser.user) {
          if (currentUser.additionalUserInfo.isNewUser === false) {
            firebase.auth().signOut()
            this.registerError(
              Languages.register.reg_alrt_msg.reg_error,
              Languages.register.reg_alrt_msg.account_exist
            )
          } else if (currentUser.additionalUserInfo.isNewUser === true) {
            if (currentUser.user.email === null) {
              // get email id from user
              this.setLoading(false)
              this.setState({
                showEmailInputOnly: true,
                type,
                role,
              })
            } else {
              this.setState(
                {
                  type,
                  role,
                },
                () => {
                  this.socialContinue()
                }
              )
            }
          } else {
            this.registerError()
          }
        } else {
          this.registerError()
        }
      })
      .catch(e => {
        console.log('debugging error', e)
        if (e && e.code && e.code === 'auth/account-exists-with-different-credential') {
          this.registerError(null, Languages.register.reg_alrt_msg.different_credential)
        } else {
          this.registerError()
        }
      })
  }

  onFbRegister = () => {
    const {email, validEmail} = this.state

    if (!email || !validEmail) {
      Alert.alert(
        Languages.register.title,
        Languages.register.reg_alrt_msg.enter_email,
        [{text: Languages.register.buttonLabels.ok, onPress: () => console.log('OK Pressed')}],
        {cancelable: false}
      )
      return
    }

    // check email/mobile number already exists

    RegisterService.checkEmailAndMobileNoExists(email, null)
      .then(res => {
        if (res) {
          const {currentUser} = firebase.auth()
          currentUser
            .updateEmail(email)
            .then(() => {
              this.setLoading(true)
              this.socialContinue()
            })
            .catch(() => {
              this.registerError()
            })
        } else {
          this.registerError()
        }
      })
      .catch(e => {
        if (e && e.message) {
          if (e.message === 'GraphQL error: Email is already exists') {
            this.registerError(
              Languages.register.title,
              Languages.register.reg_alrt_msg.mail_already_exist
            )
          }
        } else {
          this.registerError()
        }
      })
  }

  emailOnlyView = () => {
    const {email, validEmail, isLoading} = this.state
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <Header showBack title={Languages.register.title} showBell={false} />
        <View style={styles.logoWrap}>
          <Image source={Images.logo.mainLogo} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.regView}>
          <View style={styles.emailView}>
            <Item>
              <Icon style={styles.iconColor} name="mail" />
              <Input
                autoCapitalize="none"
                onChangeText={this.onEmailEditHandle}
                keyboardType="email-address"
                value={email}
                placeholder={Languages.register.reg_form_label.email}
              />
            </Item>
            <Text style={styles.passwordInfo}>
              {Languages.register.reg_form_label.enter_email_info}
            </Text>
            {!validEmail ? (
              <Text style={styles.errorMessage}>
                {Languages.register.reg_form_label.inavl_email}
              </Text>
            ) : null}
          </View>
          <CommonButton
            containerStyle={styles.registerBtnFB}
            btnText={Languages.register.buttonLabels.register}
            onPress={this.onFbRegister}
          />
          {isLoading ? (
            <View style={styles.spinner}>
              <Spinner animating mode="full" />
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    )
  }

  titleCase = string => {
    if (!string || string.length === 0) {
      return ''
    }
    const sentence = string.toLowerCase().split(' ')
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
    }
    return sentence.join(' ')
  }

  selectCountry(value) {
    const countryCode = `+${value.callingCode}`
    this.setState({
      cca2: value.cca2,
      callingCodeWithPlus: countryCode,
      callingCode: value.callingCode,
    })
  }

  render() {
    const {
      // isDateTimePickerVisible,
      // dateOfBirthToDisplay,
      showEmailInputOnly,
      firstName,
      lastName,
      email,
      mobileNumber,
      confirmPassword,
      password,
      cca2,
      callingCodeWithPlus,
      isLoading,
      passwordMismatch,
      validEmail,
      passwordLengthError,
      eyeIconPasswordShow,
      eyeIconConfirmPasswordShow,
      role,
    } = this.state

    if (showEmailInputOnly) {
      return this.emailOnlyView()
    }

    return (
      <View style={styles.container}>
        <Header
          showBack
          title={`${role ? this.titleCase(role) : ''} ${Languages.register.title}`}
          showBell={false}
        />
        <KeyboardAwareScrollView>
          <View style={styles.logoWrap}>
            {/* <Text style={styles.loginTitle}>{roleLabel} Login</Text> */}
            <Image source={Images.logo.mainLogo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.regView}>
            <Item>
              <Icon style={styles.iconColor} type="MaterialCommunityIcons" name="account" />
              <Input
                onChangeText={this.onFirstNameEditHandle}
                autoCapitalize="words"
                value={firstName}
                placeholder={Languages.register.reg_form_label.firstName}
              />
            </Item>
            <Item>
              <Icon style={styles.iconColor} type="MaterialCommunityIcons" name="account" />
              <Input
                onChangeText={this.onLastNameEditHandle}
                autoCapitalize="words"
                value={lastName}
                placeholder={Languages.register.reg_form_label.lastName}
              />
            </Item>
            {/* <Item>
            <Icon name="calendar" />
            <Button transparent onPress={this.showDateTimePicker}>
              <Text style={styles.dateOfBirth}>
                {dateOfBirthToDisplay !== null
                  ? dateOfBirthToDisplay
                  : Languages.register.reg_form_label.dateOfBirth}
              </Text>
              <Icon active style={styles.dobIconColor} name="arrow-forward" />
            </Button>
            <DateTimePicker
              isVisible={isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />
          </Item> */}
            <View style={styles.emailView}>
              <Item>
                <Icon style={styles.iconColor} name="mail" />
                <Input
                  autoCapitalize="none"
                  onChangeText={this.onEmailEditHandle}
                  keyboardType="email-address"
                  value={email}
                  placeholder={Languages.register.reg_form_label.email}
                />
              </Item>
              {!validEmail ? (
                <Text style={styles.errorMessage}>
                  {Languages.register.reg_form_label.inavl_email}
                </Text>
              ) : null}
            </View>
            {eyeIconPasswordShow === false ? (
              <Item>
                <Icon style={styles.iconColor} name="lock" />
                <Input
                  onChangeText={this.onPasswordEditHandle}
                  secureTextEntry
                  value={password}
                  placeholder={Languages.register.reg_form_label.password}
                />
                <Right>
                  <Icon
                    onPress={() => this.setState({eyeIconPasswordShow: !eyeIconPasswordShow})}
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
                  value={password}
                  placeholder={Languages.register.reg_form_label.password}
                />
                <Right>
                  <Icon
                    onPress={() => this.setState({eyeIconPasswordShow: !eyeIconPasswordShow})}
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
                  placeholder={Languages.register.reg_form_label.confirmPassword}
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
                  placeholder={Languages.register.reg_form_label.confirmPassword}
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
            {passwordMismatch && password !== confirmPassword && (
              <Text style={styles.passwordError}>
                {Languages.register.reg_form_label.password_not_match}
              </Text>
            )}
            <Text style={passwordLengthError ? styles.passwordErrorInfo : styles.passwordInfo}>
              {Languages.register.reg_form_label.password_info}
            </Text>
            <Item>
              <CountryPicker
                filterable
                closeable
                onChange={value => {
                  this.selectCountry(value)
                }}
                cca2={cca2}
                translation="eng"
                showCallingCode
                ref={comp => (this.countryPickerRef = comp)}
              />
              <Button
                transparent
                onPress={() => {
                  this.countryPickerRef.openModal()
                }}>
                <Text style={styles.callingCode}>{callingCodeWithPlus}</Text>
              </Button>

              <Input
                value={mobileNumber}
                keyboardType="phone-pad"
                placeholder={Languages.register.reg_form_label.mobileNumber}
                onChangeText={this.onMobileNumberEditHandle}
              />
            </Item>
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
          <CommonButton
            disabled={isLoading}
            containerStyle={styles.registerBtn}
            btnText={Languages.register.buttonLabels.register}
            onPress={this.onRegisterPressHandle}
          />
          {isLoading ? (
            <View style={styles.spinner}>
              <Spinner animating mode="full" />
            </View>
          ) : null}
          <View style={styles.socialBtnView}>
            <Button
              iconLeft
              style={styles.googleBtn}
              onPress={() => this.onSocialRegisterPressHandle(SOCIAL_LOGIN_TYPE.GOOGLE)}>
              <Icon name="google-plus" type="MaterialCommunityIcons" />
              <Text>{Languages.register.buttonLabels.google}</Text>
            </Button>
            <Button
              iconLeft
              style={styles.fbBtn}
              onPress={() => this.onSocialRegisterPressHandle(SOCIAL_LOGIN_TYPE.FACEBOOK)}>
              <Icon name="facebook" type="MaterialCommunityIcons" />
              <Text>{Languages.register.buttonLabels.facebook}</Text>
            </Button>
          </View>
          {this.renderSeperator()}
          <View style={styles.dontHaveView}>
            <Text style={styles.dontHaveStyle}>
              {Languages.register.reg_form_label.already_account}
            </Text>
            <Button style={styles.clickHereBtn} transparent onPress={this.goToLogin}>
              <Text style={styles.clickHere}>{Languages.register.reg_form_label.click_here}</Text>
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

Register.contextType = AuthContext

export default Register
