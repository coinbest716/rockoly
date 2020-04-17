/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  // remove later : TODO
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
  checkboxView: {
    top: 10,
    bottom: 5,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  checkboxStyle: {
    marginRight: 15,
  },
  textStyle: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  textLinkStyle: {
    color: Theme.Colors.primary,
    textDecorationLine: 'underline',
  },
  webView: {},
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
  regView: {
    marginHorizontal: 20,
  },
  dateOfBirth: {
    paddingLeft: 8,
    color: '#000',
    fontSize: 17,
  },
  dobIconColor: {
    color: Theme.Colors.primary,
  },
  emailView: {
    flexDirection: 'column',
  },
  errorMessage: {
    color: Theme.Colors.error,
  },
  callingCode: {
    color: Theme.Colors.inputTextColor,
  },
  passwordInfo: {
    marginVertical: 10,
    color: 'gray',
  },
  passwordErrorInfo: {
    marginVertical: 10,
    color: Theme.Colors.error,
  },
  passwordError: {
    marginVertical: 10,
    color: Theme.Colors.error,
  },
  areYouChef: {
    marginVertical: 20,
    borderBottomWidth: 0,
  },
  registerBtn: {
    width: '50%',
    alignSelf: 'center',
    marginTop: 20,
  },
  registerBtnFB: {
    width: '50%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  // TODO: remove later
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
})
export default styles
