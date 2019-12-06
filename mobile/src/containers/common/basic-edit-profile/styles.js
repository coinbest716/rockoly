/** @format */

import {StyleSheet, Dimensions} from 'react-native'
import {Theme} from '@theme'

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
  },
  editPanel: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  dateOfBirth: {
    paddingLeft: 8,
    color: '#000',
    fontSize: 17,
  },
  profileImage: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    // overflow: 'hidden',
    borderRadius: 50,
  },
  arrowLeft: {
    color: Theme.Colors.primary,
    alignSelf: 'center',
    marginLeft: 15,
  },
  topContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
    // flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    color: Theme.Colors.primary,
    fontSize: 18,
    marginTop: 12,
  },
  destext: {
    color: 'black',
    fontSize: 16,
    marginTop: 15,
  },
  editIconStyle: {
    color: Theme.Colors.primary,
    paddingLeft: 60,
  },
  updateBtn: {
    width: '50%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  arrowRight: {
    color: Theme.Colors.primary,
    alignSelf: 'center',
    marginRight: 15,
  },
  arrowLeft: {
    color: Theme.Colors.primary,
    alignSelf: 'center',
    marginLeft: 15,
  },

  editImageIcon: {
    color: Theme.Colors.primary,
    paddingLeft: '30%',
    position: 'absolute',
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  avatar: {
    backgroundColor: 'black',
    width: 60,
    height: 60,
  },
  badge: {
    marginTop: -40,
    marginRight: -145,
  },
})
export default styles
