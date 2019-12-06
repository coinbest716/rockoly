/** @format */

import {
  GET_BOOKING_DETAILS,
  GET_BOOKING_SUCCESS_DETAILS,
  GET_BOOKING_FAIL_DETAILS,
} from '../actions/types.js'

const INITIAL_STATE = {
  bookingDetails: {},
  bookingDetailsLoading: false,
  bookingDetailsError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BOOKING_DETAILS:
      return {...state, bookingDetailsLoading: true, bookingDetails: action.payload}
    case GET_BOOKING_SUCCESS_DETAILS:
      return {
        ...state,
        ...INITIAL_STATE,
        bookingDetailsLoading: false,
        bookingDetails: action.payload,
      }
    case GET_BOOKING_FAIL_DETAILS:
      return {
        ...state,
        bookingDetailsError: action.payload,
        bookingDetailsLoading: false,
      }
    default:
      return state
  }
}
