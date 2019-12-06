/** @format */

import React, {PureComponent} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import {StackActions} from 'react-navigation'
import * as Animatable from 'react-native-animatable'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  tabBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

class TabBar extends PureComponent {
  onPress = (index, route) => {
    const {navigation} = this.props
    this.refs[`tabItem${index}`].flipInY(900)

    // back to main screen when is staying child route

    if (route.routes && route.routes.length > 1 && index !== 1) {
      navigation.dispatch(StackActions.popToTop({key: route.key, immediate: true}))
    } else {
      navigation.navigate(route.key)
    }
  }

  render() {
    const {navigation, renderIcon, activeTintColor, inactiveTintColor} = this.props
    // const {
    //   Colors: {background},
    // } = theme

    const {routes} = navigation.state

    const ignoreScreen = []

    return (
      <View
        style={[
          styles.tabBar,
          {backgroundColor: Theme.Colors.background, borderTopColor: Theme.Colors.background},
        ]}>
        {routes &&
          routes.map((route, index) => {
            const focused = index === navigation.state.index
            const tintColor = focused ? activeTintColor : inactiveTintColor

            if (ignoreScreen.indexOf(route.key) > -1) {
              return <View key={route.key} />
            }

            return (
              <TouchableWithoutFeedback
                key={route.key}
                style={styles.tab}
                onPress={() => this.onPress(index, route)}>
                <Animatable.View ref={`tabItem${index}`} style={styles.tab}>
                  {renderIcon({
                    route,
                    index,
                    focused,
                    tintColor,
                  })}
                </Animatable.View>
              </TouchableWithoutFeedback>
            )
          })}
      </View>
    )
  }
}

// export default withTheme(TabBar)
export default TabBar
