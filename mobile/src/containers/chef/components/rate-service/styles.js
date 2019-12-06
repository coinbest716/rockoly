/** @format */

import {StyleSheet, I18nManager} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  baseRateText: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderColor,
    fontSize: 16,
  },
  label: {
    fontSize: 20,
    marginVertical: 10,
  },
  gratuityView: {
    flexDirection: 'column',
    marginTop: 10,
  },
  gratuityText: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderColor,
    fontSize: 16,
  },
  textStyle: {
    fontSize: 16,
    lineHeight: 22,
  },
  saveBtn: {
    width: '40%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  textCon: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorGrey: {
    color: '#d3d3d3',
  },
  colorYellow: {
    color: Theme.Colors.primary,
  },
})

export default styles
