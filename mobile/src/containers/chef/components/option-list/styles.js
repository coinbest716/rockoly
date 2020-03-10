/** @format */

import {StyleSheet, I18nManager, Platform} from 'react-native'
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
    height: 40,
    // width: 80,
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
  iconStyle: {
    marginTop: Platform.OS === 'ios' ? 1.5 : null,
    fontSize: 21,
    paddingRight: 0,
    alignSelf: 'center',
  },
  destext: {
    color: 'black',
    fontSize: 16,
    marginTop: 15,
  },
  guestView: {},
  label: {
    fontSize: 20,
    marginVertical: 10,
  },
  textStyle: {
    fontSize: 16,
    lineHeight: 22,
  },
  cardStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  saveBtn: {
    width: '40%',
    alignSelf: 'center',
  },
  border: {
    borderBottomColor: '#B9BFBB',
    borderBottomWidth: 1,
    marginTop: 5,
  },
})

export default styles
