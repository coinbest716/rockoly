/** @format */

import React, { PureComponent } from 'react'
import { ScrollView, View, Alert } from 'react-native'
import { Text, Input, Button, Item, Icon, Toast, Label } from 'native-base'
import firebase from 'react-native-firebase'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import { Header, CommonButton, Spinner } from '@components'
import { RouteNames } from '@navigation'
import { Languages } from '@translations'
import { AuthContext, RegisterService, BasicProfileService } from '@services'
import styles from './styles'

class EmailVerification extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      sendOTP: false,
      emailVerified: false,
      isLoading: true,
      currentPassword: ''
    }
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    if (currentUser) {
      firebase.auth().currentUser.reload()
    }
    this.loadData()
  }

  loadData = async () => {
    const { getProfile, isChef, isLoggedIn } = this.context
    const profile = await getProfile()
    console.log('profile', profile)

    try {
      const { currentUser } = firebase.auth()
      console.log('currentUser', currentUser)
      if (currentUser && currentUser.emailVerified) {
        this.setState({
          emailVerified: true,
        })
      } else {
        this.setState({
          emailVerified: false,
        })
      }
    } catch (e) {
      console.log(e)
    }

    if (isLoggedIn) {
      const email = isChef ? profile.chefEmail : profile.customerEmail

      if (email) {
        this.setState({
          email,
          // this is common for chef and customer
          isLoading: false,
        })
      } else {
        this.setState({
          isLoading: false,
        })
      }
    }
  }

  onBack = () => {
    const { props } = this.props
    props.navigation.goBack()
  }

  reauthenticate = (currentPassword) => {
    let user = firebase.auth().currentUser;
    let cred = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  updateEmail = () => {
    const { currentPassword, email } = this.state
    const { currentUser } = firebase.auth()
    if (!currentPassword || !email) {
      return Toast.show({ text: 'Please enter both email and current password' })
    }

    RegisterService.checkEmailAndMobileNoExists(email, null)
      .then(res => {
        if (res) {
          if (currentPassword && currentPassword.length < 6) {
            Alert.alert('Info', 'Password must contain atleast 6 characters')
            return
          }
          this.reauthenticate(currentPassword).then(() => {
            let user = firebase.auth().currentUser;
            user.updateEmail(email).then(() => {
              this.sendOtp()
            }).catch((err) => {
              if (err.message === 'The email address is badly formatted.') {
                Alert.alert('Error', 'Email address is invalid');
              } else {
                Alert.alert('Error', err.message);
              }
            });
          }).catch((error) => {
            if (error.message === 'The password is invalid or the user does not have a password.') {
              Alert.alert('Error', 'The password is invalid');
            } else {
              Alert.alert('Error', error.message);
            }
          });
        }
      })
      .catch(e => {
        if (e) {
          if (e === 'EMAIL_IS_ALREADY_EXISTS' || e == 'GraphQL error: EMAIL_IS_ALREADY_EXISTS') {
            Alert.alert(
              Languages.EmailVerification.title,
              Languages.EmailVerification.emailAlertMessage.number_already_exist
            )
          } else {
            Alert.alert(
              Languages.EmailVerification.title,
              Languages.EmailVerification.emailAlertMessage.verify_try_again
            )
          }
        }
      })
  }

  sendOtp = () => {
    const { email } = this.state
    const { onSaveCallBack } = this.props
    const user = firebase.auth().currentUser
    const { currentUser, userRole } = this.context

    if (!email) {
      return Toast.show({ text: Languages.EmailVerification.emailAlertMessage.email_empty })
    }
    this.setState({ isLoading: true })
    user
      .sendEmailVerification()
      .then(() => {
        Toast.show({ text: Languages.EmailVerification.emailAlertMessage.otp_sent })
        this.setState({ isLoading: false, sendOTP: true })
        // if (!onSaveCallBack) {
        //   setTimeout(() => {
        //     this.onBack()
        //   }, 3000)
        // }
        
        if (!onSaveCallBack) {
         
          let id = ''

          if (currentUser) {
            if (currentUser.chefId !== undefined &&
              currentUser.chefId !== null &&
              currentUser.chefId !== '') {
              id = currentUser.chefId
            } else {
              id = currentUser.customerId
            }
          }
          RegisterService.gqlChangeEmail(email, id, userRole)
            .then(result => {
              
              if (result) {
                BasicProfileService.emitProfileEvent()
              }
            })
            .catch((err) => {
              Alert.alert('Error', err.message)
            })
        }
      })
      .catch(error => {
        console.log('error', error)
        this.setState({ isLoading: false })
        return Toast.show({ text: Languages.EmailVerification.emailAlertMessage.error_number })
      })
  }

  onSetLocationPress = () => {
    const { navigation } = this.props
    navigation.navigate(RouteNames.SET_LOCATION_SCREEN)
  }

  onChangeEmailId = email => {
    this.setState({
      email,
    })
  }

  renderEmail = () => {
    const { email } = this.state
    return (
      <Label style={{ marginVertical: 10, alignSelf: 'center', fontSize: 18, fontWeight: 'bold' }}>
        {email}
      </Label>
    )
  }

  renderChangeEmail = () => {
    const { email, currentPassword, sendOTP } = this.state
    return (
      <View>
        <Item style={{ marginVertical: 10 }}>
          <Input
            placeholder={Languages.EmailVerification.labels.emailPlaceholder}
            onChangeText={this.onChangeEmailId}
            value={email}
            disabled={sendOTP === true ? true :  false}
          />
        </Item>
        <Item style={{ marginVertical: 10 }}>
          <Input
            placeholder={Languages.EmailVerification.labels.currentPassword}
            onChangeText={this.onChangeCurrentPassword}
            value={currentPassword}
            disabled={sendOTP === true ? true :  false}
          />
        </Item>
      </View>


    )
  }

  onChangeCurrentPassword = currentPassword => {
    this.setState({ currentPassword })
  }

  confirm = () => {
    const { onSaveCallBack } = this.props
    const { currentUser } = firebase.auth()

    if (currentUser) {
      firebase
        .auth()
        .currentUser.reload()
        .then(res => {
          const user = firebase.auth().currentUser
          console.log('firbaseUser', res, user)
          if (user) {
            if (user.emailVerified && user.emailVerified === true) {
              console.log(user.emailVerified)
              if (onSaveCallBack) {
                console.log('saveback')
                onSaveCallBack()
              }
              if(!onSaveCallBack) {
                Toast.show({ text: Languages.EmailVerification.emailAlertMessage.email_verified })
                setTimeout(() => {
                  this.onBack()
                }, 3000)
              }
            } else {
              console.log('alert')
              Alert.alert('Info', 'Please Verify Email')
            }
          }
        })
        .catch((err) => {
          Alert.alert('err', err.message)
        })
    }
  }

  onNext = () => {
    const { onSaveCallBack } = this.props
    if (onSaveCallBack) {
      onSaveCallBack()
    }
  }


  onChangeEmail = () => {
    this.setState({
      emailVerified: false,
    })
  }

  renderContent = () => {
    const { currentUser } = firebase.auth()
    const { sendOTP, emailVerified } = this.state
    const { onSaveCallBack } = this.props
    console.log(currentUser)
    return (
      <ScrollView>
        {emailVerified === false && (
          <View style={styles.mainView}>
            <Text style={{ alignSelf: 'center' }}>{Languages.EmailVerification.labels.sentMsg}</Text>
            {onSaveCallBack ?
              this.renderEmail()
              :
              this.renderChangeEmail()
            }
            {sendOTP === false && (
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                <View
                  style={{
                    width: '15%',
                  }}
                />
                {onSaveCallBack ?
                  <CommonButton
                    btnText={Languages.EmailVerification.labels.send_otp}
                    containerStyle={styles.verifytBtn}
                    onPress={() => {
                      this.sendOtp()
                    }}
                  />
                  :
                  <CommonButton
                    btnText={Languages.EmailVerification.labels.send_otp}
                    containerStyle={styles.verifytBtn}
                    onPress={() => {
                      this.updateEmail()
                    }}
                  />

                }

                <View
                  style={{
                    width: '15%',
                  }}
                />
              </View>
            )}
            {sendOTP === true && (
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                <View
                  style={{
                    width: '15%',
                  }}
                />
                <CommonButton
                  btnText={Languages.EmailVerification.labels.confirm}
                  containerStyle={styles.verifytBtn}
                  onPress={() => {
                    this.confirm()
                  }}
                />
                <View
                  style={{
                    width: '15%',
                  }}
                />
              </View>
            )}
          </View>
        )}
        {emailVerified === true && (
          <View style={styles.mainView}>
            {this.renderEmail()}
            <Text style={styles.centerAlign}>
              {Languages.EmailVerification.labels.verified_msg}
            </Text>
            {!onSaveCallBack && (
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                <View
                  style={{
                    width: '10%',
                  }}
                />
                <CommonButton
                  btnText={Languages.OTPVerification.labels.change_email}
                  containerStyle={styles.changeMOBButton}
                  onPress={this.onChangeEmail}
                />
                <View
                  style={{
                    width: '10%',
                  }}
                />
                {/* <Icon
                style={styles.arrowRight}
                type="MaterialCommunityIcons"
                name="arrow-right"
                onPress={this.onSetLocationPress}
              /> */}
              </View>
            )}
            {onSaveCallBack && (
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                <View
                  style={{
                    width: '15%',
                  }}
                />
                <CommonButton
                  btnText={Languages.EmailVerification.labels.next}
                  containerStyle={styles.verifytBtn}
                  onPress={() => {
                    this.onNext()
                  }}
                />
                <View
                  style={{
                    width: '15%',
                  }}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    )
  }

  render() {
    const { isLoading } = this.state
    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.alignScreenCenter}>
            <Spinner animating mode="full" />
          </View>
        ) : (
            this.renderContent()
          )}
      </View>
    )
  }
}

EmailVerification.contextType = AuthContext

export default EmailVerification
