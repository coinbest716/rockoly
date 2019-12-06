/** @format */

import {
  GET_CANCELLATION_TIME,
  GET_CANCELLATION_TIME_SUCCESS,
  GET_CANCELLATION_TIME_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  cancellationTime: {},
  cancellationTimeLoading: false,
  cancellationTimeError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CANCELLATION_TIME:
      return {...state, cancellationTimeLoading: true, cancellationTime: action.payload}
    case GET_CANCELLATION_TIME_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        cancellationTimeError: false,
        cancellationTime: action.payload,
      }
    case GET_CANCELLATION_TIME_FAIL:
      return {
        ...state,
        cancellationTimeError: action.payload,
        cancellationTimeLoading: false,
      }
    default:
      return state
  }
}
