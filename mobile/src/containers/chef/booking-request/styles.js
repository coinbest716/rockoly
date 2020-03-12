/** @format */

import {StyleSheet, Dimensions, Platform} from 'react-native'
import {Theme} from '@theme'

export const SCREEN_WIDTH = Dimensions.get('window').width - 100

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  buttonInfo: {
    color: Theme.Colors.primary,
  },
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  section: {
    backgroundColor: '#f0f4f7',
    color: '#79838a',
  },
  parentItem: {
    flex: 1,
    display: 'flex',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf0',
    flexDirection: 'column',
  },
  item: {
    flex: 1,
    display: 'flex',
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  itemHourText: {
    fontSize: 14,
    lineHeight: 22,
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: 'black',
    // marginLeft: 10,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemButtonContainer: {
    paddingBottom: 5,
    paddingHorizontal: 20,
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf0',
  },
  emptyItemText: {
    color: '#79838a',
    fontSize: 14,
  },
  noDataView: {flex: 1, justifyContent: 'center', alignSelf: 'center'},
  noDataText: {textAlign: 'center'},
  successBtn: {
    width: 55,
    height: 35,
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
    marginVertical: 5,
  },
  cancelBtn: {
    width: 55,
    height: 35,
    backgroundColor: Theme.Colors.error,
    borderColor: Theme.Colors.error,
    marginVertical: 5,
  },
  textStyle: {
    color: Theme.Colors.primary,
  },
  userImage: {
    width: '100%',
    height: 80,
    overflow: 'hidden',
    paddingLeft: 10,
    borderRadius: 5,
  },
  messageDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginRight: 5,
  },
  nameSpacing: {
    flex: 2.3,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 5,
    flexDirection: 'column',
    // backgroundColor: 'red',
  },
  nameViewWrap: {
    // width: SCREEN_WIDTH,
  },
  nameView: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    flexWrap: 'wrap',
  },
  infoView: {
    display: 'flex',
    flex: 2,
    flexDirection: 'row',
  },
  modelView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'absolute',
    // paddingTop: '28%', // 83
    // paddingRight: 15,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: Theme.Colors.lightgrey,
    // backgroundColor: 'rgba(163,175,183, 0.5)',
    // backgroundColor: 'rgba(0,0,0, 0.2)',
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  completeModelContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  contentTextStyle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 5,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: Theme.Colors.primary,
    marginTop: 5,
    // borderRadius: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
    // elevation: 1,
    minHeight: 20,
    padding: 3,
    borderRadius: 0,
    flexDirection: 'row',
  },
  dateStyling: {
    paddingLeft: 5,
    // marginTop: 5,
    lineHeight: 22,
    fontSize: 14,
  },
})
export default styles
