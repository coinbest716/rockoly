/** @format */

import {
  UPDATE_REVIEW_STATUS,
  UPDATE_REVIEW_STATUS_SUCCESS,
  UPDATE_REVIEW_STATUS_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  reviewUpdate: '',
  reviewUpdateLoading: false,
  reviewUpdateError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_REVIEW_STATUS:
      return {...state, reviewUpdateLoading: true, reviewUpdate: action.payload}
    case UPDATE_REVIEW_STATUS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        reviewUpdateError: false,
        reviewUpdate: action.payload,
      }
    case UPDATE_REVIEW_STATUS_FAIL:
      return {
        ...state,
        reviewUpdateError: action.payload,
        reviewUpdateLoading: false,
      }
    default:
      return state
  }
}
