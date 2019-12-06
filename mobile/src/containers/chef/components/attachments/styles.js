/** @format */

import {StyleSheet, Dimensions} from 'react-native'
import {Theme} from '@theme'

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Dimensions.get('window').height

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  textAreaStyle: {
    borderRadius: 10,
  },
  textAreaContent: {
    marginVertical: 10,
  },
  container: {
    // width: SCREEN_WIDTH,
    flex: 1,
  },
  heading: {
    // marginLeft: 40,
    fontSize: 18,
    marginTop: 25,
  },
  submitProfileBtn: {
    width: '80%',
    marginVertical: 10,
  },
  border: {
    borderBottomColor: '#B9BFBB',
    borderBottomWidth: 1,
    marginTop: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  changeMOBButton: {
    width: 'auto',
    alignSelf: 'center',
    marginVertical: 15,
  },
  statusView: {
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  statusTextColor: {
    color: Theme.Colors.primary,
  },
  statusTextColorReject: {
    color: Theme.Colors.error,
    marginVertical: 5,
  },
  body: {
    color: 'gray',
    fontSize: 18,
    marginTop: 25,
  },
  body2: {
    color: 'gray',
    fontSize: 30,
    marginLeft: 25,
    marginTop: 30,
    width: SCREEN_WIDTH,
  },
  dateSelection: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Theme.Colors.primary,
    borderRadius: 15,
    marginTop: 5,
  },
  calenderIcon: {
    fontSize: 20,
    color: 'white',
    marginTop: 17,
    marginLeft: 25,
  },
  Caltext: {
    color: 'white',
    marginLeft: 30,
    fontSize: 18,
    marginTop: 15,
  },
  textinputStyle: {
    height: 60,
    marginLeft: 30,
    marginTop: 50,
    paddingLeft: 25,
    marginRight: 30,
    fontSize: 18,
    paddingRight: 0,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  bodyText: {
    fontWeight: 'bold',
    color: '#979797',
    fontSize: 16,
    paddingLeft: 18,
  },
  formContainer: {
    // backgroundColor: '#F1F1F1',
    // marginBottom: Metrics.margins.extraLarge,
    marginVertical: 10,
  },
  formContainer2: {
    // backgroundColor: '#F1F1F1',
    marginVertical: 10,
  },
  checkboxItem: {
    // marginTop: ,
    flexDirection: 'column',
    display: 'flex',
  },
  checkText: {
    color: 'gray',
    fontSize: 14,
    marginLeft: 15,
    marginTop: 10,
  },
  checkboxStyle: {
    height: 25,
    width: 25,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: 3,
  },
  textinputStyle2: {
    height: 60,
    marginLeft: 30,
    marginTop: 15,
    paddingLeft: 25,
    marginRight: 30,
    fontSize: 18,
    paddingRight: 0,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  weekStyle: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
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
    // marginTop: 15,
    // marginLeft: 40,
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
    // marginTop: 15,
    // marginLeft: 12,
  },
  buttonText: {
    fontSize: 21,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    // paddingLeft: 12,
  },
  timeView: {
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeinputStyle: {
    // height: 50,
    // width: 155,
    // marginTop: 15,
    // paddingLeft: 25,
    // fontSize: 16,
    // backgroundColor: '#F1F1F1',
    // borderRadius: 20,
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
  descriptionStyle: {
    marginVertical: 20,
  },
  iconBody: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    fontSize: 90,
    color: Theme.Colors.primary,
    // marginLeft: 30,
    // marginTop: 18,
  },
  imageIconStyle: {
    fontSize: 80,
    color: Theme.Colors.primary,
    // marginLeft: 30,
    // marginTop: 18,
  },
  imageIconStyle2: {
    fontSize: 80,
    color: Theme.Colors.primary,
    marginLeft: 10,
    marginTop: 10,
  },
  iconText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginLeft: 30,
  },
  text: {
    color: Theme.Colors.primary,
    fontSize: 18,
    // marginLeft: 30,
    // marginTop: 30,
  },
  text2: {
    color: 'gray',
    // width: 200,
    fontSize: 14,
    // marginLeft: 30,
    marginTop: 8,
  },
  galleryBody: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    marginTop: 15,
    flexWrap: 'wrap',
  },
  galleryHeading: {
    // marginLeft: 40,
    fontSize: 18,
  },
  galleryText: {
    color: 'gray',
    fontSize: 12,
    // marginLeft: 5,
    // marginTop: 30,
  },
  serviceCostText: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 5,
  },
  imageIcon: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
  locationTxt: {
    backgroundColor: Theme.Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  locationBtn: {
    backgroundColor: Theme.Colors.primary,
    width: 'auto',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    marginVertical: 20,
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
  socialinputStyle: {
    height: 50,
    marginTop: 25,
    paddingLeft: 20,
    fontSize: 16,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  viewStyle: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  linkViewStyle: {},
  modelView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'rgba(163,175,183, 0.5)',
    // backgroundColor: 'rgba(0,0,0, 0.2)',
    backgroundColor: 'rgba(0,0,0, 0.4)',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 18,
  },
  modelContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 25,
    display: 'flex',
    flexDirection: 'column',
  },
  textView: {
    padding: 10,
  },
  closeIcon: {
    width: 25,
    height: 22,
  },
  closeIconView: {
    flexDirection: 'row-reverse',
  },
  profileContainer: {
    // marginTop: 10,
    // marginLeft: 15,
    // marginRight: 20,
    // flexWrap: 'wrap',
    // display: 'flex',
    // // flexDirection: 'row',
    // flex: 1,
    // justifyContent: 'flex-start',
  },
  Thumbnail2: {
    display: 'flex',
    flexDirection: 'row',
    margin: 'auto',
    justifyContent: 'flex-start',
    marginTop: 20,
    flexWrap: 'wrap',
    // marginLeft:30,
  },
  galleryStyle: {
    height: 72,
    width: 72,
    marginLeft: 7,
    borderRadius: 35,
    marginTop: 10,
  },
  noImage: {
    fontSize: 15,
    color: 'white',
    paddingLeft: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  loaderStyle: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 20,
    bottom: 25,
    overflow: 'hidden',
  },
  // galleryIconView: {
  //   // position: 'absolute',
  //   // top: 20,
  //   // left: 20,
  // },
  galleryIcon: {
    width: 25,
    height: 22,
  },
  documentsImage: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '4%',
    // marginLeft: 10,
    // marginRight: 10,
    // paddingLeft: 10,
    marginTop: 10,
  },
  docStyle: {
    height: 72,
    width: 72,
    // marginHorizontal: 10,
    // marginVertical: 5,
    marginLeft: 7,
    marginTop: 10,
    borderRadius: 35,
  },
  // imageCloseIconView: {
  //   position: 'absolute',
  //   right: 8,
  //   top: 2,
  // },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  setAvailablity: {
    backgroundColor: Theme.Colors.primary,
    justifyContent: 'flex-start',
    marginVertical: 20,
  },
  cusineTagBody: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipItem: {
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
  },
  locationText1: {
    color: Theme.Colors.primary,
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
  },
})
export default styles
