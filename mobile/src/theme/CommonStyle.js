/** @format */

import {StyleSheet} from 'react-native'
import Colors from './Colors'

const CommonStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconColor: {
    color: Colors.primary,
  },
  spinner: {
    marginVertical: 20,
  },
  alignScreenCenter: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // btnCommon: {
  //   backgroundColor: Colors.primary,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 25,
  // },
  // btnTextCommon: {
  //   color: Colors.btnTextColor,
  // },
})
export default CommonStyle
