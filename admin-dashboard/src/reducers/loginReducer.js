/** @format */

import {LOGIN, LOGIN_SUCCESS, LOGIN_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  login: '',
  loginLoading: false,
  loginError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {...state, loginLoading: true, login: action.payload}
    case LOGIN_SUCCESS:
      return {...state, ...INITIAL_STATE, loginLoading: false, login: action.payload}
    case LOGIN_FAIL:
      return {
        ...state,
        loginError: action.payload,
        loginLoading: false,
      }
    default:
      return state
  }
}
