/** @format */

import {
  GET_CANCELLATION_TIME,
  GET_CANCELLATION_TIME_SUCCESS,
  GET_CANCELLATION_TIME_FAIL,
  UPDATE_CANCELLATION_TIME,
  UPDATE_CANCELLATION_TIME_SUCCESS,
  UPDATE_CANCELLATION_TIME_FAIL,
} from './types'
import {message} from 'antd'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const getCencellationTime = client => async dispatch => {
  dispatch({type: GET_CANCELLATION_TIME})
  console.log('getCencellationTime')
  try {
    const gqlValue = gqlTag.query.setting.getSettingValueGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        pSettingName: 'NO_OF_MINUTES_FOR_BOOKING_CANCEL',
      },
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })

    console.log('data', data)

    if (data && data.getSettingValue && data.getSettingValue) {
      return dispatch({type: GET_CANCELLATION_TIME_SUCCESS, payload: data})
    } else {
      return dispatch({type: GET_CANCELLATION_TIME_FAIL, payload: CommonLabels.FAIL})
    }
  } catch (err) {
    return dispatch({type: GET_CANCELLATION_TIME_FAIL, payload: err.message})
  }
}

export const updateCancellationTime = (client, params) => async dispatch => {
  dispatch({type: UPDATE_CANCELLATION_TIME, payload: ''})
  console.log('params', params)
  try {
    const gqlValue = gqlTag.mutation.booking.updateBookingCancelTimeGQLTAG
    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: {
        pSettingValue: params,
      },
    })

    if (data && data.updateBookingCancelTime && data.updateBookingCancelTime.procedureResult) {
      console.log('data', data)
      return dispatch({type: UPDATE_CANCELLATION_TIME_SUCCESS, payload: CommonLabels.SUCCESS})
    } else {
      return dispatch({type: UPDATE_CANCELLATION_TIME_FAIL, payload: CommonLabels.FAIL})
    }
  } catch (err) {
    return dispatch({type: UPDATE_CANCELLATION_TIME_FAIL, payload: err.message})
  }
}
