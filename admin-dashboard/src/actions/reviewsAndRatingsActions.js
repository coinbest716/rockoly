/** @format */

import {
  GET_REVIEWS_AND_RATINGS_HISTORY,
  GET_REVIEWS_AND_RATINGS_SUCCESS,
  GET_REVIEWS_AND_RATINGS_FAIL,
  GET_REVIEWS_AND_RATINGS_DETAILS,
  GET_REVIEWS_AND_RATINGS_DETAILS_SUCCESS,
  GET_REVIEWS_AND_RATINGS_DETAILS_FAIL,
  UPDATE_REVIEW_STATUS,
  UPDATE_REVIEW_STATUS_SUCCESS,
  UPDATE_REVIEW_STATUS_FAIL,
} from './types.js'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const getReviewRatingList = (client, offset, startTime, endTime) => async dispatch => {
  dispatch({type: GET_REVIEWS_AND_RATINGS_HISTORY})
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
    console.log('filterValue', filterValue)
    const gqlValue = gqlTag.query.review.listWithFiltersGQLTAG(filterValue)
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    const {nodes} = data.allReviewHistories

    if (nodes) {
      return dispatch({type: GET_REVIEWS_AND_RATINGS_SUCCESS, payload: nodes})
    } else {
      return dispatch({type: GET_REVIEWS_AND_RATINGS_FAIL, payload: []})
    }
  } catch (err) {
    return dispatch({type: GET_REVIEWS_AND_RATINGS_FAIL, payload: err.message})
  }
}

export const setEmptyReviewRatingList = () => dispatch => {
  return dispatch({type: GET_REVIEWS_AND_RATINGS_DETAILS_FAIL, payload: []})
}

export const getReviewRatingDetail = (client, reviewId) => async dispatch => {
  dispatch({type: GET_REVIEWS_AND_RATINGS_DETAILS})
  try {
    const gqlValue = gqlTag.query.review.byIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        reviewHistId: reviewId,
      },
    })
    const nodes = data.reviewHistoryByReviewHistId

    if (nodes && nodes.length !== null && nodes !== undefined) {
      return dispatch({type: GET_REVIEWS_AND_RATINGS_DETAILS_SUCCESS, payload: nodes})
    } else {
      return dispatch({type: GET_REVIEWS_AND_RATINGS_DETAILS_FAIL, payload: []})
    }
  } catch (err) {
    return dispatch({type: GET_REVIEWS_AND_RATINGS_DETAILS_FAIL, payload: err.message})
  }
}

export const updateBlockUnblockStatus = (value, status, client) => async dispatch => {
  dispatch({type: UPDATE_REVIEW_STATUS})
  try {
    const gqlValue = gqlTag.mutation.review.updateStatusByReviewIdGQLTAG
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
      data.updateStatusByReviewId &&
      data.updateStatusByReviewId.procedureResult &&
      data.updateStatusByReviewId.procedureResult.message
    ) {
      return dispatch({
        type: UPDATE_REVIEW_STATUS_SUCCESS,
        payload: data.updateStatusByReviewId.procedureResult.message,
      })
    } else {
      return dispatch({type: UPDATE_REVIEW_STATUS_FAIL, payload: CommonLabels.UPDATE_FAIL})
    }
  } catch (err) {
    return dispatch({type: UPDATE_REVIEW_STATUS_FAIL, payload: err.message})
  }
}
