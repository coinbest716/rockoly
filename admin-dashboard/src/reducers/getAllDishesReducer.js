/** @format */

import {GET_DISHES, GET_DISHES_SUCCESS, GET_DISHES_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  allDishes: [],
  allDishesLoading: false,
  allDishesError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_DISHES:
      return {...state, allDishesLoading: true, allDishes: action.payload}
    case GET_DISHES_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        allDishesError: false,
        allDishes: action.payload,
      }
    case GET_DISHES_FAIL:
      return {
        ...state,
        allDishesError: action.payload,
        allDishesLoading: false,
      }
    default:
      return state
  }
}
