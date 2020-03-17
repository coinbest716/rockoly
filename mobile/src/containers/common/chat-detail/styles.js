/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 8,
    borderColor: Theme.Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  btnText: {
    margin: 5,
    color: 'black',
  },
  btnTimeText: {
    fontSize: 12,
    color: 'grey',
  },
})

export default styles
