/** @format */

import {StyleSheet, Dimensions, Platform} from 'react-native'
import {Theme} from '@theme'

const {width, height} = Dimensions.get('window')
export const SCREEN_WIDTH = Dimensions.get('window').width - 100
export const SCREEN_HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  normalContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  unSeencontainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#d9fff9',
  },
  body: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  flatlist: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  more: {
    width,
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },

  headerLabel: {
    color: '#333',
    fontSize: 28,
    marginBottom: 0,
    paddingTop: 30,
    marginLeft: 22,
  },
  CardContainer: {
    marginBottom: 10,
  },
  infoView: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameViewWrap: {
    width: SCREEN_WIDTH,
  },
  nameView: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  userImage: {
    width: 55,
    height: 55,
    overflow: 'hidden',
    borderRadius: Platform.OS === 'ios' ? 27 : 50,
    paddingLeft: 10,
  },
  imageStyle: {
    width: '20%',
    marginRight: 5,
  },
  nameSpacing: {
    marginLeft: 10,
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 185,
  },
  nameStyling: {
    fontWeight: 'bold',
    fontSize: 18,
    // color: Colors.primary,
  },
  messageDescription: {
    fontSize: 14,
    lineHeight: 22,
  },

  dateView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: 10,
  },
  dateText: {
    fontSize: 14,
    // color: Colors.default,
    marginTop: 10,
  },

  searchLineStyle: {
    borderWidth: 0.5,
    // borderColor: Colors.lineColor,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  tabView: {
    // minHeight: height / 2,
    marginTop: 10,
    flex: 1,
  },
  tabItem: {
    flex: 0.32,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  tabButton: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  description: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: 'flex-start',
  },
  primaryBtn: {
    backgroundColor: Theme.Colors.primary,
    marginTop: 5,
    minHeight: 20,
    padding: 3,
    flexDirection: 'row',
  },
  border: {
    borderBottomColor: '#B9BFBB',
    borderBottomWidth: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  destext: {
    // color: '#B9BFBB',
    fontSize: 16,
    // marginTop: 15,
    textAlign: 'center',
  },
  rejectBtn: {
    backgroundColor: '#FC7079',
    marginTop: 5,
    // borderRadius: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
    // elevation: 1,

    minHeight: 20,
    padding: 3,
    flexDirection: 'row',
  },
  rejectedView: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: 'red',
  },

  noDataView: {flex: 1, justifyContent: 'center', alignSelf: 'center'},
  noDataText: {textAlign: 'center'},
  textView: {
    width: '70%',
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: 16,
    // marginLeft: 10,
  },
  notificationTypeView: {
    width: '100%',
  },
  notificationTextView: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationTitleText: {
    fontSize: 16,
    marginLeft: 10,
    alignSelf: 'center',
  },
  notificationActionText: {
    color: Theme.Colors.primary,
    padding: 5,
    fontSize: 16,
  },
  notificationActionButton: {
    marginRight: 10,
  },
  clearIcon: {
    color: Theme.Colors.primary,
    alignSelf: 'center',
    marginRight: 10,
  },
})
export default styles
