/** @format */

import {StyleSheet, I18nManager} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
  },
  textAreaStyle: {
    borderRadius: 10,
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  cardStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  border: {
    borderBottomColor: '#B9BFBB',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  label: {
    fontSize: 20,
    marginVertical: 10,
  },
  saveBtn: {
    width: '40%',
    alignSelf: 'center',
    marginVertical: 15,
  },
})

export default styles
