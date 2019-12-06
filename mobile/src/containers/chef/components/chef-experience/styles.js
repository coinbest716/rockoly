/** @format */

import {StyleSheet, I18nManager} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
  },
  cusineTagBody: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipItem: {
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
    height: 'auto',
  },
  locationText1: {
    color: Theme.Colors.primary,
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginVertical: 10,
  },
  textAreaStyle: {
    marginTop: '5%',
    borderRadius: 10,
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    fontSize: 20,
  },
  saveBtn: {
    width: '40%',
    alignSelf: 'center',
    marginVertical: 15,
  },
})

export default styles
