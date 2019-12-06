/** @format */
import React from 'react'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import RouteNames from './config/RouteNames'
import CustomerStack from './stack/CustomerStack'
import ChefStack from './stack/ChefStack'
import {ResetStack, ResetAction, NavigateTo} from './helpers/NavHelper'

const Navigator = props => {
  const {isChef} = props
  const initialRouteName = isChef ? RouteNames.CHEF_SWITCH : RouteNames.CUSTOMER_SWITCH

  const AppNavigator = createAppContainer(
    createSwitchNavigator(
      {
        [RouteNames.CUSTOMER_SWITCH]: CustomerStack,
        [RouteNames.CHEF_SWITCH]: ChefStack,
      },
      {
        initialRouteName,
      }
    )
  )
  return <AppNavigator />
}

export {Navigator, ResetStack, ResetAction, RouteNames, NavigateTo}
