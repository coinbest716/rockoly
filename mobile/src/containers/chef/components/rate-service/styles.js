/** @format */

import {StyleSheet, Platform} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  baseText: {
    // alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
  baseRateText: {
    height: 40,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    padding: 0,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
  },
  iconStyle: {
    marginTop: Platform.OS === 'ios' ? 1.5 : null,
    fontSize: 21,
    paddingRight: 0,
    alignSelf: 'center',
  },
  cardStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  to: {
    marginHorizontal: '5%',
    alignSelf: 'center',
  },
  label: {
    fontSize: 20,
    marginTop: 5,
  },
  rateLable: {
    marginTop: '2%',
    marginBottom: 5,
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
  disText: {
    height: 40,
    // width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  textStyle: {
    fontSize: 14,
    marginLeft: 5,
    marginTop: '1%',
    lineHeight: 22,
  },
  bottomtextStyle: {
    fontSize: 14,
    marginLeft: 5,
    marginTop: '2%',
    lineHeight: 22,
  },
  saveBtn: {
    width: '40%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  textCon: {
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around', // space-between
  },
  colorGrey: {
    color: '#d3d3d3',
    marginHorizontal: 10,
  },
  border: {
    borderBottomColor: '#B9BFBB',
    borderBottomWidth: 1,
    marginTop: 5,
  },
  colorYellow: {
    color: Theme.Colors.primary,
  },
  numericInputStyle: {justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginVertical: 5}
})

export default styles
