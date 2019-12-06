/** @format */

import {GET_CUSTOMER, GET_CUSTOMER_SUCCESS, GET_CUSTOMER_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  customerList: [],
  customerListLoading: false,
  customerListError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CUSTOMER:
      return {...state, customerListLoading: true}
    case GET_CUSTOMER_SUCCESS:
      return {...state, ...INITIAL_STATE, customerListError: false, customerList: action.payload}
    case GET_CUSTOMER_FAIL:
      return {
        ...state,
        customerListError: action.payload,
        customerListLoading: false,
      }
    default:
      return state
  }
}
