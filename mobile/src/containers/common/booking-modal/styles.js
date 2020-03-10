/** @format */

import {StyleSheet, Dimensions, Platform} from 'react-native'
import {Theme} from '@theme'

const {width, height} = Dimensions.get('window')
export const SCREEN_WIDTH = Dimensions.get('window').width - 100
export const SCREEN_HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
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
  rejectBtn: {
    backgroundColor: Theme.Colors.error,
    marginTop: 5,
    // borderRadius: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
    // elevation: 1,
    borderRadius: 0,
    minHeight: 20,
    padding: 3,
    flexDirection: 'row',
  },
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
  modelView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'absolute',
    paddingTop: '28%', // 83
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
  textStylemodal: {
    fontSize: 18,
  },
  modelContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  descriptionStyle: {
    height: 160,
    marginTop: 15,
    fontSize: 16,
    color: 'gray',
    paddingLeft: 10,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  contentStyle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  errorStyle: {
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.Colors.error,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
    // flex: 1,
  },
  heading: {
    color: 'black',
    fontSize: 16,
    marginTop: 25,
    textAlign: 'center',
  },
  destext: {
    color: '#B9BFBB',
    fontSize: 14,
    marginTop: 15,
  },
  dishItem: {
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
  },
  dishText: {
    color: Theme.Colors.primary,
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  dishView: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  availableTime: {
    // marginTop: 10,
    flexDirection: 'column',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  labelTitle: {
    marginTop: 10,
    marginHorizontal: 20,
    textAlign: 'center',
    // textDecorationLine: 'underline',
  },
  timeinputStyle: {
    height: 40,
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    marginTop: 10,
  },
  timeTextSelect: {
    color: Theme.Colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
})

export default styles
