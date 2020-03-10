/** @format */

import {
  GET_ADDITIONAL_SERVICE,
  GET_ADDITIONAL_SERVICE_SUCCESS,
  GET_ADDITIONAL_SERVICE_FAIL,
  CREATE_ADDITIONAL_SERVICE,
  CREATE_ADDITIONAL_SERVICE_SUCCESS,
  CREATE_ADDITIONAL_SERVICE_FAIL,
  DELETE_ADDITIONAL_SERVICE,
  DELETE_ADDITIONAL_SERVICE_SUCCESS,
  DELETE_ADDITIONAL_SERVICE_FAIL,
  UPDATE_ADDITIONAL_SERVICE,
  UPDATE_ADDITIONAL_SERVICE_SUCCESS,
  UPDATE_ADDITIONAL_SERVICE_FAIL,
} from './types.js'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const getAdditionalServiceList = client => async dispatch => {
  dispatch({type: GET_ADDITIONAL_SERVICE})
  try {
    const gqlValue = gqlTag.query.master.allAdditionalServiceTypeMastersGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    console.log('alldata', data)
    const {nodes} = data.allAdditionalServiceTypeMasters
    if (data.hasOwnProperty('allAdditionalServiceTypeMasters') && nodes) {
      return dispatch({type: GET_ADDITIONAL_SERVICE_SUCCESS, payload: nodes})
    } else {
      return dispatch({type: GET_ADDITIONAL_SERVICE_FAIL, payload: []})
    }
  } catch (err) {
    return dispatch({type: GET_ADDITIONAL_SERVICE_FAIL, payload: err.message})
  }
}

export const createAdditionalService = (value, status, client) => async dispatch => {
  dispatch({type: CREATE_ADDITIONAL_SERVICE})
  try {
    const gqlValue = gqlTag.mutation.master.createAdditionalServiceTypeGQLTAG
    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: {
        additionalServiceTypeName: value,
        statusId: status,
      },
    })
    if (
      data &&
      data.createAdditionalServiceTypeMaster.additionalServiceTypeMaster &&
      data.createAdditionalServiceTypeMaster.additionalServiceTypeMaster.additionalServiceTypeName
    ) {
      return dispatch({
        type: CREATE_ADDITIONAL_SERVICE_SUCCESS,
        payload:
          data.createAdditionalServiceTypeMaster.additionalServiceTypeMaster
            .additionalServiceTypeName,
      })
    } else {
      return dispatch({type: CREATE_ADDITIONAL_SERVICE_SUCCESS, payload: CommonLabels.UPDATE_FAIL})
    }
  } catch (err) {
    return dispatch({type: CREATE_ADDITIONAL_SERVICE_FAIL, payload: err.message})
  }
}

export const deleteAdditionalFunction = (id, value, status, client) => async dispatch => {
  dispatch({type: DELETE_ADDITIONAL_SERVICE})
  try {
    const gqlValue = gqlTag.mutation.master.updateAdditionalServiceTypeGQLTAG
    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: {
        additionalServiceTypeId: id,
        additionalServiceTypeName: value,
        statusId: status,
      },
    })
    console.log('delete', data)
    if (
      data &&
      data.updateAdditionalServiceTypeMasterByAdditionalServiceTypeId.additionalServiceTypeMaster &&
      data.updateAdditionalServiceTypeMasterByAdditionalServiceTypeId.additionalServiceTypeMaster
        .statusTypeMasterByStatusId &&
      data.updateAdditionalServiceTypeMasterByAdditionalServiceTypeId.additionalServiceTypeMaster
        .statusTypeMasterByStatusId
    ) {
      return dispatch({
        type: DELETE_ADDITIONAL_SERVICE_SUCCESS,
        payload:
          data.updateAdditionalServiceTypeMasterByAdditionalServiceTypeId
            .additionalServiceTypeMaster.statusTypeMasterByStatusId,
      })
    } else {
      return dispatch({type: DELETE_ADDITIONAL_SERVICE_SUCCESS, payload: CommonLabels.UPDATE_FAIL})
    }
  } catch (err) {
    return dispatch({type: DELETE_ADDITIONAL_SERVICE_FAIL, payload: err.message})
  }
}

export const updateAdditionalFunction = (id, value, status, client) => async dispatch => {
  dispatch({type: UPDATE_ADDITIONAL_SERVICE})
  try {
    const gqlValue = gqlTag.mutation.master.updateAdditionalServiceTypeGQLTAG
    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: {
        additionalServiceTypeId: id,
        additionalServiceTypeName: value,
        statusId: status,
      },
    })
    console.log('update', data)
    if (
      data &&
      data.updateAdditionalServiceTypeMasterByAdditionalServiceTypeId &&
      data.updateAdditionalServiceTypeMasterByAdditionalServiceTypeId.additionalServiceTypeName
    ) {
      return dispatch({
        type: UPDATE_ADDITIONAL_SERVICE_SUCCESS,
        payload:
          data.updateAdditionalServiceTypeMasterByAdditionalServiceTypeId.additionalServiceTypeName,
      })
    } else {
      return dispatch({type: UPDATE_ADDITIONAL_SERVICE_SUCCESS, payload: CommonLabels.UPDATE_FAIL})
    }
  } catch (err) {
    return dispatch({type: UPDATE_ADDITIONAL_SERVICE_FAIL, payload: err.message})
  }
}
