/** @format */

import React, {PureComponent} from 'react'
import {Text, View, Image, Alert, TouchableOpacity} from 'react-native'
import {Button, Icon} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import {
  NotificationListService,
  NOTIFICATION_LIST_EVENT,
  COMMON_LIST_NAME,
  CommonService,
} from '@services'
import {AuthContext} from '../../../AuthContext'
import styles from './styles'
import {Images} from '@images'
import {Header, CommonList} from '@components'
import {Languages} from '@translations'
import {displayDateFormat} from '@utils'

class Notifications extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      notificationList: [],
      notificationData: [],
      isFetching: true,
      isFetchingMore: false,
      canLoadMore: false,
      first: 50,
      offset: 0,
      totalCount: 0,
    }
  }

  async componentDidMount() {
    // NotificationListService.on(NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST, this.reload)
    NotificationListService.on(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, this.setList)
    this.getTotalCount()
  }

  componentWillUnmount = () => {
    // NotificationListService.off(NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST, this.reload)
    NotificationListService.off(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST, this.setList)
  }

  getTotalCount = () => {
    const {userRole, currentUser} = this.context
    if (userRole === 'CUSTOMER') {
      NotificationListService.notificationSubsForCustomer(currentUser.customerId)
      this.onLoadTotalCount(COMMON_LIST_NAME.CUSTOMER_NOTIFICATION, {
        customerId: currentUser.customerId,
      })
    } else if (userRole === 'CHEF') {
      NotificationListService.notificationSubsForChef(currentUser.chefId)
      this.onLoadTotalCount(COMMON_LIST_NAME.CHEF_NOTIFICATION, {chefId: currentUser.chefId})
    }
  }

  fetchNoticationList = () => {
    const {userRole, currentUser} = this.context
    const {first, offset} = this.state

    if (userRole === 'CUSTOMER') {
      NotificationListService.getCustomerNotificationList(currentUser.customerId, first, offset)
    } else if (userRole === 'CHEF') {
      NotificationListService.getChefNotificationList(currentUser.chefId, first, offset)
    }
  }

  setList = ({newNotificationList}) => {
    const {notificationList, totalCount} = this.state
    // const updatedNotificationList = [...notificationList, ...newNotificationList]
    this.setState(
      {
        isFetching: false,
        isFetchingMore: false,
        // notificationList: updatedNotificationList,
        // canLoadMore: updatedNotificationList.length < totalCount,
        notificationList: newNotificationList,
        canLoadMore: newNotificationList.length < totalCount,
      },
      () => {
        this.storeNotificationData()
      }
    )
  }

  reload = () => {
    this.setState(
      {
        totalCount: 0,
        first: 50,
        offset: 0,
        notificationList: [],
        isFetching: true,
      },
      () => {
        this.getTotalCount()
      }
    )
  }

  // Store sent and seen notification seperately
  storeNotificationData = () => {
    const {notificationList} = this.state
    let seenCount = 0
    let unSeenCount = 0
    if (notificationList && notificationList.length > 0) {
      const temp = notificationList.map(item => {
        if (item.notificationStatusId.trim() === 'SENT') {
          unSeenCount++
          return {
            ...item,
            unreadItem: true,
            type: 1,
            unSeenIndex: unSeenCount,
          }
        }
        if (item.notificationStatusId.trim() === 'SEEN') {
          seenCount++
          return {
            ...item,
            unreadItem: false,
            type: 2,
            seenIndex: seenCount,
          }
        }
        return {
          ...item,
          unreadItem: false,
          type: null,
        }
      })
      const data = _.orderBy(temp, ['type'], ['asc'])
      this.setState({notificationData: data})
    } else {
      this.setState({notificationData: []})
    }
  }

  onLoadTotalCount = (type, filter) => {
    CommonService.getTotalCount(type, filter)
      .then(totalCount => {
        this.setState(
          {
            totalCount,
          },
          () => {
            this.fetchNoticationList()
          }
        )
      })
      .catch(e => {
        console.log('debugging error on setting the total count in notification screen', e)
        this.setState({
          totalCount: 0,
        })
      })
  }

  retrieveMore = async () => {
    const {currentUser, userRole} = this.context
    const {canLoadMore, notificationList, first, offset} = this.state

    if (!canLoadMore) {
      return
    }

    // const newOffset = notificationList.length
    const newFirst = notificationList.length + first
    this.setState(
      {
        // offset: newOffset,
        first: newFirst,
        isFetchingMore: true,
      },
      () => {
        if (userRole === 'CUSTOMER') {
          NotificationListService.getCustomerNotificationList(
            currentUser.customerId,
            newFirst,
            offset
          )
        } else if (userRole === 'CHEF') {
          NotificationListService.getChefNotificationList(currentUser.chefId, newFirst, offset)
        }
      }
    )
  }

  dismissOne = (id, status) => {
    this.updateStatus(id, status)
  }

  markAlert = (id, status) => {
    Alert.alert(
      '',
      Languages.notifications.alert.mark_alert,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.updateStatus(id, status)
          },
        },
      ],
      {cancelable: false}
    )
  }

  clearAlert = (id, status) => {
    Alert.alert(
      '',
      Languages.notifications.alert.clear_alert,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.updateStatus(id, status)
          },
        },
      ],
      {cancelable: false}
    )
  }

  markAsSeenAndNavigate = details => {
    const {navigation} = this.props
    const {currentUser, userRole} = this.context
    const notificationData = JSON.parse(details.notificationDetails)

    console.log('notificationData', notificationData)

    let bookingId
    let conversationId

    if (
      notificationData &&
      notificationData.booking &&
      notificationData.booking.chef_booking_hist_id
    ) {
      bookingId = notificationData.booking.chef_booking_hist_id
    }

    if (
      notificationData &&
      notificationData.message &&
      notificationData.message.conversation_hist_id
    ) {
      conversationId = notificationData.message.conversation_hist_id
    }

    const markData = {
      pChefId: userRole === 'CHEF' ? currentUser.chefId : null,
      pCustomerId: userRole === 'CUSTOMER' ? currentUser.customerId : null,
      pAdminId: null,
      pStatusId: 'SEEN',
      pNotificationId: details.notificationHistId,
    }

    if (
      details.notificationAreaType === 'CUSTOMER_REQUESTED_BOOKING' ||
      details.notificationAreaType === 'CUSTOMER_CANCELLED_BOOKING' ||
      details.notificationAreaType === 'CHEF_COMPLETED_BOOKING' ||
      details.notificationAreaType === 'CHEF_ACCEPTED_BOOKING' ||
      details.notificationAreaType === 'CHEF_CANCELLED_BOOKING' ||
      details.notificationAreaType === 'CHEF_REJECTED_BOOKING' ||
      details.notificationAreaType === 'CUSTOMER_REFUND_AMOUNT_SUCCESS' ||
      details.notificationAreaType === 'CUSTOMER_REFUND_AMOUNT_FAILED' ||
      details.notificationAreaType === 'CHEF_AMOUNT_TRANSFER_SUCCESS' ||
      details.notificationAreaType === 'CHEF_AMOUNT_TRANSFER_FAILED'
    ) {
      // Service call
      NotificationListService.navigateAndMarkBookingNotification(
        navigation,
        bookingId,
        details.unreadItem,
        markData
      )
    } else if (details.notificationAreaType === 'NEW_MESSAGE') {
      // Service call
      NotificationListService.navigateAndMarkMessageNotification(
        navigation,
        conversationId,
        details.unreadItem,
        markData,
        notificationData.details.name,
        notificationData.details.pic,
        notificationData.booking.chef_booking_status_id
      )
    }
  }

  updateStatus = (id, status) => {
    const {currentUser, userRole} = this.context
    const clearData = {
      pChefId: userRole === 'CHEF' ? currentUser.chefId : null,
      pCustomerId: userRole === 'CUSTOMER' ? currentUser.customerId : null,
      pAdminId: null,
      pStatusId: status,
      pNotificationId: id,
    }
    NotificationListService.updateStatusNotifications(clearData)
      .then(res => {
        if (res) {
          this.reload()
        }
      })
      .catch(e => {
        console.log('debugging error on update notification status')
      })
  }

  renderRow = ({item: details, index}) => {
    const notificationDetails = JSON.parse(details.notificationDetails)
    const {isChef} = this.context

    const status = details.notificationAreaType ? details.notificationAreaType.trim() : ''
    let profilePic = ``
    let message = ``

    if (
      notificationDetails &&
      !notificationDetails.role &&
      (notificationDetails.chef !== null || notificationDetails.customer !== null)
    ) {
      if (isChef) {
        if (notificationDetails.customer) {
          profilePic =
            notificationDetails.customer && notificationDetails.customer.customer_pic !== null
              ? {uri: notificationDetails.customer.customer_pic}
              : Images.common.defaultChefProfile
        }

        if (status === 'CUSTOMER_REQUESTED_BOOKING') {
          const bookingDate = moment(
            moment.utc(notificationDetails.booking.chef_booking_from_time).local()
          ).format(displayDateFormat)
          message = `${notificationDetails.customer.name} has requested new booking on ${bookingDate}`
        } else if (status === 'CUSTOMER_CANCELLED_BOOKING') {
          message = `${notificationDetails.customer.name} has cancelled the booking request`
        } else if (status === 'CHEF_AMOUNT_TRANSFER_SUCCESS') {
          message = `${notificationDetails.customer.name} has transferred amount successfullly`
        } else if (status === 'CHEF_AMOUNT_TRANSFER_FAILED') {
          message = `${notificationDetails.customer.name} has transferred amount failed`
        }
      } else if (!isChef) {
        if (notificationDetails.chef) {
          profilePic =
            notificationDetails.chef && notificationDetails.chef.chef_pic !== null
              ? {uri: notificationDetails.chef.chef_pic}
              : Images.common.defaultChefProfile
        }

        if (status === 'CHEF_ACCEPTED_BOOKING') {
          message = `${notificationDetails.chef.name} has accepted the booking request`
        } else if (status === 'CHEF_REJECTED_BOOKING') {
          message = `${notificationDetails.chef.name} has rejected the booking request`
        } else if (status === 'CHEF_CANCELLED_BOOKING') {
          message = `${notificationDetails.chef.name} has cancelled the booking request`
        } else if (status === 'CHEF_COMPLETED_BOOKING') {
          message = `${notificationDetails.chef.name} has completed the booking request`
        } else if (status === 'CUSTOMER_REFUND_AMOUNT_SUCCESS') {
          message = `${notificationDetails.chef.name} has refunded amount successfully`
        } else if (status === 'CUSTOMER_REFUND_AMOUNT_FAILED') {
          message = `${notificationDetails.chef.name} has refunded amount failed`
        }
      }
    } else if (notificationDetails && notificationDetails.message && notificationDetails.role) {
      if (notificationDetails.role === 'CHEF') {
        profilePic =
          notificationDetails.details &&
          notificationDetails.details.pic !== null &&
          notificationDetails.details.pic !== ''
            ? {uri: notificationDetails.details.pic}
            : Images.common.defaultChefProfile

        if (status === 'NEW_MESSAGE') {
          message = `${notificationDetails.details.name} has send a new message`
        }
      } else if (notificationDetails.role === 'CUSTOMER') {
        profilePic =
          notificationDetails.details &&
          notificationDetails.details.pic !== null &&
          notificationDetails.details.pic !== ''
            ? {uri: notificationDetails.details.pic}
            : Images.common.defaultChefProfile

        if (status === 'NEW_MESSAGE') {
          message = `${notificationDetails.details.name} has send a new message`
        }
      }
    }

    return (
      <View key={index} style={{marginHorizontal: 5}}>
        {details.unSeenIndex && details.unSeenIndex === 1 && (
          <View style={styles.notificationTextView}>
            <Text style={styles.notificationTitleText}>
              {Languages.notification.unseenNotifications}
            </Text>
            <Button
              style={styles.notificationActionButton}
              transparent
              onPress={() => {
                this.markAlert(null, 'SEEN')
              }}>
              <Text style={styles.notificationActionText}>{Languages.notification.markAll}</Text>
            </Button>
          </View>
        )}
        {details.seenIndex && details.seenIndex === 1 && (
          <View style={styles.notificationTextView}>
            <Text style={styles.notificationTitleText}>
              {Languages.notification.seenNotifications}
            </Text>
            <Button
              transparent
              style={styles.notificationActionButton}
              onPress={() => {
                this.clearAlert(null, 'DISMISSED')
              }}>
              <Text style={styles.notificationActionText}>{Languages.notification.clearAll}</Text>
            </Button>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            this.markAsSeenAndNavigate(details)
          }}
          style={details.unreadItem === true ? styles.unSeencontainer : styles.normalContainer}>
          <View style={styles.body}>
            <View style={styles.imageStyle}>
              <Image style={styles.userImage} source={profilePic} />
            </View>
            <View style={styles.textView}>
              <Text style={styles.textStyle}>{message}</Text>
            </View>
            {details.unreadItem === false && (
              <Icon
                type="FontAwesome"
                style={styles.clearIcon}
                name="times-circle"
                onPress={() => {
                  this.dismissOne(details.notificationHistId, 'DISMISSED')
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const {isLoggedIn} = this.context
    const {notificationData, isFetching, canLoadMore, isFetchingMore} = this.state

    return (
      <View style={styles.container}>
        <Header showBack showTitle title="Notifications" />
        {isLoggedIn === false ? (
          <View style={styles.alignScreenCenter}>
            <Text style={styles.destext}>{Languages.notifications.labels.notification_empty}</Text>
          </View>
        ) : (
          <CommonList
            keyExtractor="notificationHistId"
            canLoadMore={canLoadMore}
            data={notificationData}
            renderItem={this.renderRow}
            isFetching={isFetching}
            isFetchingMore={isFetchingMore}
            loadMore={this.retrieveMore}
            reload={this.reload}
            emptyDataMessage={Languages.notifications.labels.notification_empty}
          />
        )}
      </View>
    )
  }
}

Notifications.contextType = AuthContext
export default Notifications
