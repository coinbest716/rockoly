/** @format */

import {GET_CHEF_DISH, GET_CHEF_DISH_SUCCESS, GET_CHEF_DISH_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  chefDish: [],
  chefDishLoading: false,
  chefDishError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CHEF_DISH:
      return {...state, chefDishLoading: true}
    case GET_CHEF_DISH_SUCCESS:
      return {...state, ...INITIAL_STATE, chefDishLoading: false, chefDish: action.payload}
    case GET_CHEF_DISH_FAIL:
      return {
        ...state,
        chefDishError: action.payload,
        chefDishLoading: false,
      }
    default:
      return state
  }
}
