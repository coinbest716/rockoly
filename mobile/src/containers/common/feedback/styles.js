/** @format */

import {Platform, Dimensions} from 'react-native'
import {Theme} from '@theme'

export default {
  mainView: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 10,
  },

  feedbackView: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  feedbackTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  feedbackLabel: {
    fontSize: 20,
  },
  labelView: {
    justifyContent: 'center',
    marginVertical: 15,
    marginHorizontal: 10,
    flex: 1,
  },
  label: {
    fontSize: 15,
  },
  nameView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 15,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputView: {
    display: 'flex',
    flex: 1,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  submitBtn: {
    backgroundColor: Theme.Colors.primary,
    width: '45%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 20,
  },
  submitText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    justifyContent: 'center',
  },
  arrowLeftIcon: {
    marginTop: 5,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  reviewStyle: {
    fontSize: 15,
    textAlign: 'center',
  },
  starSpacing: {
    marginHorizontal: 10,
  },
  ratingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagButton: {
    margin: 5,
    borderColor: '#615375',
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 35 : 25,
  },
  noTagButton: {
    margin: 5,
    borderRadius: 20,
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 35 : 25,
  },
  tagView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  closeIcon: {
    marginHorizontal: 5,
    marginVertical: Platform.OS === 'ios' ? 8 : 3,
    color: Theme.Colors.primary,
  },
  review: {
    marginHorizontal: 5,
    marginVertical: Platform.OS === 'ios' ? 6 : 0,
  },
  descriptionStyle: {
    height: 80,
    fontSize: 16,
    justifyContent: 'center',
    color: 'gray',
    paddingLeft: 10,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
  },
}
