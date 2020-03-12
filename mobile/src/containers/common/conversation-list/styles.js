/** @format */

import {StyleSheet} from 'react-native'
import {Theme} from '@theme'

const styles = StyleSheet.create({
  ...Theme.CommonStyle,
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chefImage: {
    marginHorizontal: 5,
    marginVertical: 5,
    height: 70,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '20%',
    borderRadius: 70,
  },
  contentContainer: {
    width: '70%',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  nameStyling: {
    fontSize: 18,
    lineHeight: 28,
    // marginHorizontal: 5,
    textTransform: 'capitalize',
    // marginVertical: 2,
    color: '#000',
    fontWeight: '500',
    width: '65%',
  },
  locationStyling: {
    fontSize: 14,
    marginHorizontal: 5,
    marginVertical: 6,
  },
  messageDescription: {
    alignItems: 'flex-start',
    marginHorizontal: 5,
    marginVertical: 5,
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
  starView: {
    marginLeft: 5,
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
  },
  starCounttext: {
    // color: Color.primary,
    // marginTop: 1,
    // marginLeft: 5,
    marginTop: 3,
  },
  panelList: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderColor: '#eee',
    borderBottomWidth: 1,
    width: '100%',
  },
  avgText: {
    marginTop: 5,
    paddingLeft: 5,
  },
  buttonStyle: {
    position: 'absolute',
    right: 15,
    top: 12,
    zIndex: 9999,
    width: '25%',
  },
  noDataView: {flex: 1, justifyContent: 'center', alignSelf: 'center'},
  noDataText: {textAlign: 'center'},
  dateStyling: {
    paddingLeft: 5,
    lineHeight: 22,
    fontSize: 12.5,
  },
  itemHourText: {
    fontSize: 14,
    lineHeight: 22,
  },
})
export default styles
