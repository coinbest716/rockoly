/** @format */
/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  // remove later : TODO
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
