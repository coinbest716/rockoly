/** @format */

import {
  GET_STRIPE_PERCENTAGE,
  GET_STRIPE_PERCENTAGE_SUCCESS,
  GET_STRIPE_PERCENTAGE_FAIL,
} from '../actions/types.js'

const INITIAL_STATE = {
  stripePercentage: {},
  stripePercentageLoading: false,
  stripePercentageError: '',
}

export default (state = INITIAL_STATE, action) => {
  console.log('action', action.payload)
  switch (action.type) {
    case GET_STRIPE_PERCENTAGE:
      return {...state, stripePercentageLoading: true, stripePercentage: action.payload}
    case GET_STRIPE_PERCENTAGE_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        stripePercentageError: false,
        stripePercentage: action.payload,
      }
    case GET_STRIPE_PERCENTAGE_FAIL:
      return {
        ...state,
        stripePercentageError: action.payload,
        stripePercentageLoading: false,
      }
    default:
      return state
  }
}
