/** @format */
import {GET_COMMISSION, GET_COMMISSION_SUCCESS, GET_COMMISSION_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  commissionList: [],
  commissionListLoading: false,
  commissionListError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_COMMISSION:
      return {...state, commissionListLoading: true, commissionList: action.payload}
    case GET_COMMISSION_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        commissionListLoading: false,
        commissionList: action.payload,
      }
    case GET_COMMISSION_FAIL:
      return {
        ...state,
        commissionListError: action.payload,
        commissionListLoading: false,
      }
    default:
      return state
  }
}
