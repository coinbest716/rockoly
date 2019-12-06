/** @format */

import {GET_ADMIN_PROFILE, GET_ADMIN_PROFILE_SUCCESS, GET_ADMIN_PROFILE_FAIL} from './types.js'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const getAdminProfile = (client, uid) => async dispatch => {
  dispatch({type: GET_ADMIN_PROFILE})
  try {
    const gqlValue = gqlTag.query.admin.profileByIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        adminId: uid,
        fetchPolicy: 'network-only',
      },
    })
    if (data && data.adminProfileByAdminId) {
      return dispatch({type: GET_ADMIN_PROFILE_SUCCESS, payload: data.adminProfileByAdminId})
    } else {
      return dispatch({type: GET_ADMIN_PROFILE_FAIL, payload: CommonLabels.FAIL})
    }
  } catch (err) {
    return dispatch({type: GET_ADMIN_PROFILE_FAIL, payload: err.message})
  }
}
