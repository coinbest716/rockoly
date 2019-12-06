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
  constructor(props) {
    super(props)
    this.state = {
      showBack: props.showBack,
      showBell: props.showBell,
      title: props.title,
      navigateBackTo: props.navigateBackTo,
      notificationCount: 0,
      resetToStack: props.resetToStack,
    }
  }

  async componentDidMount() {
    this.loadData()
    NotificationListService.on(NOTIFICATION_LIST_EVENT.UPDATING_NOTIFICATION_LIST, this.loadData)
  }

  componentWillReceiveProps(props) {
    this.setState({
      showBack: props.showBack,
      showBell: props.showBell,
      title: props.title,
      navigateBackTo: props.navigateBackTo,
      resetToStack: props.resetToStack,
    })
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
    const {showBell, notificationCount} = this.state
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
        style={[styles.bellView]}
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
    return (
      <View style={styles.container}>
        {this.renderBack()}
        {this.renderTitle()}
        {this.renderBellIcon()}
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
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backContent: {
    alignSelf: 'center',
    marginLeft: 10,
    fontSize: 40,
  },
  titleView: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleContent: {
    alignSelf: 'center',
  },
  bellView: {
    width: '25%',
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
    top: 5,
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
