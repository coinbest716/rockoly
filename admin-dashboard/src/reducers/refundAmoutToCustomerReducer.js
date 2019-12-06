/** @format */

import {
  REFUND_TO_CUSTOMER,
  REFUND_TO_CUSTOMER_SUCCESS,
  REFUND_TO_CUSTOMER_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  refundToCustomer: '',
  refundToCustomerLoading: false,
  refundToCustomerError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REFUND_TO_CUSTOMER:
      return {...state, refundToCustomerLoading: true, refundToCustomer: action.payload}
    case REFUND_TO_CUSTOMER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        refundToCustomerError: false,
        refundToCustomer: action.payload,
      }
    case REFUND_TO_CUSTOMER_FAIL:
      return {
        ...state,
        refundToCustomerError: action.payload,
        refundToCustomerLoading: false,
      }
    default:
      return state
  }
}
