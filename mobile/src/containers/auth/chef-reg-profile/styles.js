/** @format */

import {StyleSheet, I18nManager} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
    height: '100%',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 10,
  },
})

export default styles
