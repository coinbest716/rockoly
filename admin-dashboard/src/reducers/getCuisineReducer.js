/** @format */

import {
  GET_CHEF_CUISINE,
  GET_CHEF_CUISINE_SUCCESS,
  GET_CHEF_CUISINE_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  chefCuisine: [],
  chefCuisineLoading: false,
  chefCuisineError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CHEF_CUISINE:
      return {...state, chefCuisineLoading: true}
    case GET_CHEF_CUISINE_SUCCESS:
      return {...state, ...INITIAL_STATE, chefCuisineLoading: false, chefCuisine: action.payload}
    case GET_CHEF_CUISINE_FAIL:
      return {
        ...state,
        chefCuisineError: action.payload,
        chefCuisineLoading: false,
      }
    default:
      return state
  }
}
