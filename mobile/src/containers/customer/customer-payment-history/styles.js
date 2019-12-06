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
    flexDirection: 'row',
    flex: 1,
    marginTop: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  iconNameView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  nameViewWrap: {
    width: SCREEN_WIDTH,
    flexDirection: 'column',
  },
  nameView: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginLeft: 5,
  },
  userImage: {
    width: 60,
    height: 60,
    overflow: 'hidden',
    borderRadius: Platform.OS === 'ios' ? 30 : 50,
    paddingLeft: 10,
  },
  nameSpacing: {
    marginLeft: 10,
  },
  nameStyling: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    width: '70%',
    textTransform: 'capitalize',
    flexWrap: 'wrap',
    marginLeft: 5,
  },
  addressView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  messageDescription: {
    fontSize: 14,
    lineHeight: 22,
  },

  dateView: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 10,
  },
  dateText: {
    fontSize: 14,
    marginTop: 5,
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
  locationView: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
  },
})
