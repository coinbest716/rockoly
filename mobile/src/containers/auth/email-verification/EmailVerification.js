/** @format */

import React, {PureComponent} from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {Text, Input, Button, Item, Icon, Toast, Label} from 'native-base'
import firebase from 'react-native-firebase'
import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal'
import {Header, CommonButton, Spinner} from '@components'
import {RouteNames} from '@navigation'
import {Languages} from '@translations'
import {AuthContext, RegisterService, BasicProfileService} from '@services'
import styles from './styles'

class EmailVerification extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      sendOTP: false,
      emailVerified: false,
      isLoading: true,
    }
  }

  componentDidMount() {
    const {currentUser} = firebase.auth()
    if (currentUser) {
      firebase.auth().currentUser.reload()
    }
    this.loadData()
  }

  loadData = async () => {
    const {getProfile, isChef, isLoggedIn} = this.context
    const profile = await getProfile()
    console.log('profile', profile)

    // try {
    //   const {currentUser} = firebase.auth()
    //   console.log('currentUser', currentUser)
    //   if (currentUser && currentUser.emailVerified) {
    //     this.setState({
    //       emailVerified: true,
    //     })
    //   } else {
    //     this.setState({
    //       emailVerified: false,
    //     })
    //   }
    // } catch (e) {
    //   console.log(e)
    // }

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
    const {props} = this.props
    props.navigation.goBack()
  }

  sendOtp = () => {
    const {email} = this.state
    const {onSaveCallBack} = this.props
    const user = firebase.auth().currentUser
    if (!email) {
      return Toast.show({text: Languages.EmailVerification.emailAlertMessage.email_empty})
    }
    this.setState({isLoading: true})
    user
      .sendEmailVerification()
      .then(() => {
        Toast.show({text: Languages.EmailVerification.emailAlertMessage.otp_sent})
        this.setState({isLoading: false, sendOTP: true})
        if (!onSaveCallBack) {
          setTimeout(() => {
            this.onBack()
          }, 3000)
        }
      })
      .catch(error => {
        console.log('error', error)
        this.setState({isLoading: false})
        return Toast.show({text: Languages.EmailVerification.emailAlertMessage.error_number})
      })
  }

  onSetLocationPress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.SET_LOCATION_SCREEN)
  }

  renderEmail = () => {
    const {email} = this.state
    return (
      <Label style={{marginVertical: 10, alignSelf: 'center', fontSize: 18, fontWeight: 'bold'}}>
        {email}
      </Label>
    )
  }

  confirm = () => {
    const {onSaveCallBack} = this.props
    const {currentUser} = firebase.auth()

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
            } else {
              console.log('alert')
              Alert.alert('Info', 'Please Verify Email')
            }
          }
        })
    }
  }

  onNext = () => {
    const {onSaveCallBack} = this.props
    if (onSaveCallBack) {
      onSaveCallBack()
    }
  }

  renderContent = () => {
    const {currentUser} = firebase.auth()
    const {sendOTP, emailVerified} = this.state
    const {onSaveCallBack} = this.props
    console.log(currentUser)
    return (
      <ScrollView>
        {currentUser.emailVerified === false && (
          <View style={styles.mainView}>
            <Text style={{alignSelf: 'center'}}>{Languages.EmailVerification.labels.sentMsg}</Text>
            {this.renderEmail()}
            {sendOTP === false && (
              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
                <View
                  style={{
                    width: '15%',
                  }}
                />
                <CommonButton
                  btnText={Languages.EmailVerification.labels.send_otp}
                  containerStyle={styles.verifytBtn}
                  onPress={() => {
                    this.sendOtp()
                  }}
                />
                <View
                  style={{
                    width: '15%',
                  }}
                />
              </View>
            )}
            {sendOTP === true && (
              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
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
        {currentUser.emailVerified === true && (
          <View style={styles.mainView}>
            {this.renderEmail()}
            <Text style={styles.centerAlign}>
              {Languages.EmailVerification.labels.verified_msg}
            </Text>
            {onSaveCallBack && (
              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
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
    const {isLoading} = this.state
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
