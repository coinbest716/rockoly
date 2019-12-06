/** @format */

import {GET_CHEF, GET_CHEF_SUCCESS, GET_CHEF_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  chefList: [],
  chefListLoading: false,
  chefListError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CHEF:
      return {...state, chefListLoading: true}
    case GET_CHEF_SUCCESS:
      return {...state, ...INITIAL_STATE, chefListLoading: false, chefList: action.payload}
    case GET_CHEF_FAIL:
      return {
        ...state,
        chefListError: action.payload,
        chefListLoading: false,
      }
    default:
      return state
  }
}
