/** @format */
import React from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import {TabBar, TabBarIcon} from '@components'
import {Languages} from '@translations'
import {Images} from '@images'
import {Theme} from '@theme'
import {BookingRequest, CustomerProfile, ConversationList, BookingHistory, Home} from '@containers'
import RouteNames from '../config/RouteNames'

const ChefTabNavigator = createBottomTabNavigator(
  {
    [RouteNames.HOME_STACK]: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.chefTab.HomeIcon}
            tintColor={tintColor}
            name={Languages.chefTab.home}
          />
        ),
      },
    },
    [RouteNames.CONVERSATION_LIST]: {
      screen: ConversationList,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.customerTab.InboxIcon}
            tintColor={tintColor}
            name={Languages.customerProfile.options.inbox}
          />
        ),
      },
    },
    // [RouteNames.CHEF_PROFILE_STACK]: {
    //   screen: ChefProfile,
    //   navigationOptions: {
    //     tabBarIcon: ({tintColor}) => (
    //       <TabBarIcon
    //         css={{width: 30, height: 30}}
    //         icon={Images.customerTab.ProfileIcon}
    //         tintColor={tintColor}
    //         name={Languages.chefTab.profile}
    //       />
    //     ),
    //   },
    // },
    [RouteNames.BOOKING_HISTORY]: {
      screen: BookingHistory,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.customerTab.BookingHistoryIcon}
            tintColor={tintColor}
            name={Languages.chefTab.reservations}
          />
        ),
      },
    },
    [RouteNames.BOOKING_REQUEST_STACK]: {
      screen: BookingRequest,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.chefTab.BookingRequestIcon}
            tintColor={tintColor}
            name={Languages.chefTab.calender}
          />
        ),
      },
    },
    [RouteNames.CHEF_PROFILE_STACK]: {
      screen: CustomerProfile,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.customerTab.ProfileIcon}
            tintColor={tintColor}
            name={Languages.chefTab.profile}
            customerKey={RouteNames.CHEF_SETTING_STACK}
          />
        ),
      },
    },
  },
  {
    tabBarComponent: TabBar,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      activeTintColor: Theme.Colors.tabBarTint,
      inactiveTintColor: Theme.Colors.tabBarColor,
    },
    lazy: true,
  }
)

export default ChefTabNavigator
