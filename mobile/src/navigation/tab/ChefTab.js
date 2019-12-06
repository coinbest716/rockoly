/** @format */
import React from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import {TabBar, TabBarIcon} from '@components'
import {Languages} from '@translations'
import {Images} from '@images'
import {Theme} from '@theme'
import {BookingRequest, ChefProfile, ChefPaymentHistory, CustomerProfile} from '@containers'
import RouteNames from '../config/RouteNames'

const ChefTabNavigator = createBottomTabNavigator(
  {
    [RouteNames.BOOKING_REQUEST_STACK]: {
      screen: BookingRequest,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.chefTab.BookingRequestIcon}
            tintColor={tintColor}
            name={Languages.chefTab.bookingRequest}
          />
        ),
      },
    },
    [RouteNames.CHEF_PAYMENT_HISTORY]: {
      screen: ChefPaymentHistory,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.chefTab.PaymentsIcon}
            tintColor={tintColor}
            name={Languages.chefTab.payments}
          />
        ),
      },
    },
    [RouteNames.CHEF_PROFILE_STACK]: {
      screen: ChefProfile,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.customerTab.ProfileIcon}
            tintColor={tintColor}
            name={Languages.chefTab.profile}
          />
        ),
      },
    },
    [RouteNames.CHEF_SETTING_STACK]: {
      screen: CustomerProfile,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.chefTab.SettingsIcon}
            tintColor={tintColor}
            name={Languages.chefTab.settings}
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
