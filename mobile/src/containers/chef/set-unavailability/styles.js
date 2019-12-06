/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

export default StyleSheet.create({
  ...Theme.CommonStyle,
  viewContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  locationBtn: {
    backgroundColor: Theme.Colors.primary,
    width: '30%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    borderRadius: 30,
  },
  dateBtn: {
    height: 40,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
  },

  infoText: {
    alignSelf: 'center',
    marginTop: 15,
  },

  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
    marginHorizontal: 60,
    marginVertical: 10,
    paddingVertical: 10,
  },
  deleteIcon: {
    fontSize: 20,
    color: Theme.Colors.error,
  },
  dateText: {
    fontSize: 18,
  },
})
