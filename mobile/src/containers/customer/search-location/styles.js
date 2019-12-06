/** @format */

import {Dimensions, StyleSheet} from 'react-native'
import {Theme} from '@theme'

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  viewStyle: {
    height: SCREEN_HEIGHT / 2,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  LocationView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  LocationLabel: {
    fontSize: 20,
  },
  labelView: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 15,
  },
  inputViewStyle: {
    marginVertical: 30,
  },
  inputView: {
    backgroundColor: '#F1F1F1',
    borderRadius: 15,
    marginVertical: 7,
  },
  searchButton: {
    backgroundColor: Theme.Colors.primary,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    padding: 0,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: Theme.Colors.primary,
    width: '40%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    // bottom: 0,
    marginBottom: 30,
  },
  resetText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    justifyContent: 'center',
  },
  input: {
    color: '#000000',
    borderColor: '#9B9B9B',
    height: 40,
    marginTop: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 8,
    flex: 1,
    textAlign: 'left',
  },
  inputWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderColor: Theme.Colors.blackDivide,
    // borderBottomWidth: 1,
    // overflow: 'scroll',
    // // flexGrow: 0.95,
    // backgroundColor: 'red',
    // height: '90%',
  },
  userImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 2.5,
  },
  searchItemStyle: {
    fontSize: 15,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    color: 'black',
    marginLeft: 15,
  },
  searchAddressStyle: {
    height: 250,
  },
  locationBtn: {
    marginVertical: 20,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalContainer: {
    height: '100%',
  },
  scrollViewStyle: {
    flexGrow: 0.95,
  },
})

export default styles
