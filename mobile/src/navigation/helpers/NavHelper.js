/** @format */
import {StackActions, NavigationActions, SwitchActions} from 'react-navigation'
import TransitionConfig from '../config/TransitionConfig'

export const StackNavConfig = {
  transitionConfig: () => TransitionConfig,
  headerMode: 'none',
  header: null,
}

export const ResetStack = (navigation, routeName, params) => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName, params})],
  })
  navigation.dispatch(resetAction)
}

export const ResetTab = (navigation, routeName) => {
  navigation.dispatch(SwitchActions.jumpTo({routeName}))
}

export const ResetAction = (navigation, routeName) => {
  navigation.dispatch({
    type: 'Navigation/NAVIGATE',
    routeName,
  })
}

export const NavigateTo = (navigation, routeName, screenName) => {
  Promise.all([
    navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName})],
      })
    ),
  ]).then(() => navigation.navigate(screenName))
}
