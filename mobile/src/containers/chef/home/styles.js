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
  cardStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 20,
    marginTop: 5,
  },
  textStyle: {
    fontSize: 14,
    marginLeft: 5,
    marginTop: '1%',
    lineHeight: 22,
    textAlign: 'center',
  },
}
