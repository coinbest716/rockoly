/** @format */

import React, {PureComponent} from 'react'
import {View, Text, Image, ScrollView, Platform} from 'react-native'
import {Header, Spinner} from '@components'
import IntroMessage from '../components/intro-message/IntroMessage'
import RateService from '../components/rate-service/RateService'
import OptionList from '../components/option-list/OptionList'
import ChefExperience from '../components/chef-experience/ChefExperience'
import Complexity from '../components/complexity/Complexity'
import Awards from '../components/awards/Awards'
import Gallery from '../components/gallery/Gallery'
import Attachments from '../components/attachments/Attachments'
import BasicEditProfile from '../../customer/components/display-picture/DisplayPicture'
import styles from '../../customer/customer-profile/styles'

class CustomerEditProfile extends PureComponent {
  EDIT_PROFILE_SCREENS = {}

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      screenName: {},
    }
    this.EDIT_PROFILE_SCREENS = {
      INTRO_MESSAGE: {
        type: 'INTRO_MESSAGE',
        title: 'Intro Message',
      },
      RATE: {
        type: 'RATE',
        title: 'Rate',
      },
      NUMBER_OF_GUESTS: {
        type: 'NUMBER_OF_GUESTS',
        title: 'Number of guests',
      },
      OPTION_LIST: {
        type: 'OPTION_LIST',
        title: 'Additional Service',
      },
      CHEF_EXPERIENCE: {
        type: 'CHEF_EXPERIENCE',
        title: 'Specialties / Experience',
      },
      COMPLEXITY: {
        type: 'COMPLEXITY',
        title: 'Complexity',
      },
      AWARDS: {
        type: 'AWARDS',
        title: 'Awards',
      },
      DISPLAY_PICTURE: {
        type: 'DISPLAY_PICTURE',
        title: 'Profile Picture',
      },
      GALLERY: {
        type: 'GALLERY',
        title: 'Gallery',
      },
      ATTACHMENT: {
        type: 'ATTACHMENT',
        title: 'Documents',
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
    console.log('title', this.EDIT_PROFILE_SCREENS.INTRO_MESSAGE.title)
    if (screenName === this.EDIT_PROFILE_SCREENS.INTRO_MESSAGE.type) {
      return this.EDIT_PROFILE_SCREENS.INTRO_MESSAGE.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.RATE.type) {
      return this.EDIT_PROFILE_SCREENS.RATE.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.NUMBER_OF_GUESTS.type) {
      return this.EDIT_PROFILE_SCREENS.NUMBER_OF_GUESTS.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.OPTION_LIST.type) {
      return this.EDIT_PROFILE_SCREENS.OPTION_LIST.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.CHEF_EXPERIENCE.type) {
      return this.EDIT_PROFILE_SCREENS.CHEF_EXPERIENCE.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.COMPLEXITY.type) {
      return this.EDIT_PROFILE_SCREENS.COMPLEXITY.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.AWARDS.type) {
      return this.EDIT_PROFILE_SCREENS.AWARDS.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.DISPLAY_PICTURE.type) {
      return this.EDIT_PROFILE_SCREENS.DISPLAY_PICTURE.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.GALLERY.type) {
      return this.EDIT_PROFILE_SCREENS.GALLERY.title
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.ATTACHMENT.type) {
      return this.EDIT_PROFILE_SCREENS.ATTACHMENT.title
    }
  }

  renderComponent = screenName => {
    console.log('screenName', screenName)
    if (screenName === this.EDIT_PROFILE_SCREENS.INTRO_MESSAGE.type) {
      return <IntroMessage />
    }
    // if (screenName === this.EDIT_PROFILE_SCREENS.RATE_SERVICE.type) {
    //   return <RateService />
    // }
    if (screenName === this.EDIT_PROFILE_SCREENS.RATE.type) {
      return <RateService showRate />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.NUMBER_OF_GUESTS.type) {
      return <RateService showService />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.OPTION_LIST.type) {
      return <OptionList />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.CHEF_EXPERIENCE.type) {
      return <ChefExperience />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.COMPLEXITY.type) {
      return <Complexity />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.AWARDS.type) {
      return <Awards />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.DISPLAY_PICTURE.type) {
      return <BasicEditProfile />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.GALLERY.type) {
      return <Gallery />
    }
    if (screenName === this.EDIT_PROFILE_SCREENS.ATTACHMENT.type) {
      return <Attachments />
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
      console.log('screenValue', screenName)
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
