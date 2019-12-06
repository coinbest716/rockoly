/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  addBtnView: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    display: 'flex',
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
  editIcon: {
    fontSize: 20,
    marginVertical: 10,
    color: Theme.Colors.primary,
  },
  deleteIcon: {
    fontSize: 20,
    color: Theme.Colors.error,
    marginVertical: 10,
  },
  noDataView: {flex: 1, justifyContent: 'center', alignSelf: 'center'},
  noDataText: {textAlign: 'center'},
})
export default styles
