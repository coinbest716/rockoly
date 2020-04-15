/** @format */

import React, {Component} from 'react'
import {ScrollView, Image, View, Alert, Switch} from 'react-native'
import {Text, ListItem, Icon, Right, Left, Button, Body, Toast} from 'native-base'
import firebase from 'react-native-firebase'
import styles from './styles'
import {RouteNames, ResetAction} from '@navigation'
import {Images} from '@images'
import {Header, CommonButton} from '@components'
import {CONSTANTS} from '@common'
import {
  AuthContext,
  LoginService,
  BasicProfileService,
  ChefProfileService,
  UPDATE_BASIC_PROFILE_EVENT,
  TabBarService,
} from '@services'
import {Languages} from '@translations'
import {STORAGE_KEY_NAME} from '@utils'

class CustomerProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobileVerified: false,
      showchangePassword: true,
      profile: {},
      isEmailVerified: false,
    }
  }

  async componentDidMount() {
    const {isLoggedIn, isChef, currentUser} = this.context
    const firebaseUser = firebase.auth().currentUser
    this.loadData()
    BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.PROFILE_UPDATED, this.loadData)
    BasicProfileService.on(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updateInfo)
    if (isLoggedIn && isChef) {
      const id = currentUser.chefId
      BasicProfileService.profileSubscriptionForChef(id)
    } else if (isLoggedIn && !isChef) {
      const id = currentUser.customerId
      BasicProfileService.profileSubscriptionForCustomer(id)
    }
    if (firebaseUser && firebaseUser.providerData && firebaseUser.providerData.length) {
      const providerValue = firebaseUser.providerData[0]
      if (providerValue.providerId) {
        if (
          providerValue.providerId === 'facebook.com' ||
          providerValue.providerId === 'google.com'
        ) {
          this.setState({showchangePassword: false})
        }
      }
    }
  }

  componentWillUnmount() {
    BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.PROFILE_UPDATED, this.loadData)
    BasicProfileService.off(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, this.updateInfo)
  }

  updateInfo = () => {
    this.loadData()
  }

  loadData = async () => {
    const {isLoggedIn, getProfile, currentUser} = this.context

    if (isLoggedIn) {
      const profile = await getProfile()

      this.setState({
        profile,
      })
      const loginUser = currentUser
      this.checkMobileVerified(loginUser)
      this.checkEmailVerified()
    }
  }

  checkEmailVerified = () => {
    const {profile} = this.state
    const {isChef, currentUser} = this.context
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (profile && profile.isEmailVerifiedYn === false && user.emailVerified === true) {
          if (isChef) {
            BasicProfileService.updatEmailVerificationFlag(true, currentUser.chefId)
              .then(res => {
                if (res) {
                  console.log('update email flag', res)
                  this.setState({
                    isEmailVerified: user.emailVerified,
                  })
                }
              })
              .catch(e => {
                console.log('debuggging error on update email flag', e)
              })
          } else if (!isChef) {
            BasicProfileService.updatEmailVerificationFlag(false, currentUser.customerId)
              .then(res => {
                if (res) {
                  console.log('update email flag', res)
                  this.setState({
                    isEmailVerified: user.emailVerified,
                  })
                }
              })
              .catch(e => {
                console.log('debuggging error on update email flag', e)
              })
          }
        } else {
          this.setState({
            isEmailVerified: user.emailVerified,
          })
        }
      }
    })
  }

  checkMobileVerified = loginUser => {
    console.log('loginUser', loginUser)
    const {currentUser} = firebase.auth()
    const {profile} = this.state
    const {isChef} = this.context

    if (currentUser && loginUser) {
      if (profile && profile.isMobileNoVerifiedYn === false && currentUser.phoneNumber) {
        if (isChef) {
          BasicProfileService.updateMobileVerifyFlag(true, loginUser.chefId)
            .then(res => {
              if (res) {
                console.log('update mobile flag', res)
                this.setState({
                  isMobileVerified: true,
                })
              }
            })
            .catch(e => {
              console.log('debuggging error on update mobile flag', e)
            })
        } else if (!isChef) {
          BasicProfileService.updateMobileVerifyFlag(false, loginUser.customerId)
            .then(res => {
              if (res) {
                console.log('update mobile flag', res)
                this.setState({
                  isMobileVerified: true,
                })
              }
            })
            .catch(e => {
              console.log('debuggging error on update mobile flag', e)
            })
        }
      } else if (currentUser && currentUser.phoneNumber) {
        this.setState({
          isMobileVerified: true,
        })
      }
    }
  }

  onLoginRegHandle = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.LOGIN_SCREEN)
  }

  onRegisterHandle = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.REGISTER_SCREEN)
  }

  onPreRegisterHandle = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.PRE_REGISTER_SCREEN)
  }

  userContent = () => {}

  loginContent = () => {
    return (
      <View style={styles.text}>
        <Text>Welcome to Rockoly. Please click login/register to get started.</Text>
        <View style={styles.loginBtnView}>
          <CommonButton
            textStyle={styles.loginBtnText}
            btnText={Languages.customerProfile.label.login}
            containerStyle={styles.loginBtn}
            onPress={() => this.onLoginRegHandle()}
          />
          <CommonButton
            textStyle={styles.loginBtnText}
            btnText={Languages.customerProfile.label.register}
            containerStyle={styles.loginBtn}
            onPress={() => this.onPreRegisterHandle()}
          />
        </View>
      </View>
    )
  }

  onPreferncePress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CUSTOMER_PREFERENCE)
  }

  onEmailVerification = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.REG_EMAIL_VERIFICATION)
  }

  onAllergiesPress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CUSTOMER_EDIT_PROFILE, {screen: RouteNames.ALLERGIES})
  }

  onDietaryPress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CUSTOMER_EDIT_PROFILE, {screen: RouteNames.DIETARY})
  }

  onEquipmentPress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CUSTOMER_EDIT_PROFILE, {screen: RouteNames.KITCHEN_EQUIPMENT})
  }

  onCuisinePress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CUSTOMER_EDIT_PROFILE, {screen: RouteNames.FAVOURITE_CUISINE})
  }

  onIntroMessage = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_EDIT_PROFILE, {screen: RouteNames.INTRO_MESSAGE})
  }

  onRate = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.ACCOUNT_SETTING, {screen: 'RATE'})
  }

  onChefProfile = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_ACCOUNT, {screen: 'RATE'})
  }

  onChefPrice = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_PRICING, {screen: 'RATE'})
  }

  onPrice = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.PRICE_CALCULATION)
  }

  onService = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_EDIT_PROFILE, {screen: 'NUMBER_OF_GUESTS'})
  }

  onOptionList = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_EDIT_PROFILE, {screen: RouteNames.OPTION_LIST})
  }

  onChefExperience = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_EDIT_PROFILE, {screen: RouteNames.CHEF_EXPERIENCE})
  }

  onProfilePic = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_EDIT_PROFILE, {screen: RouteNames.DISPLAY_PICTURE})
  }

  onGallery = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_EDIT_PROFILE, {screen: RouteNames.GALLERY})
  }

  onAttachment = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_EDIT_PROFILE, {screen: RouteNames.ATTACHMENT})
  }

  onComplexity = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_EDIT_PROFILE, {screen: RouteNames.COMPLEXITY})
  }

  onAwards = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_EDIT_PROFILE, {screen: RouteNames.AWARDS})
  }

  onBookingStepOnePress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.BOOK_ALLERGY)
  }

  itemOnPress = () => {
    const {navigation} = this.props
    const {isChef, isLoggedIn} = this.context

    if (isLoggedIn) {
      if (isChef) {
        navigation.navigate(RouteNames.CHEF_MANAGE_PAYMENTS)
      } else {
        navigation.navigate(RouteNames.CARD_MANAGEMENT)
      }
    }
  }

  onBookingHistory = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.BOOKING_HISTORY)
  }

  onPayments = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_PAYMENT_HISTORY)
  }

  onPaymentHistory = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CUSTOMER_PAYMENT_HISTORY)
  }

  onChangePassword = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHANGE_PASSWORD_SCREEN)
  }

  submitForReview = () => {
    const {isChef, isLoggedIn, currentUser} = this.context

    if (isChef && isLoggedIn) {
      ChefProfileService.submitProfileForReview(currentUser.chefId)
        .then(res => {
          if (res) {
            TabBarService.hideInfo()
            Toast.show({
              text: 'Profile submitted for review',
              duration: 5000,
            })
            this.loadData()
          } else {
            Alert.alert(
              Languages.customerProfile.alert.error_title,
              Languages.customerProfile.alert.error_2
            )
          }
        })
        .catch(e => {
          Alert.alert(
            Languages.customerProfile.alert.error_title,
            Languages.customerProfile.alert.error_1
          )
        })
    }
  }

  confirmReviewSubmit = async () => {
    const {getProfile, isEmailVerified, isMobileVerified} = this.context

    const profile = await getProfile()
    console.log('debugging profile', profile)

    let mailAndMobileVerify = false

    const {currentUser} = firebase.auth()
    if (currentUser) {
      firebase.auth().currentUser.reload()

      const user = firebase.auth().currentUser
      if (user) {
        if (user.emailVerified && currentUser.phoneNumber) {
          mailAndMobileVerify = true
        }
      }
    }

    let isFilledYn = false

    try {
      isFilledYn = profile.isRegistrationCompletedYn
    } catch (e) {}

    if (isFilledYn === true) {
      if (mailAndMobileVerify === true) {
        Alert.alert(
          Languages.customerProfile.alert.submit_profile_title,
          Languages.customerProfile.alert.make_sure_details,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => this.submitForReview()},
          ],
          {cancelable: false}
        )
      } else {
        Alert.alert(
          Languages.customerProfile.alert.email_or_mobile_veriified_title,
          `${Languages.customerProfile.alert.email_or_mobile_veriified_error} `
        )
      }
    } else {
      Alert.alert(
        Languages.customerProfile.alert.complete_profile_title,
        `${Languages.customerProfile.alert.complete_profile_alert} `
      )
    }
  }

  switchAlert = () => {
    const {isChef} = this.context
    const msg = isChef
      ? Languages.customerProfile.options.switch_to_customer
      : Languages.customerProfile.options.switch_to_chef
    Alert.alert(
      'Account switching',
      `${Languages.customerProfile.alert.confirmation} ${msg}`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.onSwitchRole()},
      ],
      {cancelable: false}
    )
  }

  onSwitchRole = async () => {
    const {navigation} = this.props
    const {isChef, getProfile, updateCurrentUser} = this.context
    const profile = await getProfile()

    this.setState({})

    let switchTo = ``
    let email = ``
    let switchFrom = ``
    if (isChef) {
      email = profile.chefEmail
      switchFrom = CONSTANTS.ROLE.CHEF
      switchTo = CONSTANTS.ROLE.CUSTOMER
    } else {
      email = profile.customerEmail
      switchFrom = CONSTANTS.ROLE.CUSTOMER
      switchTo = CONSTANTS.ROLE.CHEF
    }

    LoginService.gqlSwitchRole({email, switchFrom, switchTo})
      .then(async gqlRes => {
        LoginService.onLogin({role: switchTo, gqlRes, updateCurrentUser, navigation})
      })
      .catch(e => {
        console.log('debugging e', e)
        if (e === 'USER_IS_BLOCKED') {
          Alert.alert(
            Languages.customerProfile.alert.title,
            Languages.customerProfile.alert.account_blocked
          )
        } else {
          Alert.alert(
            Languages.customerProfile.alert.could_not_switch_account,
            Languages.customerProfile.alert.try_again_to_switch
          )
        }
      })
  }

  onBasicProfile = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.BASIC_EDIT_PROFILE)
  }

  onAboutUs = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.ABOUT_US)
  }

  onContactUs = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CONTACT_US)
  }

  onTerms = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.TERMS_AND_POLICY)
  }

  onProfileSetup = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_SETUP_PROFILE)
  }

  goToVerifyMobileNumber = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.REG_MOBILE_VERIFICATION)
  }

  logout = () => {
    const {logout} = this.context
    const {navigation} = this.props
    Alert.alert(
      Languages.customerProfile.options.logout,
      Languages.customerProfile.options.logout_confirm,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            logout(() => {
              firebase.notifications().setBadge(0)
              ResetAction(navigation, RouteNames.CUSTOMER_SWITCH)
            })
          },
        },
      ],
      {cancelable: false}
    )
  }

  feedback = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.FEEDBACK_SCREEN)
  }

  onFliter = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.FILTER_SCREEN)
  }

  onSetLocationPress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.SET_LOCATION_SCREEN)
  }

  onEmailPress = () => {
    console.log('email')
  }

  onNotificationSettings = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.NOTIFICATION_SETTINGS_SCREEN)
  }

  onFavoiteChef = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.FAVOURITE_STACK)
  }

  onInboxpress = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CONVERSATION_LIST)
  }

  userInfoContent = () => {
    const {isLoggedIn, isChef} = this.context
    const {profile} = this.state

    if (!isLoggedIn) {
      return null
    }

    if (isChef && profile) {
      return (
        <View style={styles.userInfo}>
          <Text style={styles.nameStyle}>
            {profile.chefFirstName} {profile.chefLastName}
          </Text>
          <Text style={styles.emailStyle}>{profile.chefEmail}</Text>
          <Text style={styles.emailStyle}>{profile.mobileNoWithCountryCode}</Text>
        </View>
      )
    }
    if (!isChef && profile) {
      return (
        <View style={styles.userInfo}>
          <Text style={styles.nameStyle}>
            {profile.customerFirstName} {profile.customerLastName}
          </Text>
          <Text style={styles.emailStyle}>{profile.customerEmail}</Text>
          <Text style={styles.emailStyle}>{profile.mobileNoWithCountryCode}</Text>
        </View>
      )
    }
    return null
  }

  renderStatus = () => {
    const {isChef, isLoggedIn} = this.context
    const {profile} = this.state
    console.log('profile', profile)
    if (isChef && isLoggedIn && profile) {
      let status = ``
      try {
        status = profile.chefStatusId && profile.chefStatusId.trim()

        const button = (
          <View style={{marginBottom: '1%'}}>
            <CommonButton
              style={styles.submitProfileBtn}
              btnText={Languages.customerProfile.label.submit_profile}
              onPress={() => {
                this.confirmReviewSubmit()
              }}
            />
          </View>
        )

        if (status === 'SUBMITTED_FOR_REVIEW') {
          return (
            <View style={styles.statusView}>
              <Button transparent>
                <Text style={styles.statusTextColor}>
                  {Languages.customerProfile.label.submitted_for_review}
                </Text>
              </Button>
              <Text>{Languages.customerProfile.messages.submited_for_review_msg}</Text>
            </View>
          )
        }

        if (status === 'PENDING') {
          return (
            <View style={styles.statusView}>
              {button}
              <Text>{Languages.customerProfile.messages.review_pending_msg}</Text>
            </View>
          )
        }
        if (status === 'REJECTED') {
          return (
            <View style={styles.statusView}>
              {button}
              <Text style={styles.statusTextColorReject}>
                {Languages.customerProfile.messages.review_rejected_msg}{' '}
              </Text>
              <Text style={styles.reasonText}>Reason: {profile.chefRejectOrBlockReason}</Text>
            </View>
          )
        }
        if (status === 'APPROVED') {
          return (
            <View style={styles.statusView}>
              <Text style={styles.statusTextColor}>
                {Languages.customerProfile.label.profile_verified}
              </Text>
            </View>
          )
        }
      } catch (e) {
        return null
      }
    } else {
      return null
    }
  }

  renderCustomerContent = () => {
    const {isMobileVerified, isEmailVerified} = this.state
    return (
      <View style={styles.contentContainer}>
        <ListItem itemDivider>
          <Text>Account Settings</Text>
        </ListItem>
        <CustomListItem
          iconName="account-edit"
          label="Personal Information"
          onPress={this.onBasicProfile}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName="map-marker"
          type="MaterialCommunityIcons"
          label={Languages.customerProfile.options.set_location}
          onPress={this.onSetLocationPress}
        />
        <CustomListItem iconName="card" label="Payments and payouts" onPress={this.itemOnPress} />
        <CustomListItem
          iconName="bell-outline"
          type="MaterialCommunityIcons"
          label="Notifications"
          onPress={this.onNotificationSettings}
        />
        <CustomListItem
          iconName={isMobileVerified === false ? 'cellphone' : 'check-decagram'}
          label={
            isMobileVerified === false
              ? Languages.customerProfile.options.verify_mob
              : Languages.customerProfile.options.verified
          }
          onPress={this.goToVerifyMobileNumber}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName={isEmailVerified === true ? 'email-check' : 'email'}
          label={
            isEmailVerified === true
              ? Languages.customerProfile.options.emailVerified
              : Languages.customerProfile.options.emailVerification
          }
          onPress={this.onEmailVerification}
          type="MaterialCommunityIcons"
        />

        <CustomListItem
          iconName="book-open-page-variant"
          type="MaterialCommunityIcons"
          label="Your Guidebook"
          onPress={this.onNotificationSettings}
        />

        {/* 
        <ListItem itemDivider>
          <Text>Basic details </Text>
        </ListItem>
        <CustomListItem
          iconName="account"
          type="MaterialCommunityIcons"
          label={Languages.customerProfile.options.basic_profile}
          onPress={this.onBasicProfile}
        /> */}
        {/* <CustomListItem
          iconName="shield-account"
          label={Languages.customerProfile.options.profile_Pic}
          onPress={this.onProfilePic}
          type="MaterialCommunityIcons"
        /> */}
        {/* <ListItem itemDivider>
          <Text>Booking</Text>
        </ListItem>
        <CustomListItem
          iconName="shield-account"
          label="Booking Step1"
          onPress={this.onBookingStepOnePress}
          type="MaterialCommunityIcons"
        /> */}
        <ListItem itemDivider>
          <Text>Customer Profile</Text>
        </ListItem>
        <CustomListItem
          type="MaterialCommunityIcons"
          iconName="food-off"
          label={Languages.customerProfile.options.allergies}
          onPress={this.onAllergiesPress}
        />
        <CustomListItem
          type="MaterialCommunityIcons"
          iconName="food-apple"
          label={Languages.customerProfile.options.dietary}
          onPress={this.onDietaryPress}
        />
        <CustomListItem
          type="MaterialCommunityIcons"
          iconName="microwave"
          label={Languages.customerProfile.options.equipment}
          onPress={this.onEquipmentPress}
        />
        {/* <CustomListItem
          type="MaterialCommunityIcons"
          iconName="food"
          label={Languages.customerProfile.options.cuisine}
          onPress={this.onCuisinePress}
        /> */}
      </View>
    )
  }

  renderChefContent = () => {
    const {isMobileVerified, isEmailVerified} = this.state
    return (
      <View style={styles.contentContainer}>
        <ListItem itemDivider>
          <Text>Account Settings</Text>
        </ListItem>
        <CustomListItem
          iconName="account-edit"
          label="Personal Information"
          onPress={this.onBasicProfile}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName="map-marker"
          type="MaterialCommunityIcons"
          label={Languages.customerProfile.options.set_location}
          onPress={this.onSetLocationPress}
        />
        <CustomListItem iconName="card" label="Payments and payouts" onPress={this.itemOnPress} />
        <CustomListItem
          iconName="bell-outline"
          type="MaterialCommunityIcons"
          label="Notifications"
          onPress={this.onNotificationSettings}
        />
        <CustomListItem
          iconName={isMobileVerified === false ? 'cellphone' : 'check-decagram'}
          label={
            isMobileVerified === false
              ? Languages.customerProfile.options.verify_mob
              : Languages.customerProfile.options.verified
          }
          onPress={this.goToVerifyMobileNumber}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName={isEmailVerified === true ? 'email-check' : 'email'}
          label={
            isEmailVerified === true
              ? Languages.customerProfile.options.emailVerified
              : Languages.customerProfile.options.emailVerification
          }
          onPress={this.onEmailVerification}
          type="MaterialCommunityIcons"
        />

        <CustomListItem
          iconName="book-open-page-variant"
          type="MaterialCommunityIcons"
          label="Your Guidebook"
          onPress={this.onIntroMessage}
        />
        {/* <CustomListItem
          iconName="account-edit"
          label={Languages.customerProfile.options.account}
          onPress={this.onRate}
          type="MaterialCommunityIcons"
        /> */}
        <ListItem itemDivider>
          <Text>Chef Profile</Text>
        </ListItem>
        <CustomListItem
          iconName="account-edit"
          label="Basics"
          onPress={this.onChefExperience}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName="image"
          label={Languages.customerProfile.options.gallery}
          onPress={this.onGallery}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName="file-document-edit"
          label={Languages.customerProfile.options.license}
          onPress={this.onAttachment}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName="calendar"
          label="Availability"
          onPress={this.goToSetAvailability}
          type="MaterialCommunityIcons"
        />
        <ListItem itemDivider>
          <Text>Pricing</Text>
        </ListItem>
        <CustomListItem
          iconName="calculator-variant"
          label={Languages.customerProfile.options.priceCal}
          onPress={this.onPrice}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName="currency-usd"
          label="Base Price"
          onPress={this.onRate}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName="chevron-triple-up"
          label={Languages.customerProfile.options.complexity}
          onPress={this.onComplexity}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName="room-service"
          label={Languages.customerProfile.options.option_list}
          onPress={this.onOptionList}
          type="MaterialCommunityIcons"
        />

        {/* <ListItem itemDivider>
          <Text>General </Text>
        </ListItem>
        <CustomListItem
          iconName="information"
          label={Languages.customerProfile.options.intro_message}
          onPress={this.onIntroMessage}
          type="MaterialCommunityIcons"
        /> */}

        {/* <CustomListItem
          iconName="trophy-award"
          label={Languages.customerProfile.options.awards}
          onPress={this.onAwards}
          type="MaterialCommunityIcons"
        />
        <CustomListItem
          iconName="map-marker"
          type="MaterialCommunityIcons"
          label={Languages.customerProfile.options.set_location}
          onPress={this.onSetLocationPress}
        /> */}
        {/* <CustomListItem
          iconName="chef-hat"
          label={Languages.customerProfile.options.profile_setup}
          onPress={this.onProfileSetup}
          type="MaterialCommunityIcons"
        /> */}
      </View>
    )
  }

  goToSetAvailability = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.SET_AVAILABILITY_SCREEN)
  }

  onGalleryAttach = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.GALLERY_ATTACHMENT)
  }

  render() {
    const {isLoggedIn, isChef} = this.context
    const {isMobileVerified, profile, showchangePassword} = this.state

    let picId
    if (isChef && profile) {
      picId = profile.chefPicId
    } else if (!isChef && profile) {
      picId = profile.customerPicId
    }
    let pic
    if (picId) {
      pic = {uri: picId}
    } else {
      pic = Images.common.defaultAvatar
    }
    console.log('picid', picId)
    return (
      <View style={styles.container}>
        <Header showBack title="Profile" showBell />
        <ScrollView>
          {!isLoggedIn && (
            <View style={styles.topContainer}>
              <Image source={Images.logo.mainLogo} style={styles.logo} resizeMode="contain" />
            </View>
          )}

          {isLoggedIn ? this.userContent() : this.loginContent()}

          {isLoggedIn && (
            <View>
              {/* <View style={styles.userContent}>
                <Image source={pic} style={styles.profileImage} resizeMode="contain" />

                {this.userInfoContent()}
              </View> */}
              {/* {this.renderStatus()} */}
              {isChef && this.renderChefContent()}
              {isChef === false && this.renderCustomerContent()}
              {/* <CustomListItem
                iconName="card"
                label={Languages.customerProfile.options.manage_payments_methods}
                onPress={this.itemOnPress}
              /> */}
              {/* <ListItem itemDivider>
                <Text>Payment details</Text>
              </ListItem>
             
              {isLoggedIn && !isChef && (
                <CustomListItem
                  type="MaterialCommunityIcons"
                  iconName="history"
                  label={Languages.customerProfile.options.payment_history}
                  onPress={this.onPaymentHistory}
                />
              )}
              {isChef && (
                <CustomListItem
                  iconName="card"
                  label={Languages.chefTab.payments}
                  onPress={this.onPayments}
                />
              )}
              {isChef && (
                <CustomListItem
                  type="MaterialCommunityIcons"
                  iconName="history"
                  label={Languages.customerProfile.options.booking_history}
                  onPress={this.onBookingHistory}
                />
              )} */}
              {/* 
              {!isChef && (
                <View>
                  <ListItem itemDivider>
                    <Text>Others</Text>
                  </ListItem>
                  <CustomListItem
                    type="MaterialCommunityIcons"
                    iconName="heart"
                    label={Languages.customerTab.favoriteChef}
                    onPress={this.onFavoiteChef}
                  />
                </View> 
              )} */}
              <ListItem itemDivider>
                <Text />
              </ListItem>
              <CustomListItem
                iconName="account-switch"
                type="MaterialCommunityIcons"
                label={
                  isChef
                    ? Languages.customerProfile.options.switch_to_customer
                    : Languages.customerProfile.options.switch_to_chef
                }
                onPress={this.switchAlert}
              />
              {/* <CustomListItem
                iconName="bell-outline"
                type="MaterialCommunityIcons"
                label={Languages.customerProfile.options.notification_settings}
                onPress={this.onNotificationSettings}
              /> */}
              <ListItem itemDivider>
                <Text>Others</Text>
              </ListItem>
              {showchangePassword === true && (
                <CustomListItem
                  type="MaterialCommunityIcons"
                  iconName="lock-reset"
                  label={Languages.customerProfile.options.change_password}
                  onPress={this.onChangePassword}
                />
              )}

              <CustomListItem
                type="MaterialCommunityIcons"
                iconName="face-agent"
                label={Languages.customerProfile.options.aboutus}
                onPress={this.onContactUs}
              />
              <CustomListItem
                type="MaterialCommunityIcons"
                iconName="file-document"
                label={Languages.customerProfile.options.legal}
                onPress={this.onTerms}
              />
              {/* <CustomListItem
                type="MaterialCommunityIcons"
                iconName="account-box"
                label={Languages.customerProfile.options.contactus}
                onPress={this.onContactUs}
              />
              <CustomListItem
                type="MaterialCommunityIcons"
                iconName="file-document-edit"
                label={Languages.customerProfile.options.terms}
                onPress={this.onTerms}
              /> */}
              <ListItem itemDivider>
                <Text />
              </ListItem>
              <CustomListItem
                iconName="logout"
                label={Languages.customerProfile.options.logout}
                onPress={this.logout}
                type="MaterialCommunityIcons"
              />
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

const CustomListItem = ({onPress, iconName, label, type}) => {
  let icon
  if (type) {
    icon = <Icon style={styles.iconColor} active name={iconName} type={type} />
  } else {
    icon = <Icon style={styles.iconColor} active name={iconName} />
  }

  return (
    <ListItem style={styles.listItem} icon onPress={() => onPress()}>
      <Left>
        <Button transparent>{icon}</Button>
      </Left>
      <Body>
        <Text>{label}</Text>
      </Body>
      <Right>
        <Icon style={styles.iconColor} active name="arrow-forward" />
      </Right>
    </ListItem>
  )
}

CustomerProfile.contextType = AuthContext

export default CustomerProfile
