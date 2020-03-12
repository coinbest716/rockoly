/** @format */

import {
  GET_BOOKING_REQUESTED_DETAILS,
  GET_BOOKING_REQUESTED_SUCCESS_DETAILS,
  GET_BOOKING_REQUESTED_FAIL_DETAILS,
} from '../actions/types.js'

const INITIAL_STATE = {
  bookingRequestedDetails: {},
  bookingRequestedDetailsLoading: false,
  bookingRequestedDetailsError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BOOKING_REQUESTED_DETAILS:
      return {
        ...state,
        bookingRequestedDetailsLoading: true,
        bookingRequestedDetails: action.payload,
      }
    case GET_BOOKING_REQUESTED_SUCCESS_DETAILS:
      console.log('action.payload', action.payload)
      return {
        ...state,
        ...INITIAL_STATE,
        bookingRequestedDetailsLoading: false,
        bookingRequestedDetails: action.payload,
      }
    case GET_BOOKING_REQUESTED_FAIL_DETAILS:
      return {
        ...state,
        bookingRequestedDetailsError: action.payload,
        bookingRequestedDetailsLoading: false,
      }
    default:
      return state
  }
}
