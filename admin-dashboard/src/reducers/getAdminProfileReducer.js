/** @format */

import {
  GET_ADMIN_PROFILE,
  GET_ADMIN_PROFILE_SUCCESS,
  GET_ADMIN_PROFILE_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  adminProfile: {},
  adminProfileLoading: false,
  adminProfileError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ADMIN_PROFILE:
      return {...state, adminProfileLoading: true}
    case GET_ADMIN_PROFILE_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        adminProfileLoading: false,
        adminProfile: action.payload,
      }
    case GET_ADMIN_PROFILE_FAIL:
      return {
        ...state,
        adminProfileError: action.payload,
        adminProfileLoading: false,
      }
    default:
      return state
  }
}
