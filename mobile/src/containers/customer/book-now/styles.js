/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  mainView: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  userInfoContent: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  chefImage: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    // marginLeft: 25,
    width: '70%',
    flex: 1,
  },
  locationIcon: {
    fontSize: 15,
    color: Theme.Colors.primary,
    marginLeft: 5,
  },
  addressView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    marginTop: 5,
  },
  addressText: {
    color: 'gray',
    fontSize: 14,
    marginLeft: 5,
    width: '80%',
  },
  avgNumber: {
    color: Theme.Colors.primary,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  avgText: {
    marginHorizontal: 5,
  },
  iconNameView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    width: '70%',
    textTransform: 'capitalize',
    flexWrap: 'wrap',
    marginLeft: 5,
  },
  reviewView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 8,
  },
  selectCardView: {},
  selectCardText: {
    fontSize: 18,

    marginVertical: 10,
    alignSelf: 'center',
  },
  cardPicker: {
    width: '100%',
    marginHorizontal: 10,
  },
  bookNowBtn: {
    width: '50%',
    alignSelf: 'center',
    marginTop: 20,
  },
  bookNowView: {
    marginVertical: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCardView: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  addCardBtn: {
    backgroundColor: Theme.Colors.primary,
    width: '40%',
    justifyContent: 'center',
    marginVertical: 8,
    borderRadius: 30,
    marginHorizontal: 20,
  },
  addCardBtnText: {
    justifyContent: 'center',
    color: Theme.Colors.white,
  },
  textAreaContent: {
    marginVertical: 10,
  },
  textAreaStyle: {
    borderRadius: 10,
  },
  formContainer2: {
    // backgroundColor: '#F1F1F1',
    marginVertical: 10,
  },
  cusineTagBody: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
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
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
})

export default styles
