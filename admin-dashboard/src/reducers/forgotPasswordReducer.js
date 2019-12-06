/** @format */

import {FORGOT_PASSWORD, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  forgotpassword: '',
  forgotpasswordLoading: false,
  forgotpasswordError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD:
      return {...state, forgotpasswordLoading: true, forgotpassword: action.payload}
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        forgotpasswordLoading: false,
        forgotpassword: action.payload,
      }
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        forgotpasswordError: action.payload,
        forgotpasswordLoading: false,
      }
    default:
      return state
  }
}
