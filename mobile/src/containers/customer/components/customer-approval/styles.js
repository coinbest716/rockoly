/** @format */

import {StyleSheet, I18nManager} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
  },
  recieptImage: {
    marginTop: '5%',
    alignSelf: 'flex-start',
    width: '70%',
    height: 100,
  },
  textStyle: {fontSize: 16, fontWeight: 'bold', marginVertical: 3},
  viewStyle: {marginRight: '10%'},
  labelStyle: {fontSize: 18, fontWeight: 'bold', marginVertical: 5},
  rightViewStyle: {
    marginVertical: 3
  },
  loginBtnView: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  approveBtn: {
    backgroundColor: Theme.Colors.primary,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
  },
  loginBtnText: {
    fontSize: 16,
  },
  rejectBtn: {
    backgroundColor: Theme.Colors.error,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
  },
  otherTipStyle: {
    borderBottomWidth: 1
  }

})

export default styles