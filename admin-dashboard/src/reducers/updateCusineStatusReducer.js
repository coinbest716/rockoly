/** @format */
import {
  UPDATE_CUSINIE_STATUS,
  UPDATE_CUSINIE_STATUS_SUCCESS,
  UPDATE_CUSINIE_STATUS_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  cuisineStatusUpate: '',
  cuisineStatusUpateLoading: false,
  cuisineStatusUpateError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_CUSINIE_STATUS:
      return {...state, cuisineStatusUpateLoading: true, cuisineStatusUpate: action.payload}
    case UPDATE_CUSINIE_STATUS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        cuisineStatusUpateLoading: false,
        cuisineStatusUpate: action.payload,
      }
    case UPDATE_CUSINIE_STATUS_FAIL:
      return {
        ...state,
        cuisineStatusUpateError: action.payload,
        cuisineStatusUpateLoading: false,
      }
    default:
      return state
  }
}
