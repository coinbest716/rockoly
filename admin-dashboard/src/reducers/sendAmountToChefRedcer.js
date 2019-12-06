/** @format */

import {SENT_TO_CHEF, SENT_TO_CHEF_SUCCESS, SENT_TO_CHEF_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  sentToChef: '',
  sentToChefLoading: false,
  sentToChefError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SENT_TO_CHEF:
      return {...state, sentToChefLoading: true, sentToChef: action.payload}
    case SENT_TO_CHEF_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        sentToChefError: false,
        sentToChef: action.payload,
      }
    case SENT_TO_CHEF_FAIL:
      return {
        ...state,
        sentToChefError: action.payload,
        sentToChefLoading: false,
      }
    default:
      return state
  }
}
