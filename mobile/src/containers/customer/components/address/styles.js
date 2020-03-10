/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  viewStyle: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  locationView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationLabel: {
    fontSize: 20,
  },
  inputViewStyle: {
    marginVertical: 5,
  },
  locationBtn: {
    width: 'auto',
    alignSelf: 'center',
    marginVertical: 15,
  },
  locationText: {
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
  },
  input: {},
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Theme.Colors.borderColor,
    borderBottomWidth: 1,
  },
  arrowLeft: {
    color: Theme.Colors.primary,
    alignSelf: 'center',
    marginLeft: 15,
  },
  arrowRight: {
    color: Theme.Colors.primary,
    alignSelf: 'center',
    marginRight: 15,
  },
  distanceLabel: {},
  distanceView: {
    marginTop: 20,
  },
  searchBar: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: Theme.Colors.primary,
  },
  label: {fontSize: 16, color: 'black', marginVertical: 5},
  desStyle: {color: 'gray', fontSize: 14},
  noteText: {fontSize: 14, marginVertical: 10, color: 'gray'},
})
export default styles
