/** @format */

import {RESET_PASSWORD, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  resetpassword: '',
  resetpasswordLoading: false,
  resetpasswordError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RESET_PASSWORD:
      return {...state, resetpasswordLoading: true, resetpassword: action.payload}
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        resetpasswordLoading: false,
        resetpassword: action.payload,
      }
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        resetpasswordError: action.payload,
        resetpasswordLoading: false,
      }
    default:
      return state
  }
}
