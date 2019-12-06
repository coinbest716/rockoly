/** @format */

import {Platform, StyleSheet, Dimensions} from 'react-native'
import {Constants, Color} from '@common'

const {width} = Dimensions.get('window')

export const SCREEN_WIDTH = Dimensions.get('window').width - 100

export default StyleSheet.create({
  acceptButton: {
    backgroundColor: Color.primary,
    // height: -40,
    // width: '60%',
    marginTop: 5,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 1,
  },
})
