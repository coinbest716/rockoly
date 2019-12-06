/** @format */

import {StyleSheet, I18nManager, Platform} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
})

export default {
  styles,
  mainView: {
    flex: 1,
  },
  viewStyle: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  forgotView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  forgotLabel: {
    fontSize: 20,
  },
  labelView: {
    marginVertical: 20,
    marginHorizontal: 5,
  },
  iconColor: {
    color: Theme.Colors.primary,
  },
  label: {
    fontSize: 15,
  },
  inputViewStyle: {
    marginVertical: 10,
  },
  inputView: {
    backgroundColor: '#F1F1F1',
    borderRadius: 15,
    marginVertical: 7,
  },
  resetBtn: {
    width: '50%',
    alignSelf: 'center',
  },
  resetText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: Theme.Colors.primary,
    borderRadius: 5,
    elevation: 1,
  },
  input: {
    color: '#000000',
    borderColor: '#9B9B9B',
    height: 40,
    marginTop: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 8,
    flex: 1,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Theme.Colors.blackDivide,
    borderBottomWidth: 1,
  },
}
