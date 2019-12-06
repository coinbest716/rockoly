/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  contentView: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  btnView: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  stripeBtn: {
    width: '50%',
    backgroundColor: Theme.Colors.primary,
  },
  noDataView: {flex: 1, justifyContent: 'center', alignSelf: 'center'},
  noDataText: {textAlign: 'center'},
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  cardContainerView: {
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  cardImageView: {
    width: '20%',
    justifyContent: 'flex-start',
    marginLeft: 5,
  },
  cardIcon: {
    fontSize: 60,
  },
  cardInfo: {
    width: '70%',
    paddingHorizontal: 10,
  },
  cardInfoTextName: {
    fontWeight: 'normal',
    paddingVertical: 5,
  },
  cardInfoTextNo: {
    paddingVertical: 5,
  },
  actionBtnView: {
    width: '10%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 20,
    color: Theme.Colors.error,
    marginVertical: 10,
  },
  locationBtn: {
    backgroundColor: Theme.Colors.primary,
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    marginVertical: 5,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    fontSize: 16,
    paddingLeft: 0,
    paddingRight: 0,
    color: Theme.Colors.primary,
  },
})
export default styles
