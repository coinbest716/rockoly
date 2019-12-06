/** @format */

import {StyleSheet, I18nManager} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
  },
  allergiesLabel: {
    textAlign: 'center',
    marginBottom: '5%',
  },
  saveBtn: {
    width: '40%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  textAreaStyle: {
    borderRadius: 15,
  },
  textAreaContent: {
    marginHorizontal: 10,
  },
  cusineTagBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '80%',
  },
  chipItem: {
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
    padding: 0,
    height: 'auto',
  },
  locationText1: {
    color: Theme.Colors.primary,
    fontSize: 13,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
})

export default styles
