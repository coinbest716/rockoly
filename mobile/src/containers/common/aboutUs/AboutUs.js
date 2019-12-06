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
    this.state = {
      isLoading: false,
    }
  }

  render() {
    const {isLoading} = this.state

    return (
      <View style={styles.mainView}>
        <Header showBack title="About Us" showBell={false} />
        <View>
          <Text> About Us</Text>
        </View>
        {/* {isLoading ? <Spinner animating mode="full" /> : null} */}
      </View>
    )
  }
}
