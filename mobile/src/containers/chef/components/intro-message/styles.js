/** @format */

import {StyleSheet, I18nManager} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  textStyle: {
    fontSize: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    lineHeight: 25,
  },
  pricingtextStyle: {
    fontSize: 14,
    marginVertical: 5,
    marginLeft: 5,
    textAlign: 'center',
    lineHeight: 25,
  },
  label: {
    fontSize: 20,
    marginTop: '5%',
  },
  bodyContainer: {
    flexDirection: 'row',
  },
  bullet: {
    marginVertical: 10,
    marginLeft: 10,
    fontSize: 8,
    textAlign: 'center',
    paddingTop: 2,
    color: 'black',
  },
})

export default styles
