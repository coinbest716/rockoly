/** @format */

import {SEND_MAIL, SEND_MAIL_SUCCESS, SEND_MAIL_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  sendEmail: '',
  sendEmailLoading: false,
  sendEmailError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEND_MAIL:
      return {...state, sendEmailLoading: true, sendEmail: action.payload}
    case SEND_MAIL_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        sendEmailError: false,
        sendEmail: action.payload,
      }
    case SEND_MAIL_FAIL:
      return {
        ...state,
        sendEmailError: action.payload,
        sendEmailLoading: false,
      }
    default:
      return state
  }
}
