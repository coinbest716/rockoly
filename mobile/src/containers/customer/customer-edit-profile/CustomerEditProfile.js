/** @format */

import React, {PureComponent} from 'react'
import {View, Text, Image, ScrollView, Platform} from 'react-native'
import {Header, Spinner} from '@components'
import Allergies from '../components/allergies/Allergies'
import Dietary from '../components/dietary/Dietary'
import KitchenEquipment from '../components/kitchen-equipment/KitchenEquipment'
import FavouriteCuisine from '../components/favorite-cuisine/FavouriteCuisine'
import styles from '../customer-profile/styles'

class CustomerEditProfile extends PureComponent {
  EDIT_PROFILE_SCREENS = {}

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      screenName: {},
    }
    this.EDIT_PROFILE_SCREENS = {
      ALLERGIES: {
        type: 'ALLERGIES',
        title: 'Allergies',
      },
      DIETARY: {
        type: 'DIETARY',
        title: 'Dietary',
      },
      KITCHEN: {
        type: 'KITCHEN_EQUIPMENT',
        title: 'Kitchen Equipment',
      },
      CUISINE: {
        type: 'FAVOURITE_CUISINE',
        title: 'Favourite Cuisine',
      },
    }
  }

  componentDidMount() {
    try {
      const {navigation} = this.props
      console.log('navigation.state.params.screen', navigation.state.params.screen)
      if (
        navigation &&
        navigation.state &&
        navigation.state.params &&
        navigation.state.params.screen
      ) {
        this.setState({
          screenName: navigation.state.params.screen,
          isLoading: false,
        })
      }
    } catch (e) {}
  }

  getTitle = screenName => {
    if (screenName === this.EDIT_PROFILE_SCREENS.ALLERGIES.type) {
      return this.EDIT_PROFILE_SCREENS.ALLERGIES.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.DIETARY.type) {
      return this.EDIT_PROFILE_SCREENS.DIETARY.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.KITCHEN.type) {
      return this.EDIT_PROFILE_SCREENS.KITCHEN.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.CUISINE.type) {
      return this.EDIT_PROFILE_SCREENS.CUISINE.title
    }
  }

  renderComponent = screenName => {
    if (screenName === this.EDIT_PROFILE_SCREENS.ALLERGIES.type) {
      return <Allergies />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.DIETARY.type) {
      return <Dietary />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.KITCHEN.type) {
      return <KitchenEquipment />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.CUISINE.type) {
      return <FavouriteCuisine />
    }
    return null
  }

  render() {
    const {isLoading, screenName} = this.state
    console.log('screenName', screenName)
    if (isLoading) {
      return (
        <View style={styles.alignScreenCenter}>
          <Spinner animating mode="full" />
        </View>
      )
    }

    if (screenName) {
      return (
        <View style={styles.container}>
          <Header showBack title={this.getTitle(screenName)} />
          <View style={{flex: 1, flexGrow: 1}}>{this.renderComponent(screenName)}</View>
        </View>
      )
    }
    return null
  }
}
export default CustomerEditProfile
