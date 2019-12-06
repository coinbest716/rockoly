/** @format */

import {SEARCH, SEARCH_SUCCESS, SEARCH_FAIL} from './types'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const searchCommonData = (client, params) => async dispatch => {
  dispatch({type: SEARCH})
  try {
    const gqlValue = gqlTag.query.admin.searchGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        pSearchStr: params,
      },
    })
    if (data.filterChefBySearchStr && data.filterCustomerBySearchStr) {
      return dispatch({type: SEARCH_SUCCESS, payload: data})
    } else {
      return dispatch({type: SEARCH_FAIL, payload: CommonLabels.FAIL})
    }
  } catch (err) {
    return dispatch({type: SEARCH_FAIL, payload: err.message})
  }
}
