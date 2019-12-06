/** @format */

import React, {PureComponent} from 'react'
import {View} from 'react-native'
import {Text} from 'native-base'
import {Header, Spinner} from '@components'
import styles from './styles'
import {RouteNames} from '@navigation'

export default class TermsAndPolicy extends PureComponent {
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
        <Header showBack title="Terms and Policy" showBell={false} />
        <View>
          <Text> Terms and Policy</Text>
        </View>
        {/* {isLoading ? <Spinner animating mode="full" /> : null} */}
      </View>
    )
  }
}
