/** @format */

import {
  GET_BUSINESS_PROGRESS_DATA,
  GET_BUSINESS_PROGRESS_DATA_SUCCESS,
  GET_BUSINESS_PROGRESS_DATA_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  businessProgressData: null,
  businessProgressDataLoading: false,
  businessProgressDataError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BUSINESS_PROGRESS_DATA:
      return {...state, businessProgressDataLoading: true, businessProgressData: action.payload}
    case GET_BUSINESS_PROGRESS_DATA_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        businessProgressDataLoading: false,
        businessProgressData: action.payload,
      }
    case GET_BUSINESS_PROGRESS_DATA_FAIL:
      return {
        ...state,
        businessProgressDataError: action.payload,
        businessProgressDataLoading: false,
      }
    default:
      return state
  }
}
