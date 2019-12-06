/** @format */

import {
  UPDATE_COMMISSION,
  UPDATE_COMMISSION_SUCCESS,
  UPDATE_COMMISSION_FAIL,
  GET_COMMISSION,
  GET_COMMISSION_SUCCESS,
  GET_COMMISSION_FAIL,
  GET_TOTAL_COMMISON_EARNED,
  GET_TOTAL_COMMISON_EARNED_SUCCESS,
  GET_TOTAL_COMMISON_EARNED_FAIL,
} from './types.js'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'
import {node} from 'prop-types'

export const createCommission = (commission, uid, client) => async dispatch => {
  dispatch({type: UPDATE_COMMISSION})
  try {
    const gqlValue = gqlTag.mutation.commission.createMgmtHistGQLTAG
    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: {
        commissionValue: commission,
        commissionUnit: '%',
        adminId: uid,
      },
    })
    if (data && data.createCommissionManagementHistory) {
      return dispatch({type: UPDATE_COMMISSION_SUCCESS, payload: CommonLabels.SUCCESS})
    } else {
      return dispatch({
        type: UPDATE_COMMISSION_FAIL,
        payload: data.createCommissionManagementHistory,
      })
    }
  } catch (err) {
    return dispatch({type: UPDATE_COMMISSION_FAIL, payload: err.message})
  }
}

export const getCommissionList = (client, uid) => async dispatch => {
  dispatch({type: GET_COMMISSION})
  try {
    const gqlValue = gqlTag.query.commission.filterMgmtByAdminIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {offset: 0, first: 5},
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    const {nodes} = data.allCommissionManagementHistories
    if (nodes && node.length > 0) {
      return dispatch({type: GET_COMMISSION_SUCCESS, payload: nodes})
    }
  } catch (err) {
    return dispatch({type: GET_COMMISSION_FAIL, payload: err.message})
  }
}

export const getTotalCommisionEarned = (client, uid, startTime, endTime) => async dispatch => {
  dispatch({type: GET_TOTAL_COMMISON_EARNED})
  try {
    let filterValue = {
      adminId: uid,
      pFromTime: startTime,
      pToTime: endTime,
    }
    if (startTime === null && endTime === null) {
      filterValue = {
        adminId: uid,
        pFromTime: null,
        pToTime: null,
      }
    }
    const gqlValue = gqlTag.query.admin.profileByIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: filterValue,
    })

    const nodes = data.adminProfileByAdminId

    if (nodes && nodes.length !== null && nodes !== undefined) {
      return dispatch({type: GET_TOTAL_COMMISON_EARNED_SUCCESS, payload: nodes})
    } else {
      return dispatch({type: GET_TOTAL_COMMISON_EARNED_FAIL, payload: []})
    }
  } catch (err) {
    return dispatch({type: GET_TOTAL_COMMISON_EARNED_FAIL, payload: err.message})
  }
}
