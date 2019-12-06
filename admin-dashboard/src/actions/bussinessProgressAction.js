/** @format */

import {
  GET_BUSINESS_PROGRESS_DATA,
  GET_BUSINESS_PROGRESS_DATA_SUCCESS,
  GET_BUSINESS_PROGRESS_DATA_FAIL,
} from './types.js'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const getBussinessProgressData = (client, uid, startTime, endTime) => async dispatch => {
  dispatch({type: GET_BUSINESS_PROGRESS_DATA})
  try {
    let filterValue = {
      adminId: uid,
      pFromTime: startTime,
      pToTime: endTime,
    }
    if (startTime === null && endTime === null) {
      filterValue = {
        adminId: uid,
      }
    }
    const gqlValue = gqlTag.query.commission.filterEarnedHistByAdminIdGQLTAG(filterValue)
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
    })
    if (
      data &&
      data.allCommissionEarnedHistories &&
      data.allCommissionEarnedHistories !== undefined
    ) {
      return dispatch({
        type: GET_BUSINESS_PROGRESS_DATA_SUCCESS,
        payload: data.allCommissionEarnedHistories,
      })
    } else {
      return dispatch({type: GET_BUSINESS_PROGRESS_DATA_FAIL, payload: CommonLabels.FAIL})
    }
  } catch (err) {
    return dispatch({type: GET_BUSINESS_PROGRESS_DATA_FAIL, payload: err.message})
  }
}
