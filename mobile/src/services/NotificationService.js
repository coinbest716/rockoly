/** @format */

import gql from 'graphql-tag'
import {Alert} from 'react-native'
import {Toast} from 'native-base'
import BaseService from './BaseService'
import {GQL} from '@common'
import {RouteNames} from '@navigation'

export const NOTIFICATION_LIST_EVENT = {
  NOTIFICATION_LIST: 'NOTIFICATION/NOTIFICATION_LIST',
  UPDATING_NOTIFICATION_LIST: 'UPDATING_NOTIFICATION_LIST',
}
class NotificationListService extends BaseService {
  constructor(props) {
    super(props)
    this.notificationList = []
    this.updatedNotifications = []
  }

  notificationSubsForCustomer = customerId => {
    try {
      const gqlValue = GQL.subscription.notification.byCustomerIdGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .subscribe({
          query,
          variables: {
            customerId,
          },
        })
        .subscribe(
          res => {
            this.updatedNotifications = res
            // this.emit(NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST, {
            //   updatedNotifications: res,
            // })
          },
          e => {
            console.log(e)
          }
        )
    } catch (e) {
      console.log('error', e)
    }
  }

  notificationSubsForChef = chefId => {
    try {
      const gqlValue = GQL.subscription.notification.byChefIdGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .subscribe({
          query,
          variables: {
            chefId,
          },
        })
        .subscribe(
          res => {
            this.updatedNotifications = res
            // this.emit(NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST, {
            //   updatedNotifications: res,
            // })
            console.log('listening.......notification')
          },
          e => {
            console.log(e)
          }
        )
    } catch (e) {
      console.log('error', e)
    }
  }

  getCustomerNotificationList = async (customerId, first, offset) => {
    try {
      const gqlValue = GQL.query.notification.filterByCustomerIdGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({
          query,
          variables: {
            customerId,
            first, // total items to be fetched for pagination
            offset, // To start the data from array index
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('getCustomerNotificationList', data)
          if (
            data &&
            data.allNotificationHistories &&
            data.allNotificationHistories.nodes &&
            data.allNotificationHistories.nodes.length > 0
          ) {
            this.emit(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, {
              newNotificationList: data.allNotificationHistories.nodes,
            })
          } else {
            this.emit(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, {newNotificationList: []})
          }
        })
        .catch(e => {
          this.emit(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, {newNotificationList: []})
        })
    } catch (e) {
      this.emit(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, {newNotificationList: []})
    }
  }

  getChefNotificationList = async (chefId, first, offset) => {
    try {
      const gqlValue = GQL.query.notification.filterByChefIdGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({
          query,
          variables: {
            first, // total items to be fetched for pagination
            offset, // To start the data from array index
            chefId,
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          if (
            data &&
            data.allNotificationHistories &&
            data.allNotificationHistories.nodes &&
            data.allNotificationHistories.nodes.length > 0
          ) {
            this.emit(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, {
              newNotificationList: data.allNotificationHistories.nodes,
            })
          } else {
            this.emit(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, {newNotificationList: []})
          }
        })
        .catch(e => {
          this.emit(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, {newNotificationList: []})
        })
    } catch (e) {
      this.emit(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, {newNotificationList: []})
    }
  }

  // clear and clear all notification
  updateStatusNotifications = async clearData => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.notification.updateStatusGQLTag
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: clearData,
          })
          .then(({data}) => {
            if (data && data.updateNotificationStatusByParams) {
              this.emit(NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST, {})
              resolve(true)
            }
          })
          .catch(err => {
            reject(err)
            // Alert.alert('Info', JSON.stringify(err.message))
          })
      } catch (err) {
        reject(err)
        // Alert.alert('Info', JSON.stringify(err.message))
      }
    })
  }

  navigateAndMarkMessageNotification = (
    navigation,
    id,
    markFlag,
    data,
    name,
    pic,
    bookingStatusId
  ) => {
    this.navigateMessageNotification(navigation, id, name, pic, bookingStatusId)
    if (markFlag && data) {
      this.markAsSeen(data)
    }
  }

  navigateAndMarkBookingNotification = (navigation, id, markFlag, data) => {
    this.navigateBookingNotification(navigation, id)
    if (markFlag && data) {
      this.markAsSeen(data)
    }
  }

  markAsSeen = params => {
    this.updateStatusNotifications(params)
      .then(res => {})
      .catch(e => {
        console.log('debugging Error in marking notification', e)
      })
  }

  navigateBookingNotification = (navigation, id) => {
    if (navigation && id) {
      navigation.navigate(RouteNames.BOOKING_DETAIL_SCREEN, {
        bookingHistId: id,
      })
    }
  }

  navigateMessageNotification = (navigation, id, name, pic, bookingStatusId) => {
    if (navigation && id) {
      navigation.navigate(RouteNames.CHAT_DETAIL, {
        conversationId: id,
        conversationName: name,
        conversationPic: pic,
        bookingStatusId,
      })
    }
  }
}

const instance = new NotificationListService()
export default instance

// const allParams = {
//   bookingDetails: details,
//   toSeen: clearData,
//   navigation,
//   from: 'NOTIFICATION_SCREEN'
// }
