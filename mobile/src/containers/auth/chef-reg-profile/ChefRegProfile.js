/** @format */

import React, {PureComponent} from 'react'
import {View, Text, Alert} from 'react-native'
import StepIndicator from 'react-native-step-indicator'
import {Toast, Icon, ListItem, Right, Left, Body} from 'native-base'
import {RouteNames, ResetStack, ResetAction} from '@navigation'
import {Languages} from '@translations'
import {
  Awards,
  ChefExperience,
  Complexity,
  IntroMessage,
  OptionList,
  RateService,
  DisplayPicture,
  Gallery,
  Attachment,
  Availability,
  Address,
  EmailVerification,
  OTPVerification,
} from '@containers'
import {Theme} from '@theme'
import styles from './styles'
import {BasicProfileService, AuthContext, CHEF_REG_FLOW_STEPS} from '@services'

const secondIndicatorStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
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
  stepIndicatorLabelFontSize: 10,
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
  INTRO: 'IntroMessage',
  BASE_RATE: 'RateService',
  ADDITIONAL_SERVICES: 'OptionList',
  COMPLEXITY: 'Complexity',
  CUISINE_SPEC: 'ChefExperience',
  AWARDS: 'Awards',
  PROFILE_PIC: 'DisplayPicture',
  GALLERY: 'Gallery',
  DOCUMENTS: 'Attachment',
  AVAILABILITY: 'Availability',
  ADDRESS: 'Address',
}

class ChefRegProfile extends PureComponent {
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

    if (profile && profile.chefUpdatedScreens && profile.chefUpdatedScreens.length > 0) {
      this.setState({
        savedData: profile.chefUpdatedScreens,
      })
      const fullSteps = CHEF_REG_FLOW_STEPS
      const completedSteps = profile.chefUpdatedScreens
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

    if (savedData && savedData.length === CHEF_REG_FLOW_STEPS.length) {
      BasicProfileService.updateRegProfileFlag(true, currentUser.chefId)
        .then(res => {
          if (res) {
              ChefProfileService.submitProfileForReview(currentUser.chefId)
                .then(res => {
                  if (res) {
                    TabBarService.hideInfo()
                    Toast.show({
                      text: 'Profile submitted for review',
                      duration: 5000,
                    })
                    ResetStack(navigation, RouteNames.CHEF_MAIN_TAB)
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
            // Toast.show({
            //   text: 'You have completed the profile setup.',
            //   duration: 3000,
            // })
            
          }
        })
        .catch(e => {
          console.log('debuggging error on saving reg flag', e)
        })
    } else {
      uncompletedSteps = CHEF_REG_FLOW_STEPS.filter(value => !savedData.includes(value))
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

    const currentStep = CHEF_REG_FLOW_STEPS[currentPage]

    if (currentStep && savedData.indexOf(currentStep) === -1) {
      savedData.push(currentStep)
    }

    BasicProfileService.updateRegProfileStatus(true, currentUser.chefId, savedData)
      .then(res => {
        if (res) {
          if (currentPage === 12) {
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
    const {navigation} = this.props
    if (currentPage === 0) {
      return <EmailVerification onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 1) {
      return <OTPVerification onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 2) {
      return <IntroMessage onNext={this.updateCurrentPage} />
    }
    if (currentPage === 3) {
      return <RateService onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 4) {
      return <OptionList onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 5) {
      return <Complexity onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 6) {
      return <ChefExperience onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 7) {
      return <Awards onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 8) {
      return <DisplayPicture onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 9) {
      return <Gallery onNext={this.updateCurrentPage} />
    }
    if (currentPage === 10) {
      return <Attachment onNext={this.updateCurrentPage} />
    }
    if (currentPage === 11) {
      return <Availability navigation={navigation} onSaveCallBack={this.updateCurrentPage} />
    }
    if (currentPage === 12) {
      return (
        <Address navigation={navigation} showFinishText onSaveCallBack={this.updateCurrentPage} />
      )
    }
    return null
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
            stepCount={13}
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

ChefRegProfile.contextType = AuthContext
export default ChefRegProfile
