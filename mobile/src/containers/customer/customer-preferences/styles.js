/** @format */

import {StyleSheet, Dimensions} from 'react-native'
import {Theme} from '@theme'

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  container: {
    flex: 1,
  },
  allergiesLabel: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  // allergieItemStyle: {
  //   fontSize: 16,
  //   marginLeft: 5,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#B9BFBB',
  //   marginHorizontal: 15,
  //   marginBottom: 15,
  // },
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
