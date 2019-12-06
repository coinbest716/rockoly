/** @format */
import {
  UPDATE_CHEF_STATUS,
  UPDATE_CHEF_STATUS_SUCCESS,
  UPDATE_CHEF_STATUS_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  chefUpdateStatus: '',
  chefUpdateStatusLoading: false,
  chefUpdateStatusError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_CHEF_STATUS:
      return {...state, chefUpdateStatusLoading: true, chefUpdateStatus: action.payload}
    case UPDATE_CHEF_STATUS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        chefUpdateStatusLoading: false,
        chefUpdateStatus: action.payload,
      }
    case UPDATE_CHEF_STATUS_FAIL:
      return {
        ...state,
        chefUpdateStatusError: action.payload,
        chefUpdateStatusLoading: false,
      }
    default:
      return state
  }
}
