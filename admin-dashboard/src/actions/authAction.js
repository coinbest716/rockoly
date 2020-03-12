/** @format */

import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
} from './types.js'
import firebase from 'firebase'
import {message} from 'antd'
import gql from 'graphql-tag'
import * as gqlTag from '../common/gql'
import CommonLabels from './actionCommonLables'
import {StoreInLocal} from '../utils/localStorage'

export const loginAction = (params, client) => dispatch => {
  dispatch({type: LOGIN})
  try {
    const settings = {timestampsInSnapshots: true}
    const db = firebase.firestore()
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(val => {
        db.settings(settings)
        firebase
          .auth()
          .signInWithEmailAndPassword(params.email, params.password)
          .then(user => {
            //get current user id
            const current = firebase.auth().currentUser
            //Fetch admin id from db
            fetchAdminId
              .storeAdminId(current, client)
              .then(async val => {
                StoreInLocal('uid', val)
                setTimeout(() => {
                  window.location.reload()
                }, 1000)
                //return dispatch({type: LOGIN_SUCCESS, payload: CommonLabels.SUCCESS})
              })
              .catch(err => {
                return dispatch({type: LOGIN_FAIL, payload: CommonLabels.FAIL})
              })
          })
          .catch(err => {
            catchError(err)
            return dispatch({type: LOGIN_FAIL, payload: CommonLabels.FAIL})
          })
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
      })
  } catch (err) {
    message.error(err.message)
    return dispatch({type: LOGIN_FAIL, payload: err.message})
  }
}
export const resetPassword = (email, client) => async dispatch => {
  console.log('emeil', email)
  dispatch({type: RESET_PASSWORD})
  try {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(user => {
        message.success(CommonLabels.LINK_SENT_USERS)
        return dispatch({type: RESET_PASSWORD_SUCCESS, payload: CommonLabels.SUCCESS})
      })
      .catch(error => {
        catchError(error)
        return dispatch({type: RESET_PASSWORD_FAIL, payload: CommonLabels.FAIL})
      })
  } catch (err) {
    return dispatch({type: RESET_PASSWORD_FAIL, payload: err.message})
  }
}

export const adminForgotPassword = (email, sentTo, client) => async dispatch => {
  dispatch({type: FORGOT_PASSWORD})
  try {
    const gqlValue = gqlTag.query.admin.checkUserAdminGQLTAG
    const query = gql`
      ${gqlValue}
    `
    const {data} = await client.query({
      query,
      variables: {
        pAdminEmail: email,
      },
    })

    if (data && data.checkUserIsAdmin) {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(user => {
          if (sentTo === 'admin') {
            message.success(CommonLabels.LINK_SENT)
          } else {
            message.success(CommonLabels.LINK_SENT_USERS)
          }
          return dispatch({type: FORGOT_PASSWORD_SUCCESS, payload: CommonLabels.SUCCESS})
        })
        .catch(error => {
          catchError(error)
          return dispatch({type: FORGOT_PASSWORD_FAIL, payload: CommonLabels.FAIL})
        })
    } else {
      message.error(CommonLabels.NOT_ADMIN)
      return dispatch({type: FORGOT_PASSWORD_FAIL, payload: CommonLabels.FAIL})
    }
  } catch (err) {
    return dispatch({type: FORGOT_PASSWORD_FAIL, payload: err.message})
  }
}

const catchError = error => {
  const errorCode = error.code
  const errorMessage = error.message
  switch (errorCode) {
    case CommonLabels.EMAIL_INVALID:
      message.error(CommonLabels.EMAIL_INVALID_MESSAGE)
      break
    case CommonLabels.AUTH_INVALID:
      message.error(CommonLabels.AUTH_INVALID_MESSAGE)
      break
    case CommonLabels.USER_NOT_FOUND:
      message.error(CommonLabels.USER_NOT_FOUND_MESSAGE)
      break
    default:
      message.error(errorMessage)
  }
}

const fetchAdminId = {
  storeAdminId: (current, client) => {
    return new Promise((resolve, reject) => {
      current
        .getIdToken()
        .then(async val => {
          //Store firebase auth token in local storage
          StoreInLocal('firebaseAuthToken', val)
          const gqlValue = gqlTag.mutation.auth.authtenticateGQLTAG
          const mutation = gql`
            ${gqlValue}
          `
          const {data} = await client.mutate({
            mutation,
            variables: {
              token: val,
              roleType: 'ADMIN',
              authenticateType: 'LOGIN',
              extra: null,
            },
          })
          if (
            data &&
            data.authenticate &&
            data.authenticate.data &&
            data.authenticate.data.adminId
          ) {
            resolve(data.authenticate.data.adminId)
          } else {
            message.error(CommonLabels.NOT_ADMIN)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
}
