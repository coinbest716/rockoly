/** @format */
import firebase from 'react-native-firebase'
import {Toast} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import gql from 'graphql-tag'
import {Platform} from 'react-native'
import BaseService from './BaseService'
import {GQL} from '@common'

export const PUSH_NOTIFICATION = {
  NOTIFICATION: 'NOTIFICATION',
  CUSTOMER_NOTIFICATION: 'CUSTOMER_NOTIFICATION',
}
class PushNotificationService extends BaseService {
  constructor() {
    super()
    this.token = ''
  }

  syncToken = async userId => {
    const token = await this.regToken()

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('no token'))
      }
      const gqlValue = GQL.mutation.devicetoken.addUserDeviceTokenGQLTAG
      const mutation = gql`
        ${gqlValue}
      `
      try {
        console.log('debugging token', token)
        this.client
          .mutate({
            mutation,
            variables: {
              userId,
              userDeviceType: Platform.OS && Platform.OS.toUpperCase(),
              userDeviceToken: token,
            },
          })
          .then(({data}) => {
            if (
              data &&
              data.createUserDeviceToken &&
              data.createUserDeviceToken.userDeviceToken &&
              data.createUserDeviceToken.userDeviceToken.userDeviceTokenId
            ) {
              resolve(true)
              // push notification token saved
            } else {
              reject(new Error('token not saved'))
            }
            console.log('debugging token saved', data)
          })
          .catch(e => {
            console.log(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  removeToken = async () => {
    const token = await this.regToken()

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('no token'))
      }
      const gqlValue = GQL.mutation.devicetoken.removeUserDeviceTokenGQLTAG
      const mutation = gql`
        ${gqlValue}
      `
      try {
        this.client
          .mutate({
            mutation,
            variables: {
              pDeviceToken: token,
            },
          })
          .then(({data}) => {
            if (
              data &&
              data.removeUserDeviceToken &&
              data.removeUserDeviceToken.procedureResult &&
              data.removeUserDeviceToken.procedureResult.success
            ) {
              resolve(true)
              // push notification token saved
            } else {
              reject(new Error('token not cleared'))
            }
            console.log('debugging token removed', data)
          })
          .catch(e => {
            console.log(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  regToken = async () => {
    const fcmToken = await firebase.messaging().getToken()
    if (fcmToken) {
      return fcmToken
    }
    return null
  }

  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    console.log('NOTIFICATION token', fcmToken)
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken()
      console.log('NOTIFICATION token', fcmToken)
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken)
      }
    }
  }

  notificationChefStatus = async (chefUserId, notificationStatus) => {
    console.log('chefUserId', chefUserId, notificationStatus)
    const followUnfollow = GQL.mutation.chef.updateNotificationGQLTAG
    const mutation = gql`
      ${followUnfollow}
    `
    const {data} = await this.client.mutate({
      mutation,
      variables: {
        chefId: chefUserId,
        isNotificationYn: notificationStatus,
      },
    })
    console.log(data, 'data value')
    if (data === undefined) {
      this.emit(PUSH_NOTIFICATION.NOTIFICATION, {})
      console.log('data value1', data)
    } else if (data.code) {
      this.emit(PUSH_NOTIFICATION.NOTIFICATION, {})
      console.log('data value2', data)
    } else {
      console.log(data, 'dateValue')
      this.notification = data
      console.log(this.notification, 'this.notification')
      this.emit(PUSH_NOTIFICATION.NOTIFICATION, {notification: data})
      if (this.notification.updateChefProfileByChefId.chefProfile.isNotificationYn === true) {
        Toast.show({
          text: 'Notification turned on',
          buttonText: 'Okay',
          duration: 3000,
        })
      } else if (
        this.notification.updateChefProfileByChefId.chefProfile.isNotificationYn === false
      ) {
        Toast.show({
          text: 'Notification turned off',
          buttonText: 'Okay',
          duration: 3000,
        })
      }
    }
  }

  notificationCustomerStatus = async (customerUserId, notificationStatus) => {
    console.log('chefUserId', customerUserId, notificationStatus)
    const followUnfollow = GQL.mutation.customer.updateNotificationGQLTAG
    const mutation = gql`
      ${followUnfollow}
    `
    const {data} = await this.client.mutate({
      mutation,
      variables: {
        customerId: customerUserId,
        isNotificationYn: notificationStatus,
      },
    })
    console.log(data, 'data value')
    if (data === undefined) {
      this.emit(PUSH_NOTIFICATION.NOTIFICATION, {})
      console.log('data value1', data)
    } else if (data.code) {
      this.emit(PUSH_NOTIFICATION.NOTIFICATION, {})
      console.log('data value2', data)
    } else {
      this.customerNotification = data
      console.log(
        'this.customer',
        this.customerNotification.updateCustomerProfileByCustomerId.customerProfile.isNotificationYn
      )
      this.emit(PUSH_NOTIFICATION.CUSTOMER_NOTIFICATION, {customerNotification: data})
      if (
        this.customerNotification.updateCustomerProfileByCustomerId.customerProfile
          .isNotificationYn === true
      ) {
        Toast.show({
          text: 'Notification turned on',
          buttonText: 'Okay',
          duration: 3000,
        })
      } else if (
        this.customerNotification.updateCustomerProfileByCustomerId.customerProfile
          .isNotificationYn === false
      ) {
        Toast.show({
          text: 'Notification turned off',
          buttonText: 'Okay',
          duration: 3000,
        })
      }
    }
  }

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission()
    if (enabled) {
      this.getToken()
    } else {
      this.requestPermission()
    }
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission()
      this.getToken()
    } catch (error) {
      console.log('permission rejected')
    }
  }

  createNotificationListeners = async () => {
    console.log('NOTIFICATION started listener')
    firebase.notifications().onNotification(notification => {
      console.log('NOTIFICATION got notification', notification)
      notification.android.setChannelId('rockoly_default_channel').setSound('default')
      firebase.notifications().displayNotification(notification)
    })

    // const notificationOpen = await firebase.notifications().getInitialNotification()
    firebase.notifications().onNotificationOpened(notificationOpen => {
      console.log('NOTIFICATION OPENED', notificationOpen)
      console.log('NOTIFICATION OPENED', notificationOpen.notification.data)
    })
  }
}

const instance = new PushNotificationService()
export default instance
