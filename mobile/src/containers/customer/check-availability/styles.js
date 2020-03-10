/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  modal: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  bookingTitle: {
    fontSize: 18,
  },
  priceTitle: {
    fontSize: 18,
    marginTop: 10,
  },
  amountText: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  availableTime: {
    marginTop: 10,
    flexDirection: 'column',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  timeTextSelect: {
    color: Theme.Colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  continueBookTextSelect: {
    fontSize: 16,
    textAlign: 'center',
  },
  timeView: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
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
  timeinputStyleBtn: {
    height: 40,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  bookNowStyleBtn: {
    backgroundColor: Theme.Colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '60%',
  },
  text: {
    textAlign: 'center',
  },
  labelTitle: {
    marginTop: 10,
    marginHorizontal: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  noteText: {
    marginTop: 10,
    marginHorizontal: 20,
    textAlign: 'center',
    color: 'gray',
  },
  bookNowView: {
    marginVertical: 20,
  },
  textAreaStyle: {
    borderRadius: 15,
  },
  textAreaContent: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
})

export default styles
