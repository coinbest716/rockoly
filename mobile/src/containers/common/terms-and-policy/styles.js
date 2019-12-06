/** @format */

import {StyleSheet, Platform} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
})

export default {
  styles,
  mainView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
}
