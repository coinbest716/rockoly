/** @format */

import {StyleSheet, Dimensions, Platform} from 'react-native'
import {Theme} from '@theme'

const {width, height} = Dimensions.get('window')
export const SCREEN_WIDTH = Dimensions.get('window').width - 200
export const SCREEN_HEIGHT = Dimensions.get('window').height
export default StyleSheet.create({
  ...Theme.CommonStyle,
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
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    borderColor: '#eee',
    borderBottomWidth: 1,
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
  nameSpacing: {
    marginLeft: 10,
  },
  nameStyling: {
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'capitalize',
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
    minHeight: height / 2,
    marginTop: 10,
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
  scrollViewStyle: {
    color: 'gray',
    paddingTop: 10,
  },
  noDataView: {flex: 1, justifyContent: 'center', alignSelf: 'center'},
  noDataText: {textAlign: 'center'},
  itemHourText: {
    fontSize: 14,
    lineHeight: 22,
  },
  dateStyling: {
    paddingLeft: 5,
    lineHeight: 22,
    fontSize: 14,
  },
})
