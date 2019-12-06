/** @format */

import {Dimensions} from 'react-native'
import {Theme} from '@theme'

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height

export default {
  mainView: {
    flex: 1,
  },

  container: {
    display: 'flex',
    marginHorizontal: 15,
    marginVertical: 15,
    paddingBottom: 100,
  },
  bannerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 2.5,
  },
  question: {
    fontSize: 20,
    width: '95%',
    fontWeight: 'bold',
    // color: Theme.Colors.primary,
    marginVertical: 10,
  },
  radioQuestion: {
    fontSize: 16,
    width: '95%',
    fontWeight: 'bold',
    marginTop: 5,
    // color: Theme.Colors.primary,
  },
  bodyText: {
    fontSize: 16,
    marginVertical: 10,
    marginLeft: 10,
  },
  listItem: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  radioText: {
    fontSize: 14,
  },
  bullet: {
    marginVertical: 10,
    marginLeft: 10,
    textAlign: 'center',
    paddingTop: 2,
    color: Theme.Colors.primary,
  },
  bodyContainer: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}
