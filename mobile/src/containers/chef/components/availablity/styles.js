/** @format */

import {Dimensions, StyleSheet} from 'react-native'
import {Theme} from '@theme'

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height

export default StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
  },
  viewContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  heading: {
    fontSize: 18,
    marginTop: 15,
  },
  setHeading: {
    fontSize: 18,
    marginTop: 25,
    marginBottom: 15,
  },
  outterView: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeinputStyle: {
    height: 40,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  locationBtn: {
    backgroundColor: Theme.Colors.primary,
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    marginVertical: 10,
  },
  arrowRight: {
    color: Theme.Colors.primary,
    alignSelf: 'center',
    marginRight: 15,
  },
  arrowLeft: {
    color: Theme.Colors.primary,
    alignSelf: 'center',
    marginLeft: 15,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
  },
  unavailablityText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },

  unavailableBtn: {
    backgroundColor: Theme.Colors.primary,
    width: '50%',
    marginTop: 15,
    borderRadius: 30,
    marginVertical: 5,
  },
  timeinputStyle2: {
    height: 50,
    width: 155,
    marginTop: 15,
    paddingLeft: 25,
    fontSize: 16,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  weekStyle: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  weekStyle2: {
    marginLeft: 5,
  },
  checkboxStyle: {
    textAlign: 'center',
  },
  buttonStyle: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  buttonStyle2: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    paddingLeft: 8,
  },
  timeText: {
    color: 'gray',
    fontSize: 18,
    textAlign: 'center',
  },
  friText: {
    fontSize: 14,
    textAlign: 'center',
    paddingLeft: 12,
  },
  infoText: {
    alignSelf: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 16,
  },
  labelText: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'center',
    // borderBottomColor: 'grey',
    // borderBottomWidth: 0.5,
    marginHorizontal: 20,
    marginVertical: 10,
    // paddingVertical: 10,
  },
  deleteIcon: {
    fontSize: 20,
    color: Theme.Colors.error,
  },
  dateText: {
    fontSize: 16,
  },
  cardStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
  },
})
