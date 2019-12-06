/** @format */

import {StyleSheet, Dimensions, Platform} from 'react-native'

const {width} = Dimensions.get('window')

export default StyleSheet.create({
  iconZoom: {
    position: 'absolute',
    right: 0,
    top: 10,
    backgroundColor: 'rgba(255,255,255,.9)',
    paddingTop: 4,
    paddingRight: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    zIndex: 9999,
  },
  textClose: {
    color: '#666',
    fontWeight: '600',
    fontSize: 10,
    margin: 4,
    zIndex: 9999,
  },
})

