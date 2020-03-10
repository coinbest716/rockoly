/** @format */

import React from 'react'
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
import {withNavigation} from 'react-navigation'
import {AuthContext} from '../../AuthContext'
import {Theme} from '@theme'
import {RouteNames, ResetStack} from '@navigation'
import {NotificationListService, NOTIFICATION_LIST_EVENT, CommonService} from '@services'

class Header extends React.PureComponent {
  notificationSubs = null

  constructor(props) {
    super(props)
    this.state = {
      showBack: props.showBack,
      showDetail: props.showDetail,
      showBell: props.showBell,
      title: props.title,
      navigateBackTo: props.navigateBackTo,
      notificationCount: 0,
      resetToStack: props.resetToStack,
      bookingHisId: props.bookingHisId,
    }
  }

  async componentDidMount() {
    this.loadData()
    NotificationListService.on(NOTIFICATION_LIST_EVENT.NOTIFICATION_LIST_SUBS, this.loadData)
    NotificationListService.on(NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST, this.loadData)
    this.subscribe()
  }

  componentWillReceiveProps(props) {
    this.setState({
      showBack: props.showBack,
      showBell: props.showBell,
      showDetail: props.showDetail,
      bookingHisId: props.bookingHisId,
      title: props.title,
      navigateBackTo: props.navigateBackTo,
      resetToStack: props.resetToStack,
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
    NotificationListService.off(NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST, this.loadData)
  }

  subscribe = () => {
    const {userRole, currentUser} = this.context
    if (userRole === 'CUSTOMER') {
      if (currentUser && currentUser.customerId) {
        this.notificationSubs = NotificationListService.notificationSubsForCustomer(
          currentUser.customerId
        )
      }
    } else if (userRole === 'CHEF') {
      if (currentUser && currentUser.chefId) {
        this.notificationSubs = NotificationListService.notificationSubsForChef(currentUser.chefId)
      }
    }
  }

  unsubscribe = () => {
    this.notificationSubs &&
      this.notificationSubs.unsubscribe &&
      this.notificationSubs.unsubscribe()
  }

  renderTitle = () => {
    const {title} = this.state

    if (!title) {
      return <View style={styles.titleView} />
    }

    return (
      <View style={[styles.titleView, styles.titleContent]}>
        <Text style={{fontSize: 20, color: Theme.Colors.primary}} numberOfLines={1}>
          {title}
        </Text>
      </View>
    )
  }

  loadData = async () => {
    try {
      const {getProfile, isLoggedIn} = this.context
      if (isLoggedIn) {
        const profile = await getProfile()
        if (profile) {
          this.setState({
            notificationCount: profile.totalUnreadCount,
          })
        }
      }
    } catch (e) {}
  }

  renderBellIcon = () => {
    const {showBell, title, notificationCount} = this.state
    const {navigation} = this.props
    if (!showBell) {
      return <View style={styles.bellView} />
    }
    const numberWrap = number => (
      <View style={styles.numberWrap}>
        <Text style={styles.number}>{number}</Text>
      </View>
    )

    return (
      <TouchableOpacity
        // style={[styles.bellView]}
        onPress={() => {
          navigation.navigate(RouteNames.NOTIFICATION_SCREEN)
        }}>
        <Icon
          type="MaterialCommunityIcons"
          name="bell"
          style={[styles.bellContent, styles.iconColor]}
          onPress={() => {
            navigation.navigate(RouteNames.NOTIFICATION_SCREEN)
          }}
        />
        {notificationCount > 0 && numberWrap(notificationCount)}
      </TouchableOpacity>
    )
  }

  renderDetialIcon = () => {
    const {showDetail, bookingHisId} = this.state
    const {navigation} = this.props
    console.log('bookingDetails', bookingHisId)
    if (!showDetail) {
      return <View style={styles.bellView} />
    }

    return (
      <TouchableOpacity
        // style={[styles.bellView]}
        onPress={() => {
          navigation.navigate(RouteNames.BOOKING_DETAIL_SCREEN, {
            bookingHistId: bookingHisId,
          })
        }}>
        <Icon
          type="MaterialCommunityIcons"
          name="information-outline"
          style={[styles.bellContent, styles.iconColor]}
          onPress={() => {
            navigation.navigate(RouteNames.BOOKING_DETAIL_SCREEN, {
              bookingHistId: bookingHisId,
            })
          }}
        />
      </TouchableOpacity>
    )
  }

  onReset = () => {
    const {navigation} = this.props
    ResetStack(navigation, RouteNames.CUSTOMER_MAIN_TAB, {})
  }

  renderBack = () => {
    const {navigateBackTo, showBack, resetToStack} = this.state
    const {navigation} = this.props
    if (resetToStack) {
      return (
        <View style={[styles.backView]}>
          <Icon
            type="MaterialCommunityIcons"
            name="chevron-left"
            style={[styles.backContent, styles.iconColor]}
            onPress={() => {
              this.onReset()
            }}
          />
        </View>
      )
    }
    if (!showBack) {
      return <View style={styles.backView} />
    }
    return (
      <View style={[styles.backView]}>
        <Icon
          type="MaterialCommunityIcons"
          name="chevron-left"
          style={[styles.backContent, styles.iconColor]}
          onPress={() => {
            if (navigateBackTo) {
              navigation.navigate(navigateBackTo)
            } else {
              navigation.goBack()
            }
          }}
        />
      </View>
    )
  }

  render() {
    const {showBell, showDetail} = this.state
    return (
      <View style={styles.container}>
        {this.renderBack()}
        {this.renderTitle()}
        {showBell ? (
          <View style={styles.bellView}>{this.renderBellIcon()}</View>
        ) : (
          <View style={styles.bellView}>{this.renderDetialIcon()}</View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  container: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  backView: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backContent: {
    alignSelf: 'center',
    marginLeft: 10,
    fontSize: 40,
  },
  titleView: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleContent: {
    alignSelf: 'center',
  },
  bellView: {
    width: '20%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bellContent: {
    alignSelf: 'center',
    marginRight: Platform.OS === 'ios' ? 15 : 10,
    fontSize: 30,
  },
  numberWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 12,
    height: 18,
    minWidth: 18,
    backgroundColor: Theme.Colors.error,
    borderRadius: 9,
  },
  number: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
})

Header.contextType = AuthContext
export default withNavigation(Header)
