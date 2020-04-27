/** @format */

import {StyleSheet, Platform} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
})

export default {
  styles,
  mainView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headline: {
    textAlign: 'center',
    fontSize: 20,
    fontWight: 'bold',
    marginVertical: 10,
  },
  heading: {
    fontSize: 18,
    fontWight: 'bold',
    marginVertical: 10,
  },
  innerText: {
    color: 'grey',
  },
  receiptImage: {
    marginVertical: 5,
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  updateBtn: {
    flex: 2,
    width: '50%',
    alignSelf: 'center',
    marginTop: 20,
  },
  iconStyle: {
    marginTop: Platform.OS === 'ios' ? 1.5 : null,
    fontSize: 21,
    paddingRight: 0,
    alignSelf: 'center',
  },
  gratuityText: {
    height: 40,
    // width: 80,
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
}
