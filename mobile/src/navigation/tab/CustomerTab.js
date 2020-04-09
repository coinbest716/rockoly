/** @format */
import React from 'react'
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation'
import {TabBar, TabBarIcon} from '@components'
import {Languages} from '@translations'
import {Images} from '@images'
import {Theme} from '@theme'
import {
  SearchLocation,
  BookingHistory,
  ConversationList,
  CustomerProfile,
  ChefList,
  Favourite,
} from '@containers'
import RouteNames from '../config/RouteNames'
import {StackNavConfig} from '../helpers/NavHelper'

const FindChefStack = createStackNavigator(
  {
    [RouteNames.CHEF_LIST_SCREEN]: ChefList,
    [RouteNames.SEARCH_LOCATION]: SearchLocation,
  },
  {...StackNavConfig}
)

const CustomerTabNavigator = createBottomTabNavigator(
  {
    [RouteNames.FIND_CHEF_STACK]: {
      screen: FindChefStack,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.customerTab.FindChefIcon}
            tintColor={tintColor}
            name={Languages.customerTab.search}
          />
        ),
      },
    },
    [RouteNames.FAVOURITE_STACK]: {
      screen: Favourite,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.customerTab.FavoriteChefIcon}
            tintColor={tintColor}
            name={Languages.customerTab.saved}
          />
        ),
      },
    },
    [RouteNames.BOOKING_HISTORY_STACK]: {
      screen: BookingHistory,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.customerTab.BookingHistoryIcon}
            tintColor={tintColor}
            name={Languages.customerTab.events}
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

    [RouteNames.CUSTOMER_PROFILE_STACK]: {
      screen: CustomerProfile,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <TabBarIcon
            css={{width: 30, height: 30}}
            icon={Images.customerTab.ProfileIcon}
            tintColor={tintColor}
            name={Languages.customerTab.profile}
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

export default CustomerTabNavigator
