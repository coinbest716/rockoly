/** @format */

import React from 'react'

import {AppRegistry} from 'react-native'
import App from './App'

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

AppRegistry.registerComponent('rockoly', () => App)
