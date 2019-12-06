/** @format */
import {
  UPDATE_DISH_STATUS,
  UPDATE_DISH_STATUS_SUCCESS,
  UPDATE_DISH_STATUS_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  disheStatusUpate: '',
  disheStatusUpateLoading: false,
  disheStatusUpateError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_DISH_STATUS:
      return {...state, disheStatusUpateLoading: true, disheStatusUpate: action.payload}
    case UPDATE_DISH_STATUS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        disheStatusUpateLoading: false,
        disheStatusUpate: action.payload,
      }
    case UPDATE_DISH_STATUS_FAIL:
      return {
        ...state,
        disheStatusUpateError: action.payload,
        disheStatusUpateLoading: false,
      }
    default:
      return state
  }
}
