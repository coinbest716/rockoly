/** @format */

import {GET_CUISINES, GET_CUISINES_SUCCESS, GET_CUISINES_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  allCuisines: [],
  allCuisinesLoading: false,
  allCuisinesError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CUISINES:
      return {...state, allCuisinesLoading: true, allCuisines: action.payload}
    case GET_CUISINES_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        allCuisinesError: false,
        allCuisines: action.payload,
      }
    case GET_CUISINES_FAIL:
      return {
        ...state,
        allCuisinesError: action.payload,
        allCuisinesLoading: false,
      }
    default:
      return state
  }
}
