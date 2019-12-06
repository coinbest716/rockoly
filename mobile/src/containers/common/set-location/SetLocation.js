/* eslint-disable prettier/prettier */
/** @format */

import React, {PureComponent} from 'react'
import {View} from 'react-native'
import {Address } from '@containers'
import {Header} from '@components'
import {Languages} from '@translations'
import {AuthContext} from '@services'
import {RouteNames} from '@navigation'
import styles from './styles'

class SetLocation extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  navigateOnSave = () => {
    const {navigation} = this.props
    navigation.navigate(RouteNames.BASIC_EDIT_PROFILE)
  }

  render() {
    const {navigation} = this.props
    return (
      <View style={styles.container}>
        <Header showBack showTitle title={Languages.setLocation.title} />
       <Address navigation={navigation} onSave={this.navigateOnSave} />
      </View>
    )
  }
}

SetLocation.contextType = AuthContext

export default SetLocation
