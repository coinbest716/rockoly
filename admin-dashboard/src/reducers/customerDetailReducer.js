/** @format */

import {
  GET_CUSTOMER_DETAILS,
  GET_CUSTOMER_SUCCESS_DETAILS,
  GET_CUSTOMER_FAIL_DETAILS,
} from '../actions/types.js'

const INITIAL_STATE = {
  customerDetails: {},
  customerDetailsLoading: false,
  customerDetailsError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CUSTOMER_DETAILS:
      return {...state, customerDetailsLoading: true, customerDetails: action.payload}
    case GET_CUSTOMER_SUCCESS_DETAILS:
      return {
        ...state,
        ...INITIAL_STATE,
        customerDetailsLoading: false,
        customerDetails: action.payload,
      }
    case GET_CUSTOMER_FAIL_DETAILS:
      return {
        ...state,
        customerDetailsError: action.payload,
        customerDetailsLoading: false,
      }
    default:
      return state
  }
}
