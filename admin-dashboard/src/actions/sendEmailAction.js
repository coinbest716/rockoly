/** @format */

import {SEND_MAIL, SEND_MAIL_SUCCESS, SEND_MAIL_FAIL} from './types'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const sendEmailToUser = (client, params) => async dispatch => {
  dispatch({type: SEND_MAIL})
  try {
    const gqlValue = gqlTag.mutation.custom.sendEmailGQLTAG
    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: params,
    })

    if (data && data.sendEmail && data.sendEmail.data) {
      return dispatch({type: SEND_MAIL_SUCCESS, payload: CommonLabels.SUCCESS})
    } else {
      return dispatch({type: SEND_MAIL_FAIL, payload: CommonLabels.FAIL})
    }
  } catch (err) {
    return dispatch({type: SEND_MAIL_FAIL, payload: err.message})
  }
}
