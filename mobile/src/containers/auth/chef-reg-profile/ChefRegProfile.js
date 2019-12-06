/** @format */

import React, {PureComponent} from 'react'
import {View} from 'react-native'
import StepIndicator from 'react-native-step-indicator'
import {Toast} from 'native-base'
import {RouteNames} from '@navigation'
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
} from '@containers'
import {Theme} from '@theme'
import styles from './styles'

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

const SCREEN_MAP = ['address', 'allergies', 'dietary', 'kitchenEquipment', 'profilePic']

export default class ChefRegProfile extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0,
      savedData: {
        address: false,
        allergies: false,
        dietary: false,
        kitchenEquipment: false,
        profilePic: false,
      },
    }
  }

  onStepPress = position => {
    this.setState({currentPage: position})
  }

  onCustomer = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CUSTOMER_SWITCH)
  }

  onFinish = () => {
    const {savedData} = this.state
    const flag = Object.keys(savedData).every(k => {
      return savedData[k]
    })

    if (flag) {
      this.onCustomer()
      console.log('Flag', flag)
    } else {
      Toast.show({
        text: 'Please fill al the data',
        duration: 3000,
      })
    }
  }

  updateCurrentPage = () => {
    // if its last page navigate
    // onSave={this.updateCurrentPage}
    // else

    const {savedData, currentPage} = this.state

    const key = SCREEN_MAP[currentPage]

    if (currentPage === 4) {
      this.setState(
        {
          savedData: {
            ...savedData,
            [key]: true,
          },
        },
        () => {
          this.onFinish()
        }
      )
    } else {
      this.setState({
        savedData: {
          ...savedData,
          [key]: true,
        },
        currentPage: currentPage + 1,
      })
    }
  }

  renderPage = () => {
    const {currentPage} = this.state
    const {navigation} = this.props
    console.log('currentPage', currentPage)
    if (currentPage === 0) {
      return <IntroMessage onSave={this.updateCurrentPage} />
    }
    if (currentPage === 1) {
      return <RateService onSave={this.updateCurrentPage} />
    }
    if (currentPage === 2) {
      return <OptionList onSave={this.updateCurrentPage} />
    }
    if (currentPage === 3) {
      return <Complexity onSave={this.updateCurrentPage} />
    }
    if (currentPage === 4) {
      return <ChefExperience onSave={this.updateCurrentPage} />
    }
    if (currentPage === 5) {
      return <Awards onSave={this.updateCurrentPage} />
    }
    if (currentPage === 6) {
      return <DisplayPicture onSave={this.updateCurrentPage} />
    }
    if (currentPage === 7) {
      return <Gallery onSave={this.updateCurrentPage} />
    }
    if (currentPage === 8) {
      return <Attachment onSave={this.updateCurrentPage} />
    }
    if (currentPage === 9) {
      return <Availability navigation={navigation} />
    }
  }

  render() {
    const {currentPage} = this.state
    return (
      <View style={{marginHorizontal: 5, marginVertical: 5}}>
        <View style={{marginTop: '5%'}}>
          <StepIndicator
            stepCount={10}
            customStyles={secondIndicatorStyles}
            currentPosition={currentPage}
            renderLabel={this._renderItem}
            onPress={position => this.onStepPress(position)}
          />
          {this.renderPage()}
        </View>
      </View>
    )
  }
}
