/** @format */

import React, {Component} from 'react'
import {Switch, View, Text} from 'react-native'
import {Item, Icon, Right} from 'native-base'
import {PushNotificationService, PUSH_NOTIFICATION} from '@services'
import {AuthContext} from '../../../AuthContext'
import {Theme} from '@theme'
import {Languages} from '@translations'
import {Header} from '@components'
import styles from './Styles'

class NotificationSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notificationStatus: false,
    }
  }

  async componentDidMount() {
    this.loadData()
  }

  loadData = async () => {
    const {isLoggedIn, getProfile} = this.context

    if (isLoggedIn) {
      const profile = await getProfile()

      this.setState({
        notificationStatus: profile.isNotificationYn,
      })
    }
  }

  changeNotification = async () => {
    const {notificationStatus} = this.state
    const {isChef, currentUser} = this.context

    this.setState(
      {
        notificationStatus: !notificationStatus,
      },
      () => {
        if (isChef && currentUser && currentUser.chefId) {
          PushNotificationService.on(PUSH_NOTIFICATION.NOTIFICATION, this.notification)
          PushNotificationService.notificationChefStatus(
            currentUser.chefId,
            this.state.notificationStatus
          )
        } else if (currentUser && currentUser.customerId) {
          PushNotificationService.on(PUSH_NOTIFICATION.CUSTOMER_NOTIFICATION, this.notification)
          PushNotificationService.notificationCustomerStatus(
            currentUser.customerId,
            this.state.notificationStatus
          )
        }
      }
    )
  }

  render() {
    const {notificationStatus} = this.state
    return (
      <View style={styles.container}>
        <Header showBack showTitle title="Notification" />
        <Item style={styles.notificationSwitch}>
          <Icon style={styles.iconColor} type="MaterialCommunityIcons" active name="bell-outline" />
          <Text style={styles.label}>
            {Languages.NotificationSettings.options.push_notification}
          </Text>
          <Right>
            <Switch
              trackColor={{true: Theme.Colors.accent}}
              onChange={() => this.changeNotification()}
              value={notificationStatus}
            />
          </Right>
        </Item>
      </View>
    )
  }
}

NotificationSettings.contextType = AuthContext
export default NotificationSettings
