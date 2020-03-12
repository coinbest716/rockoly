/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  centerAlign: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  OTPLabel: {
    fontSize: 20,
  },
  verifytBtn: {
    width: 'auto',
    alignSelf: 'center',
  },
  sndBtn: {
    marginVertical: 20,
    width: 'auto',
    alignSelf: 'center',
  },
  arrowRight: {
    color: Theme.Colors.primary,
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
  changeMOBButton: {
    width: 'auto',
    alignSelf: 'center',
    marginVertical: 15,
  },
  dontReceiveOTP: {
    alignSelf: 'center',
  },
  clickHere: {
    color: Theme.Colors.primary,
  },
  dontReceiveOTPText: {
    color: Theme.Colors.normalTextColor,
  },
  otpInput: {},
  callingCode: {
    color: Theme.Colors.inputTextColor,
  },
})
export default styles
