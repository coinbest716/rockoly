/** @format */
import {
  UPDATE_COMMISSION,
  UPDATE_COMMISSION_SUCCESS,
  UPDATE_COMMISSION_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  commissionUpdate: {},
  commissionUpdateLoading: false,
  commissionUpdateError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_COMMISSION:
      return {...state, commissionUpdateLoading: true, commissionUpdate: action.payload}
    case UPDATE_COMMISSION_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        commissionUpdateLoading: false,
        commissionUpdate: action.payload,
      }
    case UPDATE_COMMISSION_FAIL:
      return {
        ...state,
        commissionUpdateError: action.payload,
        commissionUpdateLoading: false,
      }
    default:
      return state
  }
}
