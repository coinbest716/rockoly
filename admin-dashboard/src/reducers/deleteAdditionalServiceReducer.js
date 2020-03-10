/** @format */

import {
  DELETE_ADDITIONAL_SERVICE,
  DELETE_ADDITIONAL_SERVICE_SUCCESS,
  DELETE_ADDITIONAL_SERVICE_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  deleteAdditionalService: {},
  deleteAdditionalServiceLoading: false,
  deleteAdditionalServiceError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DELETE_ADDITIONAL_SERVICE:
      return {
        ...state,
        deleteAdditionalServiceLoading: true,
        deleteAdditionalService: action.payload,
      }
    case DELETE_ADDITIONAL_SERVICE_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        deleteAdditionalServiceError: false,
        deleteAdditionalService: action.payload,
      }
    case DELETE_ADDITIONAL_SERVICE_FAIL:
      return {
        ...state,
        deleteAdditionalServiceError: action.payload,
        deleteAdditionalServiceLoading: false,
      }
    default:
      return state
  }
}
