/** @format */

import {StyleSheet, Dimensions} from 'react-native'
import Color from '../../../theme/Colors'
import {Theme} from '@theme'

const {fullwidth, fullHeight} = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  searchBarView: {
    paddingTop: 5,
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
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  textStyle: {
    fontSize: 18,
  },
  modelContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
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
  borderViewStyle: {borderColor: Color.lightgrey, borderWidth: 0.5},

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
  dateView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: 10,
  },
  dateText: {
    fontSize: 14,
    marginTop: 10,
  },

  searchLineStyle: {
    borderWidth: 0.5,
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
  },
  reviewText: {
    marginTop: 4,
  },
  starCounttext: {
    marginTop: 3,
  },

  imageButton: {
    width: 20,
    height: 18,
  },
  acceptButton: {
    backgroundColor: Color.primary,
    marginTop: 5,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 1,
  },
  avgText: {
    marginTop: 2,
    paddingLeft: 5,
  },
  buttonStyle: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 9999,
    color: Theme.Colors.heartFilled,
  },
  modalBoxWrap: {
    position: 'absolute',
    borderRadius: 2,
    width: fullwidth,
    height: fullHeight,
    zIndex: 9999,
  },
  iconZoom: {
    position: 'absolute',
    right: 0,
    top: 10,
    backgroundColor: 'rgba(255,255,255,.9)',
    paddingTop: 4,
    paddingRight: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    zIndex: 9999,
  },
  textClose: {
    color: '#666',
    fontWeight: '600',
    fontSize: 10,
    margin: 4,
    zIndex: 9999,
  },
  noDataView: {flex: 1, justifyContent: 'center', alignSelf: 'center'},
  noDataText: {textAlign: 'center'},
  inputViewStyle: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  inputWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chipItem: {
    marginHorizontal: 8,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
    padding: 0,
    height: 'auto',
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  locationText: {
    color: Theme.Colors.primary,
    fontSize: 14,
    textAlign: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  cusineBody: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 3,
  },
  rating: {
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
  },
})
