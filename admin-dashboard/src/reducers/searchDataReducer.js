/** @format */

import {SEARCH, SEARCH_SUCCESS, SEARCH_FAIL} from '../actions/types.js'

const INITIAL_STATE = {
  searchData: '',
  searchDataLoading: false,
  searchDataError: '',
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH:
      return {...state, searchDataLoading: true, searchData: action.payload}
    case SEARCH_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        searchDataError: false,
        searchData: action.payload,
      }
    case SEARCH_FAIL:
      return {
        ...state,
        searchDataError: action.payload,
        searchDataLoading: false,
      }
    default:
      return state
  }
}
