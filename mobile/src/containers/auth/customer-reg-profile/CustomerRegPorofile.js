/** @format */

import React, {PureComponent} from 'react'
import {View} from 'react-native'
import StepIndicator from 'react-native-step-indicator'
import {Toast, Text} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import {RouteNames, ResetStack} from '@navigation'
import {
  Allergies,
  Dietary,
  FavouriteCuisine,
  KitchenEquipment,
  Address,
  DisplayPicture,
} from '@containers'
import {Theme} from '@theme'
import styles from './styles'

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

const SCREEN_MAP = ['address', 'allergies', 'dietary', 'kitchenEquipment', 'profilePic']

export default class CustomerRegPorofile extends PureComponent {
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

  componentDidMount() {
    AsyncStorage.setItem('customerRegSetupProfile', JSON.stringify(false))
  }

  onStepPress = position => {
    this.setState({currentPage: position})
  }

  onFinish = () => {
    const {savedData} = this.state
    const {navigation} = this.props
    const flag = Object.keys(savedData).every(k => {
      return savedData[k]
    })

    if (flag) {
      AsyncStorage.setItem('customerRegSetupProfile', JSON.stringify(true))
        .then(() => {
          setTimeout(() => {
            Toast.show({
              text: 'You have completed the profile setup.',
              duration: 3000,
            })
            ResetStack(navigation, RouteNames.CUSTOMER_MAIN_TAB)
          }, 500)
        })
        .catch(e => {
          console.log('debuggging error on saving reg flag', e)
        })
    } else {
      Toast.show({
        text: 'Please fill up all the forms.',
        duration: 3000,
      })
    }
  }

  updateCurrentPage = () => {
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
    if (currentPage === 0) {
      return <Address onSave={this.updateCurrentPage} />
    }
    if (currentPage === 1) {
      return <Allergies onSave={this.updateCurrentPage} />
    }
    if (currentPage === 2) {
      return <Dietary onSave={this.updateCurrentPage} />
    }
    if (currentPage === 3) {
      return <KitchenEquipment onSave={this.updateCurrentPage} />
    }
    if (currentPage === 4) {
      return <DisplayPicture onSave={this.updateCurrentPage} />
    }
  }

  render() {
    const {currentPage} = this.state
    return (
      <View style={{marginHorizontal: 10, paddingVertical: 10, flex: 1}}>
        <Text style={styles.titleText}>Setup your profile</Text>
        <StepIndicator
          stepCount={5}
          customStyles={secondIndicatorStyles}
          currentPosition={currentPage}
          renderLabel={this._renderItem}
          onPress={position => this.onStepPress(position)}
        />
        {this.renderPage()}
      </View>
    )
  }
}
