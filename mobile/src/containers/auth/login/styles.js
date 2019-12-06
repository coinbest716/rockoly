/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  logoWrap: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: 'black',
  },
  logo: {
    width: 100,
    height: 100,
  },
  loginForm: {
    marginHorizontal: 20,
  },
  checkboxItem: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingRight: 0,
    paddingLeft: 5,
    borderBottomWidth: 0,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  checkBoxText: {
    fontSize: 12,
    paddingLeft: 5,
    borderBottomWidth: 0,
  },
  checkboxStyle: {
    borderRadius: 10,
  },
  loginBtn: {
    width: '50%',
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: Theme.Colors.primary,
  },
  separator: {
    borderBottomWidth: 1,
    flexGrow: 1,
    borderColor: '#eee',
  },
  separatorText: {
    marginHorizontal: 10,
  },
  separatorWrap: {
    marginHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  googleBtn: {
    backgroundColor: Theme.Colors.google,
  },
  fbBtn: {
    backgroundColor: Theme.Colors.facebook,
  },
  dontHaveView: {
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dontHaveStyle: {
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  clickHereBtn: {},
  clickHere: {
    color: Theme.Colors.primary,
  },
  areYouChef: {
    marginVertical: 20,
    borderBottomWidth: 0,
  },
})
export default styles
