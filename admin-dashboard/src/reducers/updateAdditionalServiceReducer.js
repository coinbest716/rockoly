/** @format */

import {
  UPDATE_ADDITIONAL_SERVICE,
  UPDATE_ADDITIONAL_SERVICE_SUCCESS,
  UPDATE_ADDITIONAL_SERVICE_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  updateAdditionalService: '',
  updateAdditionalServiceLoading: false,
  updateAdditionalServiceError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_ADDITIONAL_SERVICE:
      return {
        ...state,
        updateAdditionalServiceLoading: true,
        updateAdditionalService: action.payload,
      }
    case UPDATE_ADDITIONAL_SERVICE_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        updateAdditionalServiceError: false,
        updateAdditionalService: action.payload,
      }
    case UPDATE_ADDITIONAL_SERVICE_FAIL:
      return {
        ...state,
        updateAdditionalServiceError: action.payload,
        updateAdditionalServiceLoading: false,
      }
    default:
      return state
  }
}
