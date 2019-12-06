/** @format */

import {
  GET_REVIEWS_AND_RATINGS_DETAILS,
  GET_REVIEWS_AND_RATINGS_DETAILS_SUCCESS,
  GET_REVIEWS_AND_RATINGS_DETAILS_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  reviewDetails: {},
  reviewDetailsLoading: false,
  reviewDetailsError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REVIEWS_AND_RATINGS_DETAILS:
      return {...state, customerDetailsLoading: true, reviewDetails: action.payload}
    case GET_REVIEWS_AND_RATINGS_DETAILS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        reviewDetailsLoading: false,
        reviewDetails: action.payload,
      }
    case GET_REVIEWS_AND_RATINGS_DETAILS_FAIL:
      return {
        ...state,
        reviewDetailsError: action.payload,
        reviewDetailsLoading: false,
      }
    default:
      return state
  }
}
