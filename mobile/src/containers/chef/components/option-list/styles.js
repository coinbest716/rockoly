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
    paddingBottom: '5%',
  },
  gratuityText: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderColor,
  },
  destext: {
    color: 'black',
    fontSize: 16,
    marginTop: 15,
  },
  guestView: {
    // marginVertical: 10,
  },
  label: {
    fontSize: 20,
    marginVertical: 10,
  },
  textStyle: {
    fontSize: 16,
    lineHeight: 22,
  },
  saveBtn: {
    width: '40%',
    alignSelf: 'center',
  },
})

export default styles
