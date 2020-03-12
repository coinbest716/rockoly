/** @format */

import React, {PureComponent} from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {Text, Input, Button, Item, Icon, Toast} from 'native-base'
import firebase from 'react-native-firebase'
import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal'
import {Header, CommonButton, Spinner} from '@components'
import {RouteNames} from '@navigation'
import {Languages} from '@translations'
import {AuthContext, RegisterService, BasicProfileService} from '@services'
import styles from './styles'

class OTPVerification extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      OTP: null,
      phoneAuthSnapshot: {},
      userMobileNumber: null,
      mobileNumber: null,
      cca2: 'US',
      callingCode: '1',
      callingCodeWithPlus: '+1',
      sendOTP: false,
      isMobileVerified: false,
      mobileNoWithCountryCode: null,
      isLoading: true,
      isAutoVerified: false,
    }
  }

  componentDidMount() {
    // for unlinking the phone debugging purpose
    // try {
    //   const {currentUser} = firebase.auth()
    //   currentUser
    //     .unlink('phone')
    //     .then(res => {
    //       console.log('debugging res', res)
    //     })
    //     .catch(e => {
    //       console.log('debugging Error', e)
    //     })
    // } catch (e) {
    //   console.log('debugging e', e)
    // }

    this.loadData()
  }

  loadData = async () => {
    const {getProfile, isChef, isLoggedIn} = this.context
    const profile = await getProfile()

    try {
      const {currentUser} = firebase.auth()
      if (currentUser && currentUser.phoneNumber) {
        this.setState({
          isMobileVerified: true,
        })
      } else {
        this.setState({
          isMobileVerified: false,
        })
      }
    } catch (e) {
      console.log(e)
    }

    if (isLoggedIn) {
      const mob = isChef ? profile.chefMobileNumber : profile.customerMobileNumber
      const callingCodeWithPlus = isChef
        ? profile.chefMobileCountryCode
        : profile.customerMobileCountryCode
      if (mob) {
        const countryData = getAllCountries()
          .filter(country => {
            return `+${country.callingCode}` === callingCodeWithPlus
          })
          .pop()
        const cca2 = countryData && countryData.cca2 ? countryData.cca2 : 'US'
        const callingCode = countryData && countryData.callingCode ? countryData.callingCode : '1'
        this.setState({
          mobileNumber: mob,
          callingCodeWithPlus,
          callingCode,
          cca2,
          // this is common for chef and customer
          userMobileNumber: profile.mobileNoWithCountryCode,
          mobileNoWithCountryCode: profile.mobileNoWithCountryCode,
          isLoading: false,
        })
      } else {
        this.setState({
          isLoading: false,
        })
      }
    }
  }

  continueSendOTP = () => {
    const {mobileNumber, callingCode} = this.state
    this.setState({
      isLoading: true,
    })

    return firebase
      .auth()
      .verifyPhoneNumber(`+${callingCode}${mobileNumber}`)
      .on(
        'state_changed',
        phoneAuthSnapshot => {
          switch (phoneAuthSnapshot.state) {
            case firebase.auth.PhoneAuthState.CODE_SENT: {
              // display toast otp sent
              this.setState({phoneAuthSnapshot, sendOTP: true, isLoading: false})

              Toast.show({
                text: Languages.OTPVerification.otpAlertMessage.otp_sent,
                duration: 3000,
              })

              break
            }
            case firebase.auth.PhoneAuthState.ERROR: {
              this.setState({
                isLoading: false,
              })
              Alert.alert(
                Languages.OTPVerification.title,
                Languages.OTPVerification.otpAlertMessage.otp_not_sent
              )
              break
            }
            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
              break
            case 'verified':
              this.setState(
                {
                  phoneAuthSnapshot,
                  isLoading: true,
                  isAutoVerified: true,
                },
                () => {
                  this.checkProvider()
                }
              )
              break
            case firebase.auth.PhoneAuthState.AUTO_VERIFIED: {
              // display toast otp error and update mobile number
              const {code} = phoneAuthSnapshot
              if (code) {
                this.setState(
                  {
                    phoneAuthSnapshot,
                    isLoading: true,
                    OTP: code,
                    isAutoVerified: true,
                  },
                  () => {
                    this.checkProvider()
                  }
                )
              } else {
                this.setState({
                  isLoading: false,
                })
              }
              break
            }
            default:
              break
          }
        },
        error => {
          console.log('debugging e', error)
        },
        phoneAuthSnapshot => {
          console.log(phoneAuthSnapshot)
        }
      )
  }

  showError = () => {
    this.setState({
      isLoading: false,
    })
    Alert.alert(
      Languages.OTPVerification.title,
      Languages.OTPVerification.otpAlertMessage.could_not_verify
    )
  }

  sendOtp = () => {
    const {userMobileNumber, mobileNumber, callingCode} = this.state
    const {currentUser} = firebase.auth()
    if (!mobileNumber || !callingCode) {
      return Toast.show({text: Languages.OTPVerification.otpAlertMessage.number_empty})
    }
    if (userMobileNumber === `+${callingCode}${mobileNumber}`) {
      if (
        currentUser &&
        currentUser.phoneNumber &&
        currentUser.phoneNumber === `+${callingCode}${mobileNumber}`
      ) {
        return Toast.show({text: Languages.OTPVerification.otpAlertMessage.already_verified})
      }
      return this.continueSendOTP()
    }
    return RegisterService.checkEmailAndMobileNoExists(null, `+${callingCode}${mobileNumber}`)
      .then(res => {
        if (res) {
          this.continueSendOTP()
        }
      })
      .catch(e => {
        if (e && e.message && e.message === 'MOBILE_NO_IS_ALREADY_EXISTS') {
          Alert.alert(
            Languages.OTPVerification.title,
            Languages.OTPVerification.otpAlertMessage.number_already_exist
          )
        } else if (e === 'MOBILE_NO_IS_ALREADY_EXISTS') {
          Alert.alert(
            Languages.OTPVerification.title,
            Languages.OTPVerification.otpAlertMessage.number_already_exist
          )
        } else {
          Alert.alert(
            Languages.OTPVerification.title,
            Languages.OTPVerification.otpAlertMessage.verify_try_again
          )
        }
      })
  }

  showVerifiedStatus = async flag => {
    const {mobileNumber, callingCode} = this.state
    const {isChef, currentUser, getProfile} = this.context
    const {onSaveCallBack} = this.props
    const profile = await getProfile()
    const firstName = isChef ? profile.chefFirstName : profile.customerFirstName
    RegisterService.saveBasicDetails(
      {isChef, mobileNumber, callingCode: `+${callingCode}`, firstName},
      currentUser
    )
      .then(res => {
        if (res) {
          BasicProfileService.emitProfileEvent()
          Toast.show({
            text: flag
              ? Languages.OTPVerification.otpAlertMessage.number_verified_auto
              : Languages.OTPVerification.otpAlertMessage.number_verified,
            duration: 5000,
          })
          if (onSaveCallBack) {
            onSaveCallBack()
          }
          this.loadData()
        }
      })
      .catch(e => {
        this.setState({
          isLoading: false,
        })
        Alert.alert(
          Languages.OTPVerification.otpAlertMessage.error,
          Languages.OTPVerification.otpAlertMessage.error_number
        )
      })
  }

  onChangeOTP = OTP => {
    this.setState({
      OTP,
    })
  }

  onChangeMobileNumber = mobileNumber => {
    this.setState({
      mobileNumber,
    })
  }

  onChangeOtherMobileNumber = () => {
    this.setState({
      isMobileVerified: false,
    })
  }

  verifyPhoneNumber = () => {
    const {OTP, phoneAuthSnapshot, isAutoVerified} = this.state
    if (phoneAuthSnapshot && OTP && OTP.length) {
      this.setState({
        isLoading: true,
      })
      const credential = firebase.auth.PhoneAuthProvider.credential(
        phoneAuthSnapshot.verificationId,
        OTP
      )
      const {currentUser} = firebase.auth()
      if (currentUser) {
        currentUser
          .linkWithCredential(credential)
          .then(() => {
            this.showVerifiedStatus(isAutoVerified)
          })
          .catch(e => {
            console.log('Error otp verification', e)
            this.showError()
          })
      } else {
        console.log('ERROR no user logged in ')
        this.showError()
      }
    } else if (isAutoVerified && (!OTP || OTP.length === 0)) {
      const credential = firebase.auth.PhoneAuthProvider.credential(null, null)
      const {currentUser} = firebase.auth()
      if (currentUser) {
        currentUser
          .linkWithCredential(credential)
          .then(() => {
            this.showVerifiedStatus(isAutoVerified)
          })
          .catch(e => {
            console.log('Error otp verification', e)
            this.showError()
          })
      } else {
        this.showError()
        console.log('ERROR no user logged in ')
      }
    } else {
      this.setState({
        isLoading: false,
      })
      Alert.alert(
        Languages.OTPVerification.otpAlertMessage.error,
        Languages.OTPVerification.otpAlertMessage.enter_otp
      )
      console.log('ERROR no user logged in ')
    }
  }

  checkProvider = () => {
    const {currentUser} = firebase.auth()
    if (currentUser && currentUser.phoneNumber) {
      currentUser
        .unlink('phone')
        .then(() => {
          this.verifyPhoneNumber()
        })
        .catch(error => {
          this.verifyPhoneNumber()
        })
    } else {
      this.verifyPhoneNumber()
    }
  }

  onSetLocationPress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.SET_LOCATION_SCREEN)
  }

  selectCountry(value) {
    const callingCodeWithPlus = `+${value.callingCode}`
    this.setState({
      cca2: value.cca2,
      callingCodeWithPlus,
      callingCode: value.callingCode,
    })
  }

  renderMobileNumber = () => {
    const {mobileNumber, callingCodeWithPlus, cca2} = this.state
    return (
      <Item style={styles.otpInput}>
        <CountryPicker
          filterable
          withAlphaFilter
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
          placeholder={Languages.OTPVerification.labels.mobile_number}
          onChangeText={this.onChangeMobileNumber}
          value={mobileNumber}
          keyboardType="phone-pad"
        />
      </Item>
    )
  }

  onNext = () => {
    const {onSaveCallBack} = this.props
    if (onSaveCallBack) {
      onSaveCallBack()
    }
  }

  renderContent = () => {
    const {currentUser} = firebase.auth()
    const {
      OTP,
      mobileNoWithCountryCode,
      sendOTP,
      callingCodeWithPlus,
      mobileNumber,
      isMobileVerified,
      cca2,
    } = this.state
    const {onSaveCallBack} = this.props
    console.log(currentUser)
    let providerId
    if (
      currentUser.providerData &&
      currentUser.providerData[0] &&
      currentUser.providerData[0].providerId === 'password'
    ) {
      providerId = currentUser.providerData[0].providerId
    }
    return (
      <ScrollView>
        {isMobileVerified === false && (
          <View style={styles.mainView}>
            {sendOTP === true ? (
              <Text>{Languages.OTPVerification.labels.sentMsg}</Text>
            ) : (
              <Text>{Languages.OTPVerification.labels.otpVerify}</Text>
            )}

            {onSaveCallBack && providerId && providerId === 'password' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text>
                  {callingCodeWithPlus} {mobileNumber}
                </Text>
              </View>
            ) : (
              this.renderMobileNumber()
            )}

            {sendOTP === true && (
              <Item style={styles.otpInput}>
                <Input
                  placeholder={Languages.OTPVerification.labels.enterOTP}
                  onChangeText={this.onChangeOTP}
                  value={OTP}
                  keyboardType="number-pad"
                />
              </Item>
            )}
            {sendOTP === true && (
              <Button style={styles.dontReceiveOTP} transparent onPress={() => this.sendOtp()}>
                <Text style={styles.dontReceiveOTPText}>
                  {Languages.OTPVerification.labels.dontReceiveOTP}
                </Text>
                <Text style={styles.clickHere}>{Languages.OTPVerification.labels.clickHere}</Text>
              </Button>
            )}

            {sendOTP === true && (
              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
                <View
                  style={{
                    width: '15%',
                  }}
                />
                <CommonButton
                  btnText={Languages.OTPVerification.labels.verify}
                  containerStyle={styles.verifytBtn}
                  onPress={() => {
                    this.checkProvider()
                  }}
                />
                <View
                  style={{
                    width: '15%',
                  }}
                />
                {/* <Icon
                  style={styles.arrowRight}
                  type="MaterialCommunityIcons"
                  name="arrow-right"
                  onPress={() => {
                    this.onSetLocationPress()
                  }}
                /> */}
              </View>
            )}
            {sendOTP === false && (
              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
                <View
                  style={{
                    width: '15%',
                  }}
                />
                <CommonButton
                  btnText={Languages.OTPVerification.labels.send_otp}
                  containerStyle={styles.sndBtn}
                  onPress={() => {
                    this.sendOtp()
                  }}
                />
                <View
                  style={{
                    width: '15%',
                  }}
                />
                {/* <Icon
                  style={styles.arrowRight}
                  type="MaterialCommunityIcons"
                  name="arrow-right"
                  onPress={() => {
                    this.onSetLocationPress()
                  }}
                /> */}
              </View>
            )}
          </View>
        )}
        {isMobileVerified === true && (
          <View style={styles.mainView}>
            <Text style={styles.centerAlign}>{mobileNoWithCountryCode}</Text>
            <Text style={styles.centerAlign}>{Languages.OTPVerification.labels.verified_msg}</Text>
            {!onSaveCallBack && (
              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
                <View
                  style={{
                    width: '10%',
                  }}
                />
                <CommonButton
                  btnText={Languages.OTPVerification.labels.change_number}
                  containerStyle={styles.changeMOBButton}
                  onPress={this.onChangeOtherMobileNumber}
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
              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
                <View
                  style={{
                    width: '10%',
                  }}
                />
                <CommonButton
                  btnText={Languages.OTPVerification.labels.next}
                  containerStyle={styles.changeMOBButton}
                  onPress={this.onNext}
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

OTPVerification.contextType = AuthContext

export default OTPVerification
