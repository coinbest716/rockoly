/** @format */

import {
  GET_STRIPE_CENTS,
  GET_STRIPE_CENTS_SUCCESS,
  GET_STRIPE_CENTS_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  stripeCents: {},
  stripeCentsLoading: false,
  srtipeCentsError: '',
}

export default (state = INITIAL_STATE, action) => {
  console.log('action', action.payload)
  switch (action.type) {
    case GET_STRIPE_CENTS:
      return {...state, stripeCentsLoading: true, stripeCents: action.payload}
    case GET_STRIPE_CENTS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        srtipeCentsError: false,
        stripeCents: action.payload,
      }
    case GET_STRIPE_CENTS_FAIL:
      return {
        ...state,
        srtipeCentsError: action.payload,
        stripeCentsLoading: false,
      }
    default:
      return state
  }
}
