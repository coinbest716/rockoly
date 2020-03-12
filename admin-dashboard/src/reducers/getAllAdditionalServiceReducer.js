/** @format */

import {
  GET_ADDITIONAL_SERVICE,
  GET_ADDITIONAL_SERVICE_SUCCESS,
  GET_ADDITIONAL_SERVICE_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  allAdditionalService: [],
  allAdditionalServiceLoading: false,
  allAdditionalServiceError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ADDITIONAL_SERVICE:
      return {...state, allAdditionalServiceLoading: true, allAdditionalService: action.payload}
    case GET_ADDITIONAL_SERVICE_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        allAdditionalServiceError: false,
        allAdditionalService: action.payload,
      }
    case GET_ADDITIONAL_SERVICE_FAIL:
      return {
        ...state,
        allAdditionalServiceError: action.payload,
        allAdditionalServiceLoading: false,
      }
    default:
      return state
  }
}
