/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  header: {
    backgroundColor: 'white',
  },
  headerTitle: {
    color: Theme.Colors.primary,
  },
  iconNameView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  iconStyle3: {
    fontSize: 22,
    color: Theme.Colors.primary,
  },
  topContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  userContent: {
    // marginHorizontal: 20,
    // marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 50,
  },

  loginRegTxt: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: '500',
    alignSelf: 'center',
    color: Theme.Colors.primary,
  },
  loginBtnView: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  loginBtn: {
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
  card: {
    borderWidth: 0,
  },
  cardItem: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  listItem: {
    borderBottomWidth: 0.3,
  },
  // userInfo: {
  //   marginHorizontal: 10,
  //   marginVertical: 10,
  // },
  nameStyle: {
    fontSize: 18,
    color: Theme.Colors.primary,
  },
  emailStyle: {
    marginBottom: 5,
  },
  submitProfileBtn: {
    width: 'auto',
    marginVertical: 5,
  },
  statusView: {
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  statusTextColor: {
    color: Theme.Colors.primary,
  },
  statusTextColorReject: {
    color: Theme.Colors.error,
    marginVertical: 5,
  },
  notificationSwitch: {
    marginVertical: 20,
    borderBottomWidth: 0,
  },
  // text: {
  //   marginHorizontal: 20,
  // },
  logo: {
    width: 100,
    height: 100,
  },
  accountNameLabel: {
    textAlign: 'center',
    marginTop: 10,
    color: Theme.Colors.primary,
  },
})
export default styles
