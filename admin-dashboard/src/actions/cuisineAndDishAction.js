/** @format */

import {
  GET_CUISINES,
  GET_CUISINES_SUCCESS,
  GET_CUISINES_FAIL,
  GET_DISHES,
  GET_DISHES_SUCCESS,
  GET_DISHES_FAIL,
  GET_CHEF_CUISINE,
  GET_CHEF_CUISINE_SUCCESS,
  GET_CHEF_CUISINE_FAIL,
  GET_CHEF_DISH,
  GET_CHEF_DISH_SUCCESS,
  GET_CHEF_DISH_FAIL,
  UPDATE_CUSINIE_STATUS,
  UPDATE_CUSINIE_STATUS_SUCCESS,
  UPDATE_CUSINIE_STATUS_FAIL,
  UPDATE_DISH_STATUS,
  UPDATE_DISH_STATUS_SUCCESS,
  UPDATE_DISH_STATUS_FAIL,
} from './types'
import {message} from 'antd'
import gql from 'graphql-tag'
import * as gqlStatus from '../common/constants/constant.status'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'

export const getAllCuisines = client => async dispatch => {
  dispatch({type: GET_CUISINES})
  try {
    const gqlValue = gqlTag.query.master.allCuisinesByStatusGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        statusId: gqlStatus.status.PENDING,
      },
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    if (data && data.allCuisineTypeMasters && data.allCuisineTypeMasters.nodes) {
      return dispatch({type: GET_CUISINES_SUCCESS, payload: data.allCuisineTypeMasters.nodes})
    } else {
      return dispatch({type: GET_CUISINES_FAIL, payload: CommonLabels.FAIL})
    }
  } catch (err) {
    return dispatch({type: GET_DISHES_FAIL, payload: err.message})
  }
}

export const getAllDishes = client => async dispatch => {
  dispatch({type: GET_DISHES})
  try {
    const gqlValue = gqlTag.query.master.allDishesByStatusGQLTAG
    console.log('gqlValue', gqlValue)
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        statusId: gqlStatus.status.PENDING,
      },
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    console.log('data', data)
    if (data && data.allDishTypeMasters && data.allDishTypeMasters.nodes) {
      return dispatch({type: GET_DISHES_SUCCESS, payload: data.allDishTypeMasters.nodes})
    } else {
      return dispatch({type: GET_DISHES_FAIL, payload: CommonLabels.FAIL})
    }
  } catch (err) {
    return dispatch({type: GET_DISHES_FAIL, payload: err.message})
  }
}

export const getCuisineType = client => async dispatch => {
  dispatch({type: GET_CHEF_CUISINE})
  try {
    const gqlValue = gqlTag.query.master.allCuisinesByStatusGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        statusId: gqlStatus.status.APPROVED,
      },
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    if (data && data.allCuisineTypeMasters && data.allCuisineTypeMasters.nodes) {
      return dispatch({type: GET_CHEF_CUISINE_SUCCESS, payload: data.allCuisineTypeMasters.nodes})
    } else {
      return dispatch({type: GET_CHEF_CUISINE_FAIL, payload: []})
    }
  } catch (err) {
    return dispatch({type: GET_CHEF_DISH_FAIL, payload: err.message})
  }
}

export const getDishType = client => async dispatch => {
  dispatch({type: GET_CHEF_DISH})
  try {
    const gqlValue = gqlTag.query.master.allDishesByStatusGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        statusId: gqlStatus.status.APPROVED,
      },
      fetchPolicy: CommonLabels.NETWORK_ONLY,
    })
    if (data && data.allDishTypeMasters && data.allDishTypeMasters.nodes) {
      return dispatch({type: GET_CHEF_DISH_SUCCESS, payload: data.allDishTypeMasters.nodes})
    } else {
      return dispatch({type: GET_CHEF_DISH_FAIL, payload: []})
    }
  } catch (err) {
    return dispatch({type: GET_CHEF_DISH_FAIL, payload: err.message})
  }
}

export const updateCuisineStatus = (value, client) => async dispatch => {
  dispatch({type: UPDATE_CUSINIE_STATUS})
  try {
    const gqlValue = gqlTag.mutation.master.updateCuisineTypeGQLTAG
    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: value,
    })

    if (
      data &&
      data.updateCuisineTypeMasterByCuisineTypeId &&
      data.updateCuisineTypeMasterByCuisineTypeId.cuisineTypeMaster
    ) {
      message.success(value.statusId === 'APPROVED' ? 'Cuisine Approved' : 'Cuisine Rejected')
      return dispatch({
        type: UPDATE_CUSINIE_STATUS_SUCCESS,
        payload: CommonLabels.SUCCESS,
      })
    } else {
      return dispatch({type: UPDATE_CUSINIE_STATUS_FAIL, payload: CommonLabels.UPDATE_FAIL})
    }
  } catch (err) {
    return dispatch({type: UPDATE_CUSINIE_STATUS_FAIL, payload: err.message})
  }
}

export const updateDishStatus = (value, client) => async dispatch => {
  dispatch({type: UPDATE_DISH_STATUS})
  try {
    const gqlValue = gqlTag.mutation.master.updateDishTypeGQLTAG
    const mutation = gql`
      ${gqlValue}
    `
    const {data} = await client.mutate({
      mutation,
      variables: value,
    })
    if (
      data &&
      data.updateDishTypeMasterByDishTypeId &&
      data.updateDishTypeMasterByDishTypeId.dishTypeMaster
    ) {
      message.success(value.statusId === 'APPROVED' ? 'Dish Approved' : 'Dish Rejected')
      return dispatch({
        type: UPDATE_DISH_STATUS_SUCCESS,
        payload: CommonLabels.SUCCESS,
      })
    } else {
      return dispatch({type: UPDATE_DISH_STATUS_FAIL, payload: CommonLabels.UPDATE_FAIL})
    }
  } catch (err) {
    return dispatch({type: UPDATE_DISH_STATUS_FAIL, payload: err.message})
  }
}
