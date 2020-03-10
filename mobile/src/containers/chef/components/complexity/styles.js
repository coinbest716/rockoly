/** @format */

import {StyleSheet, I18nManager} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
  },
  complexityView: {
    marginHorizontal: 10,
    marginVertical: 10,
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
    marginVertical: 15,
  },
  textCon: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  colorGrey: {
    color: '#d3d3d3',
  },
  colorYellow: {
    color: Theme.Colors.primary,
  },
  border: {
    borderBottomColor: '#B9BFBB',
    borderBottomWidth: 1,
    marginTop: 10,
  },

  gratuityText: {
    height: 40,
    // width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  baseRateText: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderColor,
    fontSize: 16,
  },
  to: {
    marginHorizontal: '5%',
    alignSelf: 'center',
  },
  rateLable: {
    marginTop: '2%',
  },
  gratuityView: {
    flexDirection: 'column',
    marginTop: 10,
  },

  disText: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderColor,
    fontSize: 16,
  },

  bottomtextStyle: {
    fontSize: 14,
    marginLeft: 5,
    marginTop: '2%',
    lineHeight: 22,
  },
})

export default styles
