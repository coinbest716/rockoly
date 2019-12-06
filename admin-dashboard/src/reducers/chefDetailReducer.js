/** @format */

import {
  GET_CHEF_DETAILS,
  GET_CHEF_SUCCESS_DETAILS,
  GET_CHEF_FAIL_DETAILS,
} from '../actions/types.js'

const INITIAL_STATE = {
  chefDetails: {},
  chefDetailsLoading: false,
  chefDetailsError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CHEF_DETAILS:
      return {...state, chefDetailsLoading: true, chefDetails: action.payload}
    case GET_CHEF_SUCCESS_DETAILS:
      return {...state, ...INITIAL_STATE, chefDetailsLoading: false, chefDetails: action.payload}
    case GET_CHEF_FAIL_DETAILS:
      return {
        ...state,
        chefDetailsError: action.payload,
        chefDetailsLoading: false,
      }
    default:
      return state
  }
}
