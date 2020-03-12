/** @format */

import React, {PureComponent} from 'react'
import {View} from 'react-native'
import {Text} from 'native-base'
import {Header, Spinner} from '@components'
import styles from './styles'
import {RouteNames} from '@navigation'

export default class AboutUs extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={styles.mainView}>
        <Header showBack title="About Us" showBell={false} />
        <View style={{marginHorizontal: 15, marginVertical: 15}}>
          <Text style={{fontSize: 16, lineHeight: 25}}>
            Started by two Boston guys, Rockoly is a platform connecting private chefs to hungry
            customers. We seek to demystify private chef industry by providing clear transparent
            pricing based on our unique pricing model and easy booking process. No longer will
            customers be overcharged for having a "wedding" vs "anything but the wedding". No longer
            will customers be overcharged for having lobster instead of chicken and rice because of
            3x ingredients cost pricing model. Join the revolution and let's bring healthy gourmet
            cooking to your home.
          </Text>
        </View>
      </View>
    )
  }
}
