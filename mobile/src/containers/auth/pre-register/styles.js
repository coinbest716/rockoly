/** @format */

import {StyleSheet, I18nManager} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
    height: '100%',
  },
  viewTop: {
    height: '50%',
    backgroundColor: Theme.Colors.accent,
  },
  viewBottom: {
    height: '50%',
    backgroundColor: Theme.Colors.primary,
  },
  backView: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  goBack: {
    color: Theme.Colors.white,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  arrowLeft: {
    color: Theme.Colors.white,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  arrowRight: {
    color: Theme.Colors.white,
    alignSelf: 'center',
    marginVertical: 5,
    marginHorizontal: 5,
    fontSize: 50,
  },
  imageStyle: {
    alignSelf: 'center',
    width: '50%',
    height: '50%',
  },
  imageBottom: {
    marginTop: '10%',
    alignSelf: 'center',
    width: '50%',
    height: '50%',
  },
  topText: {
    color: Theme.Colors.white,
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
})

export default styles
