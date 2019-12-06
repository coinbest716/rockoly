/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  container: {
    flex: 1,
  },
  notificationSwitch: {
    marginVertical: 20,
    borderBottomWidth: 0,
    marginHorizontal: 20,
    paddingLeft: 20,
    paddingRight: 10,
  },
  label: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 10,
  },
})
export default styles
