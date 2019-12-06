/** @format */

import {
  GET_CHEF,
  GET_CHEF_SUCCESS,
  GET_CHEF_FAIL,
  GET_CHEF_DETAILS,
  GET_CHEF_SUCCESS_DETAILS,
  GET_CHEF_FAIL_DETAILS,
  UPDATE_CHEF_STATUS,
  UPDATE_CHEF_STATUS_SUCCESS,
  UPDATE_CHEF_STATUS_FAIL,
} from './types.js'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const getChefList = (client, offset, startTime, endTime, status) => async dispatch => {
  dispatch({type: GET_CHEF})
  try {
    let filterValue = {}
    if (startTime === null && endTime === null && status[0] === 'All') {
      filterValue = {
        first: offset,
        offset: 0,
      }
    }
    if (startTime === null && endTime === null && status[0] !== 'All') {
      filterValue = {
        first: offset,
        offset: 0,
        statusId: status,
      }
    }
    if (startTime !== null && endTime !== null && status[0] !== 'All') {
      filterValue = {
        first: offset,
        offset: 0,
        fromTime: startTime,
        toTime: endTime,
        statusId: status,
      }
    }
    if (startTime !== null && endTime !== null && status[0] === 'All') {
      filterValue = {
        first: offset,
        offset: 0,
        fromTime: startTime,
        toTime: endTime,
      }
    }

    const gqlValue = gqlTag.query.chef.listWithFiltersGQLTAG(filterValue)
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    const {nodes} = data.allChefProfiles
    if (data.hasOwnProperty('allChefProfiles') && nodes) {
      return dispatch({type: GET_CHEF_SUCCESS, payload: nodes})
    } else {
      return dispatch({type: GET_CHEF_FAIL, payload: []})
    }
  } catch (err) {
    return dispatch({type: GET_CHEF_FAIL, payload: err.message})
  }
}

export const getChefDetails = (client, userId) => async dispatch => {
  dispatch({type: GET_CHEF_DETAILS})
  try {
    const gqlValue = gqlTag.query.chef.profileByIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        chefId: userId,
      },
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    if (data.chefProfileByChefId) {
      return dispatch({type: GET_CHEF_SUCCESS_DETAILS, payload: data.chefProfileByChefId})
    } else {
      return dispatch({type: GET_CHEF_FAIL_DETAILS, payload: {}})
    }
  } catch (err) {
    return dispatch({type: GET_CHEF_FAIL_DETAILS, payload: err.message})
  }
}

export const updateChefStatus = (value, status, client) => async dispatch => {
  dispatch({type: UPDATE_CHEF_STATUS})
  try {
    const gqlValue = gqlTag.mutation.chef.updateStatusByChefIdGQLTAG
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
      data.updateStatusByChefId &&
      data.updateStatusByChefId.procedureResult &&
      data.updateStatusByChefId.procedureResult.message
    ) {
      return dispatch({
        type: UPDATE_CHEF_STATUS_SUCCESS,
        payload: data.updateStatusByChefId.procedureResult.message,
      })
    } else {
      return dispatch({type: UPDATE_CHEF_STATUS_FAIL, payload: CommonLabels.UPDATE_FAIL})
    }
  } catch (err) {
    return dispatch({type: UPDATE_CHEF_STATUS_FAIL, payload: err.message})
  }
}
