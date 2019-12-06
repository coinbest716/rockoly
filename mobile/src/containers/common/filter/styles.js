/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  clearFilter: {justifyContent: 'flex-end', alignSelf: 'flex-end', paddingRight: 10},
  clearText: {fontSize: 14},
  leftSideView: {backgroundColor: Theme.Colors.white, borderColor: '#eee', borderWidth: 1},
  bodyView: {
    flex: 1,
  },
  labelView: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  rightSideView: {
    backgroundColor: Theme.Colors.white,
    marginHorizontal: 10,
  },
  textStyle: {
    color: '#000000',
    borderColor: '#9B9B9B',
    borderBottomWidth: 1,
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
    height: 'auto',
  },
  locationText1: {
    color: Theme.Colors.primary,
    fontSize: 13,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  cancelBtnView: {
    backgroundColor: Theme.Colors.error,
    width: '45%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 10,
    // bottom: 0,
    // position: 'absolute',
  },
  applyBtnView: {
    backgroundColor: Theme.Colors.primary,
    width: '45%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 10,
    // bottom: 0,
    // position: 'absolute',
  },
  errMsgTextStyle: {
    textAlign: 'center',
    fontSize: 16,
    color: Theme.Colors.error,
    lineHeight: 22,
    marginBottom: 20,
  },
  errView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
})

export default styles
