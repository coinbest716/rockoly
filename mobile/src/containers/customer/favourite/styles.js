/** @format */

import {StyleSheet} from 'react-native'
import Color from '../../../theme/Colors'
import {Theme} from '@theme'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarView: {
    paddingTop: 20,
  },
  modelView: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'column',
    position: 'absolute',
    paddingTop: '20%', // 83
    paddingRight: 15,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: Color.lightgrey,
    // backgroundColor: 'rgba(163,175,183, 0.5)',
    // backgroundColor: 'rgba(0,0,0, 0.2)',
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  textStyle: {
    fontSize: 18,
  },
  modelContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    // marginHorizontal: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  textView: {
    padding: 10,
  },
  closeIconView: {
    flexDirection: 'row-reverse',
  },
  closeIcon: {
    width: 40,
    height: 40,
  },
  borderViewStyle: {borderColor: Color.headerTintColor, borderWidth: 0.5},

  CardContainer: {
    marginBottom: 10,
  },
  infoView: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  nameView: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  cardList: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderColor: '#eee',
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  imageContainer: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  chefImage: {
    height: 120,
    width: '100%',
    borderRadius: 2,
  },
  contentContainer: {
    flex: 2,
    marginRight: 10,
    marginVertical: 5,
  },
  nameStyling: {
    fontSize: 20,
    marginLeft: 5,
    marginRight: 40,
    textTransform: 'capitalize',
    marginVertical: 5,
    color: '#000',
    fontWeight: '500',
  },
  locationView: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 20,
  },
  locationIcon: {
    fontSize: 16,
    marginHorizontal: 5,
    marginVertical: 2,
    color: Theme.Colors.primary,
  },
  locationStyling: {
    fontSize: 14,
    marginTop: 1,
    marginBottom: 2,
    marginRight: 10,
    color: '#707070',
  },
  messageDescription: {
    fontSize: 14,
    alignItems: 'flex-start',
    marginHorizontal: 5,
    marginVertical: 2,
    color: '#707070',
  },

  price: {
    fontSize: 14,
    marginLeft: 5,
    marginRight: 6,
    marginBottom: 5,
  },

  dateView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: 10,
  },
  dateText: {
    fontSize: 14,
    // color: Colors.default,
    marginTop: 10,
  },

  searchLineStyle: {
    borderWidth: 0.5,
    // borderColor: Colors.lineColor,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  scrollViewStyle: {
    marginTop: 10,
    marginHorizontal: 5,
  },
  starView: {
    marginLeft: 5,
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'flex-end',
  },
  starCounttext: {
    // color: Color.primary,
    // marginTop: 1,
    // marginLeft: 5,
    marginTop: 3,
  },

  imageButton: {
    width: 20,
    height: 18,
  },
  buttonStyle: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 9999,
    color: Theme.Colors.heartFilled,
  },
  acceptButton: {
    backgroundColor: Color.primary,
    // height: -40,
    // width: '60%',
    marginTop: 5,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 1,
  },
  border: {
    borderBottomColor: '#B9BFBB',
    borderBottomWidth: 5,
    marginTop: 100,
    marginLeft: 10,
    marginRight: 10,
  },
  loginBtnText: {
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: Color.primary,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
  },
  buttonView: {
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 20,
  },
  noDataView: {flex: 1, display: 'flex', justifyContent: 'center', alignSelf: 'center'},
  noDataText: {textAlign: 'center'},
  avgText: {
    marginTop: 2,
    paddingLeft: 5,
  },
})
