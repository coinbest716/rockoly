/** @format */

import {StyleSheet, Dimensions, Platform} from 'react-native'

const {width} = Dimensions.get('window')

export default StyleSheet.create({
  iconZoom: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '22%',
    height: '6%',
    right: 10,
    top: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  textClose: {
    fontWeight: '600',
    color: 'black',
    fontSize: 16,
    margin: 4,
    zIndex: 9999,
  },
})
