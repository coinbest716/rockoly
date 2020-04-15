/** @format */

import {StyleSheet, Platform} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
})

export default {
  styles,
  mainView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  cardStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 20,
    marginTop: 5,
  },
  textStyle: {
    fontSize: 14,
    marginLeft: 5,
    marginTop: '1%',
    lineHeight: 22,
    textAlign: 'center',
  },
  userImage: {
    width: '100%',
    height: 80,
    overflow: 'hidden',
    paddingLeft: 10,
    // borderRadius: 5,
  },
  dateStyling: {
    paddingLeft: 5,
    // marginTop: 5,
    lineHeight: 22,
    fontSize: 14,
  },
  itemHourText: {
    fontSize: 14,
    lineHeight: 22,
  },
  item: {
    flex: 1,
    display: 'flex',
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  parentItem: {
    flex: 1,
    display: 'flex',
    backgroundColor: 'white',
    // borderBottomWidth: 1,
    // borderBottomColor: '#e8ecf0',
    flexDirection: 'column',
  },
  nameSpacing: {
    flex: 2.3,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 5,
    flexDirection: 'column',
    // backgroundColor: 'red',
  },
  itemHourText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoView: {
    display: 'flex',
    flex: 2,
    flexDirection: 'row',
  },
  itemTitleText: {
    // color: 'black',
    // marginLeft: 10,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  statsStyle: {
    color: '#08AB93',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft : 10
  },  
  primaryBtn: {
    backgroundColor: Theme.Colors.primary,
    marginTop: 5,
    marginBottom: 10,
    minHeight: 20,
    padding: 3,
    borderRadius: 50,
    width: '50%',
    fontSize : 20,
    alignItems: 'center',
  }
}
