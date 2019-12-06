/** @format */

import {
  GET_TOTAL_COMMISON_EARNED,
  GET_TOTAL_COMMISON_EARNED_SUCCESS,
  GET_TOTAL_COMMISON_EARNED_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  commissionData: {},
  commissionDataLoading: false,
  commissionDataError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TOTAL_COMMISON_EARNED:
      return {...state, commissionDataLoading: true}
    case GET_TOTAL_COMMISON_EARNED_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        commissionDataLoading: false,
        commissionData: action.payload,
      }
    case GET_TOTAL_COMMISON_EARNED_FAIL:
      return {
        ...state,
        commissionDataError: action.payload,
        commissionDataLoading: false,
      }
    default:
      return state
  }
}
