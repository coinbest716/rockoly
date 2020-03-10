/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  innerView: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  userInfoContent: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '100%',
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
    // color: 'gray',
    fontSize: 14,
    marginLeft: 5,
    width: '80%',
  },
  avgNumber: {
    marginLeft: '1%',
    color: Theme.Colors.primary,
    fontWeight: 'bold',
  },

  badgeText: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  badgeIcon: {
    fontSize: 20,
    color: Theme.Colors.primary,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  desView: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  dishView: {
    marginHorizontal: 10,
    color: '#B9BFBB',
    fontSize: 14,
  },
  galleryImage: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 90,
    width: 90,
    borderRadius: 50,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  galleryView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
  },
  badgeView: {
    display: 'flex',
    flexDirection: 'row',
  },
  cusineBody: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipItem: {
    padding: 0,
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
  },

  dateSelection: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Theme.Colors.primary,
    borderRadius: 15,
    marginTop: 5,
  },

  displayStar: {
    marginTop: 15,
  },
  avgText: {
    marginTop: 15,
    marginHorizontal: 5,
  },
  border: {
    borderBottomColor: '#B9BFBB',
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  ratingBorder: {
    borderBottomColor: '#B9BFBB',
    borderBottomWidth: 1,
  },
  heading: {
    fontWeight: '500',
    fontSize: 16,
    color: 'black',
  },
  destext: {
    paddingVertical: 5,
    fontSize: 14,
  },
  ratingText: {
    color: '#B9BFBB',
    fontSize: 14,
    marginTop: 10,
  },
  ratingFromText: {
    color: '#B9BFBB',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  locationText: {
    // color: Theme.Colors.primary,
    fontSize: 14,
    textAlign: 'center',
    alignItems: 'center',
  },
  cusineText: {
    color: Theme.Colors.primary,
    fontSize: 14,
    textAlign: 'center',
    alignItems: 'center',
  },
  reviewView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  checkAvailablity: {
    backgroundColor: Theme.Colors.primary,
    justifyContent: 'flex-start',
    marginVertical: 20,
  },
  loginText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  iconStyle3: {
    fontSize: 22,
    color: Theme.Colors.primary,
  },
  messageIcon: {
    fontSize: 30,
    color: Theme.Colors.primary,
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
  iconNameView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  documentsImage: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '4%',
    marginTop: 10,
  },
  cardStyle: {
    paddingHorizontal: 1,
    paddingVertical: 5,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  complexityText: {
    // color: Theme.Colors.primary,
    fontSize: 14,
    marginBottom: '1%',
  },
  cardViewStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  complexityView: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  serviceView: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
})
export default styles
