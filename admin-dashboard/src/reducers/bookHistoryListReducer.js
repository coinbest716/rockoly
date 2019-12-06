/** @format */

import {
  GET_BOOKING_HISTORY,
  GET_BOOKING_HISTORY_SUCCESS,
  GET_BOOKING_HISTORY_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  bookingHistoryList: [],
  bookingHistoryListLoading: false,
  bookingHistoryListError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BOOKING_HISTORY:
      return {...state, bookingHistoryListLoading: true}
    case GET_BOOKING_HISTORY_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        bookingHistoryListLoading: false,
        bookingHistoryList: action.payload,
      }
    case GET_BOOKING_HISTORY_FAIL:
      return {
        ...state,
        bookingHistoryListError: action.payload,
        bookingHistoryListLoading: false,
      }
    default:
      return state
  }
}
