/** @format */
import {
  UPDATE_CUSTOMER_STATUS,
  UPDATE_CUSTOMER_STATUS_SUCCESS,
  UPDATE_CUSTOMER_STATUS_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  customerUpdateStatus: '',
  customerUpdateStatusLoading: false,
  customerUpdateStatusError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_CUSTOMER_STATUS:
      return {...state, customerUpdateStatusLoading: true, customerUpdateStatus: action.payload}
    case UPDATE_CUSTOMER_STATUS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        customerUpdateStatusLoading: false,
        customerUpdateStatus: action.payload,
      }
    case UPDATE_CUSTOMER_STATUS_FAIL:
      return {
        ...state,
        customerUpdateStatusError: action.payload,
        customerUpdateStatusLoading: false,
      }
    default:
      return state
  }
}
