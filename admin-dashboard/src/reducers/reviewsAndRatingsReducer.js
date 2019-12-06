/** @format */

import {
  GET_REVIEWS_AND_RATINGS_HISTORY,
  GET_REVIEWS_AND_RATINGS_SUCCESS,
  GET_REVIEWS_AND_RATINGS_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  reviewRatingList: [],
  reviewRatingListLoading: false,
  reviewRatingListError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REVIEWS_AND_RATINGS_HISTORY:
      return {...state, reviewRatingListLoading: true}
    case GET_REVIEWS_AND_RATINGS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        reviewRatingListError: false,
        reviewRatingList: action.payload,
      }
    case GET_REVIEWS_AND_RATINGS_FAIL:
      return {
        ...state,
        reviewRatingListError: action.payload,
        reviewRatingListLoading: false,
      }
    default:
      return state
  }
}
