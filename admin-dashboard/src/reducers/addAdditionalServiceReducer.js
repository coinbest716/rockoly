/** @format */

import {
  CREATE_ADDITIONAL_SERVICE,
  CREATE_ADDITIONAL_SERVICE_SUCCESS,
  CREATE_ADDITIONAL_SERVICE_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  addAdditionalService: [],
  addAdditionalServiceLoading: false,
  addAdditionalServiceError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_ADDITIONAL_SERVICE:
      return {...state, addAdditionalServiceLoading: true, addAdditionalService: action.payload}
    case CREATE_ADDITIONAL_SERVICE_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        addAdditionalServiceError: false,
        addAdditionalService: action.payload,
      }
    case CREATE_ADDITIONAL_SERVICE_FAIL:
      return {
        ...state,
        addAdditionalServiceError: action.payload,
        addAdditionalServiceLoading: false,
      }
    default:
      return state
  }
}
