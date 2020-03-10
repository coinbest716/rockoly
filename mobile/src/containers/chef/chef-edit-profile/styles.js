/** @format */

import {StyleSheet, Dimensions, Platform} from 'react-native'
import {Theme} from '@theme'

const {width, height} = Dimensions.get('window')
export const SCREEN_WIDTH = Dimensions.get('window').width - 200
export const SCREEN_HEIGHT = Dimensions.get('window').height
export default StyleSheet.create({
  ...Theme.CommonStyle,
})
