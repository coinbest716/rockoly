/** @format */

import {StyleSheet, Platform} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    flex: 1,
  },
  allergiesLabel: {
    textAlign: 'center',
  },
  saveBtn: {
    width: 'auto',
    alignSelf: 'center',
    marginVertical: 15,
  },
  hideBtn: {
    width: 'auto',
    alignSelf: 'center',
    marginVertical: 15,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTextStyle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 5,
  },
  completeModelContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    borderRadius: 10,
    marginHorizontal: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  modelView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    flexDirection: 'column',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: Theme.Colors.lightgrey,

    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  verifytBtn: {
    width: 'auto',
    alignSelf: 'center',
  },
  textAreaStyle: {
    borderRadius: 15,
  },
  textAreaContent: {
    marginHorizontal: 10,
  },
  cusineTagBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '80%',
  },
  iconStyle: {
    marginTop: Platform.OS === 'ios' ? 1.5 : null,
    fontSize: 21,
    paddingRight: 0,
    alignSelf: 'center',
  },
  cardStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  chipItem: {
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
    height: 'auto',
  },
  locationText1: {
    color: Theme.Colors.primary,
    fontSize: 13,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  textCon: {
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorGrey: {
    color: '#d3d3d3',
    marginHorizontal: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: '1%',
  },
  complexityText: {
    marginLeft: 10,
  },
  destext: {
    color: '#B9BFBB',
    fontSize: 14,
    marginTop: 15,
    paddingLeft: 20,
  },
  heading: {
    color: 'black',
    fontSize: 16,
    marginTop: 20,
    paddingLeft: 10,
  },
  discount: {
    width: '65%',
    color: 'black',
    fontSize: 16,
    marginTop: 20,
    paddingLeft: 10,
  },
  iconText: {
    // display: 'flex',
    flexDirection: 'column',
    // flex: 1,
  },
  dishView: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: 5,
  },
  dishItem: {
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
  },

  locationText: {
    color: Theme.Colors.primary,
    fontSize: 14,
    textAlign: 'center',
    alignItems: 'center',
  },
  biilingRightText: {
    color: 'black',
    fontSize: 14,
    marginTop: 15,
    paddingLeft: 20,
    position: 'absolute',
    right: 5,
  },
  modalText: {
    fontSize: 18,
    alignSelf: 'center',
  },
  modalIcon: {
    alignSelf: 'center',
  },
})

export default styles
