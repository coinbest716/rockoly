/** @format */

import {
  UPDATE_CANCELLATION_TIME,
  UPDATE_CANCELLATION_TIME_SUCCESS,
  UPDATE_CANCELLATION_TIME_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  updatedCancellationTime: '',
  updatedCancellationTimeLoading: false,
  updatedCancellationTimeError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_CANCELLATION_TIME:
      console.log('action.payload', action.payload)
      return {
        ...state,
        updatedCancellationTimeLoading: true,
        updatedCancellationTime: action.payload,
      }
    case UPDATE_CANCELLATION_TIME_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        updatedCancellationTimeError: false,
        updatedCancellationTime: action.payload,
      }
    case UPDATE_CANCELLATION_TIME_FAIL:
      return {
        ...state,
        updatedCancellationTimeError: action.payload,
        updatedCancellationTimeLoading: false,
      }
    default:
      return state
  }
}
