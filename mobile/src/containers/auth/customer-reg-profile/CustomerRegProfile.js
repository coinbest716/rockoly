/** @format */

import React, {PureComponent} from 'react'
import {View, Alert} from 'react-native'
import StepIndicator from 'react-native-step-indicator'
import {Toast, Text, Icon, Right, Left, ListItem, Body} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import _ from 'lodash'
import {RouteNames, ResetStack, ResetAction} from '@navigation'
import {
  Allergies,
  Dietary,
  KitchenEquipment,
  Address,
  DisplayPicture,
  EmailVerification,
  OTPVerification,
} from '@containers'
import {Theme} from '@theme'
import styles from './styles'
import {BasicProfileService, AuthContext, CUSTOMER_REG_FLOW_STEPS} from '@services'
import {Languages} from '@translations'

const secondIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: Theme.Colors.primary,
  stepStrokeWidth: 3,
  separatorStrokeFinishedWidth: 4,
  stepStrokeFinishedColor: Theme.Colors.primary,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: Theme.Colors.primary,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: Theme.Colors.primary,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: Theme.Colors.white,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: Theme.Colors.primary,
  stepIndicatorLabelFinishedColor: Theme.Colors.white,
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: Theme.Colors.primary,
}

const errorMessage = {
  EMAIL_VERIFICATION: 'Email verification',
  MOBILE_VERIFICATION: 'Mobile Verification',
  ADDRESS: 'Address',
  ALLERGY: 'Allergy',
  DIETARY: 'Dietry',
  KITCHEN_EQUIPMENT: 'Kitchen equipment',
  PROFILE_PIC: 'Profile pic',
}

class CustomerRegProfile extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0,
      savedData: [],
    }
  }

  async componentDidMount() {
    const {getProfile} = this.context
    const profile = await getProfile()

    if (profile && profile.customerUpdatedScreens && profile.customerUpdatedScreens.length > 0) {
      this.setState({
        savedData: profile.customerUpdatedScreens,
      })
      const fullSteps = CUSTOMER_REG_FLOW_STEPS
      const completedSteps = profile.customerUpdatedScreens
      if (fullSteps.length !== completedSteps.length) {
        let isCurrentPageSet = false
        fullSteps.map((item, index) => {
          if (completedSteps.indexOf(item) === -1 && isCurrentPageSet === false) {
            isCurrentPageSet = true
            this.setState({
              currentPage: index,
            })
          }
          return null
        })
      } else {
        this.setState({
          currentPage: completedSteps.length - 1,
        })
      }
    }
  }

  onStepPress = position => {
    this.setState({currentPage: position})
  }

  onFinish = () => {
    const {savedData} = this.state
    const {currentUser} = this.context
    const {navigation} = this.props

    let uncompletedSteps

    if (savedData && savedData.length === CUSTOMER_REG_FLOW_STEPS.length) {
      BasicProfileService.updateRegProfileFlag(false, currentUser.customerId)
        .then(res => {
          if (res) {
            Toast.show({
              text: 'You have completed the profile setup.',
              duration: 3000,
            })
            ResetStack(navigation, RouteNames.CUSTOMER_MAIN_TAB)
          }
        })
        .catch(e => {
          console.log('debuggging error on saving reg flag', e)
        })
    } else {
      uncompletedSteps = CUSTOMER_REG_FLOW_STEPS.filter(value => !savedData.includes(value))
      let message = 'Please fill out these screens: '
      uncompletedSteps.map((itemVal, index) => {
        message += `${errorMessage[itemVal]}`
        if (uncompletedSteps.length - 1 !== index) {
          message += `, `
        }
      })

      Alert.alert('Info', message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
        cancelable: false,
      })
    }
  }

  updateCurrentPage = () => {
    const {savedData, currentPage} = this.state
    const {currentUser} = this.context

    if (!currentUser) {
      return
    }

    const currentStep = CUSTOMER_REG_FLOW_STEPS[currentPage]

    if (currentStep && savedData.indexOf(currentStep) === -1) {
      savedData.push(currentStep)
    }

    BasicProfileService.updateRegProfileStatus(false, currentUser.customerId, savedData)
      .then(res => {
        if (res) {
          if (currentPage === 6) {
            this.setState(
              {
                savedData,
              },
              () => {
                this.onFinish()
              }
            )
          } else {
            this.setState({
              savedData,
              currentPage: currentPage + 1,
            })
          }
        }
      })
      .catch(e => {
        console.log('debugging error e', e)
      })
  }

  renderPage = () => {
    const {currentPage} = this.state
    if (currentPage === 0) {
      return <EmailVerification onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 1) {
      return <OTPVerification onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 2) {
      return <Address onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 3) {
      return <Allergies onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 4) {
      return <Dietary onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 5) {
      return <KitchenEquipment onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 6) {
      return <DisplayPicture onSaveCallBack={this.updateCurrentPage} />
    }
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
              ResetAction(navigation, RouteNames.CUSTOMER_SWITCH)
            })
          },
        },
      ],
      {cancelable: false}
    )
  }

  render() {
    const {currentPage} = this.state
    return (
      <View style={{marginHorizontal: 10, paddingVertical: 10, flex: 1}}>
        <ListItem icon>
          <Body>
            <Text style={styles.titleText}>Setup your profile</Text>
          </Body>
          <Right>
            <Icon
              style={{color: '#f44336'}}
              onPress={this.logout}
              name="logout"
              type="MaterialCommunityIcons"
            />
          </Right>
        </ListItem>
        <Text style={{paddingVertical: 5, paddingHorizontal: 5}}>
          Please complete the setup profile to start using our application
        </Text>
        <View style={{paddingTop: 10}}>
          <StepIndicator
            stepCount={7}
            customStyles={secondIndicatorStyles}
            currentPosition={currentPage}
            renderLabel={this._renderItem}
            onPress={position => this.onStepPress(position)}
          />
        </View>
        {this.renderPage()}
      </View>
    )
  }
}

CustomerRegProfile.contextType = AuthContext

export default CustomerRegProfile
