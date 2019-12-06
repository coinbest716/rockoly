/** @format */

import {
  GET_CUSTOMER,
  GET_CUSTOMER_SUCCESS,
  GET_CUSTOMER_FAIL,
  GET_CUSTOMER_DETAILS,
  GET_CUSTOMER_SUCCESS_DETAILS,
  GET_CUSTOMER_FAIL_DETAILS,
  UPDATE_CUSTOMER_STATUS,
  UPDATE_CUSTOMER_STATUS_SUCCESS,
  UPDATE_CUSTOMER_STATUS_FAIL,
} from './types.js'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const getCustomerList = (client, offset, startTime, endTime) => async dispatch => {
  dispatch({type: GET_CUSTOMER})
  try {
    let filterValue = {
      first: offset,
      offset: 0,
      fromTime: startTime,
      toTime: endTime,
    }
    if (startTime === null && endTime === null) {
      filterValue = {
        first: offset,
        offset: 0,
      }
    }
    const gqlValue = gqlTag.query.customer.listWithFiltersGQLTAG(filterValue)
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    const {nodes} = data.allCustomerProfiles
    if (data.hasOwnProperty('allCustomerProfiles') && nodes) {
      return dispatch({type: GET_CUSTOMER_SUCCESS, payload: nodes})
    } else {
      return dispatch({type: GET_CUSTOMER_FAIL, payload: []})
    }
  } catch (err) {
    return dispatch({type: GET_CUSTOMER_FAIL, payload: err.message})
  }
}

export const getCustomerDetails = (client, userId) => async dispatch => {
  dispatch({type: GET_CUSTOMER_DETAILS})
  try {
    const gqlValue = gqlTag.query.customer.profileByIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        customerId: userId,
      },
    })

    if (data.customerProfileByCustomerId) {
      return dispatch({
        type: GET_CUSTOMER_SUCCESS_DETAILS,
        payload: data.customerProfileByCustomerId,
      })
    } else {
      return dispatch({type: GET_CUSTOMER_FAIL_DETAILS, payload: {}})
    }
  } catch (err) {
    return dispatch({type: GET_CUSTOMER_FAIL_DETAILS, payload: err.message})
  }
}

export const updateCustomerStatus = (value, status, client) => async dispatch => {
  dispatch({type: UPDATE_CUSTOMER_STATUS})
  try {
    const gqlValue = gqlTag.mutation.customer.updateStatusByCustomerIdGQLTAG
    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: {
        pStatusId: status,
        pData: value,
      },
    })
    if (
      data &&
      data.updateStatusByCustomerId &&
      data.updateStatusByCustomerId.procedureResult &&
      data.updateStatusByCustomerId.procedureResult.message
    ) {
      return dispatch({
        type: UPDATE_CUSTOMER_STATUS_SUCCESS,
        payload: data.updateStatusByCustomerId.procedureResult.message,
      })
    } else {
      return dispatch({type: UPDATE_CUSTOMER_STATUS_FAIL, payload: CommonLabels.UPDATE_FAIL})
    }
  } catch (err) {
    return dispatch({type: UPDATE_CUSTOMER_STATUS_FAIL, payload: err.message})
  }
}
