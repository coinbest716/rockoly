/** @format */

import {
  GET_BOOKING_HISTORY,
  GET_BOOKING_HISTORY_SUCCESS,
  GET_BOOKING_HISTORY_FAIL,
  GET_BOOKING_REQUESTED_DETAILS,
  GET_BOOKING_REQUESTED_SUCCESS_DETAILS,
  GET_BOOKING_REQUESTED_FAIL_DETAILS,
  GET_BOOKING_DETAILS,
  GET_BOOKING_SUCCESS_DETAILS,
  GET_BOOKING_FAIL_DETAILS,
  REFUND_TO_CUSTOMER,
  REFUND_TO_CUSTOMER_SUCCESS,
  REFUND_TO_CUSTOMER_FAIL,
  SENT_TO_CHEF,
  SENT_TO_CHEF_SUCCESS,
  SENT_TO_CHEF_FAIL,
} from './types.js'
import {message} from 'antd'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const getBookingList = (client, offset, startTime, endTime) => async dispatch => {
  dispatch({type: GET_BOOKING_HISTORY})
  try {
    let filterValue = {
      first: offset,
      offset: 0,
      pFromTime: startTime,
      pToTime: endTime,
    }
    if (startTime === null && endTime === null) {
      filterValue = {
        first: offset,
        offset: 0,
        pFromTime: null,
        pToTime: null,
      }
    }
    const gqlValue = gqlTag.query.booking.listWithFiltersGQLTAG(filterValue)

    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    const {nodes} = data.listBookingByDateRange

    if (nodes && nodes.length > 0) {
      return dispatch({type: GET_BOOKING_HISTORY_SUCCESS, payload: nodes})
    } else {
      return dispatch({type: GET_BOOKING_HISTORY_FAIL, payload: []})
    }
  } catch (err) {
    return dispatch({type: GET_BOOKING_HISTORY_FAIL, payload: err.message})
  }
}

export const getBookingListUnmount = () => dispatch => {
  return dispatch({type: GET_BOOKING_HISTORY_SUCCESS, payload: []})
}

export const getBookingDetails = (client, bookingId) => async dispatch => {
  console.log('bookingId', bookingId)
  dispatch({type: GET_BOOKING_DETAILS})
  try {
    const gqlValue = gqlTag.query.booking.byIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        chefBookingHistId: bookingId,
      },
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    if (data.chefBookingHistoryByChefBookingHistId) {
      return dispatch({
        type: GET_BOOKING_SUCCESS_DETAILS,
        payload: data.chefBookingHistoryByChefBookingHistId,
      })
    } else {
      return dispatch({type: GET_BOOKING_FAIL_DETAILS, payload: {}})
    }
  } catch (err) {
    return dispatch({type: GET_BOOKING_FAIL_DETAILS, payload: err.message})
  }
}
export const getBookingRequestDetails = (client, bookingId) => async dispatch => {
  dispatch({type: GET_BOOKING_REQUESTED_DETAILS})
  try {
    const gqlValue = gqlTag.query.booking.requestedBookingByIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data, error} = await client.query({
      query,
      variables: {
        bookingHistId: bookingId,
      },
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    if (data.allChefBookingRequestHistories) {
      return dispatch({
        type: GET_BOOKING_REQUESTED_SUCCESS_DETAILS,
        payload: data.allChefBookingRequestHistories,
      })
    } else {
      return dispatch({type: GET_BOOKING_REQUESTED_FAIL_DETAILS, payload: {}})
    }
  } catch (err) {
    return dispatch({type: GET_BOOKING_REQUESTED_FAIL_DETAILS, payload: err.message})
  }
}

export const sendAmountToChef = (client, value) => async dispatch => {
  console.log('value', value.chefStripeUserId)
  dispatch({type: SENT_TO_CHEF, payload: ''})
  try {
    const gqlValue = gqlTag.mutation.admin.transferAmountGQLTAG

    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: {
        chefStripeUserId: value.chefStripeUserId,
        bookingHistId: value.bookingHistId,
        adminId: value.adminId,
        chefId: value.chefId,
      },
    })
    console.log('data', data)
    if (data && data.stripeTransferAmtTest && data.stripeTransferAmtTest.data) {
      message.success('Payment success')
      return dispatch({type: SENT_TO_CHEF_SUCCESS, payload: 'success'})
    }
  } catch (err) {
    return dispatch({type: SENT_TO_CHEF_FAIL, payload: err.message})
  }
}

export const refundAmoutToCustomer = (client, value) => async dispatch => {
  dispatch({type: REFUND_TO_CUSTOMER, payload: ''})
  try {
    const gqlValue = gqlTag.mutation.admin.refundAmountGQLTAG

    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: value,
    })

    if (data && data.stripeRefundAmtToCustomer && data.stripeRefundAmtToCustomer.data) {
      message.success('Payment success')
      return dispatch({type: REFUND_TO_CUSTOMER_SUCCESS, payload: 'success'})
    }
  } catch (err) {
    return dispatch({type: REFUND_TO_CUSTOMER_FAIL, payload: err.message})
  }
}
