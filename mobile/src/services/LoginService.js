/** @format */
import firebase from 'react-native-firebase'
import gql from 'graphql-tag'
import FBSDK, {AccessToken} from 'react-native-fbsdk'
import {GoogleSignin} from 'react-native-google-signin'
import {GQL, CONSTANTS} from '@common'
import BaseService from './BaseService'
import PushNotificationService from './PushNotificaitonService'
import {RouteNames, ResetAction} from '@navigation'

const gqlLogin = GQL.mutation.auth.authtenticateGQLTAG
const gqlSwitchRole = GQL.mutation.auth.switchRoleGQLTAG

export const LOGIN_SERVICE_EVENTS = {
  EMAIL_LOGIN: 'LOGIN/EMAIL_LOGIN',
  FACEBOOK_LOGIN: 'LOGIN/FACEBOOK_LOGIN',
  GOOGLE_LOGIN: 'LOGIN/GOOGLE_LOGIN',
}

GoogleSignin.configure({
  webClientId: '51537762972-gcp4tvtebnmk7lhj7m57ckn1l3gjp2n5.apps.googleusercontent.com',
})

export const SOCIAL_LOGIN_TYPE = {
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
}

class LoginService extends BaseService {
  constructor() {
    super()
    this.currentUser = {}
  }

  onLogin = async ({role, gqlRes, updateCurrentUser, navigation}) => {
    let currentUser = {}
    let resetTo = ''
    if (role === CONSTANTS.ROLE.CUSTOMER) {
      currentUser = {
        ...gqlRes.customer,
        userId: gqlRes.userId,
      }
      resetTo = RouteNames.CUSTOMER_SWITCH
    } else {
      currentUser = {
        ...gqlRes.chef,
        userId: gqlRes.userId,
      }
      resetTo = RouteNames.CHEF_SWITCH
    }
    PushNotificationService.syncToken(gqlRes.userId)
    console.log('currentUser', currentUser)
    await updateCurrentUser(
      {
        currentUser,
        userData: gqlRes,
      },
      () => {
        console.log(currentUser, gqlRes)
        ResetAction(navigation, resetTo)
      }
    )
  }

  googleLogin = () => {
    return new Promise((resolve, reject) => {
      try {
        GoogleSignin.signIn()
          .then(async googleData => {
            console.log('google success', googleData)
            // create a new firebase credential with the token
            const credential = firebase.auth.GoogleAuthProvider.credential(
              googleData.idToken,
              googleData.accessToken
            )
            // login with credential
            await firebase
              .auth()
              .signInWithCredential(credential)
              .then(async currentUser => {
                console.log('debugging currentUser', currentUser)
                resolve(currentUser)
              })
              .catch(e => {
                reject(e)
              })
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  facebookLogin = () => {
    return new Promise((resolve, reject) => {
      try {
        // To logout any previous logged in account
        FBSDK.LoginManager.logOut()
        setTimeout(() => {
          FBSDK.LoginManager.logInWithPermissions(['public_profile', 'email'])
            .then(async result => {
              console.log('debugging result', result)
              if (result.isCancelled) {
                reject(new Error('User cancalled'))
              } else {
                console.log('fb result', result)
                // get the access token
                const dataToken = await AccessToken.getCurrentAccessToken()
                if (dataToken && dataToken.accessToken) {
                  // create a new firebase credential with the token
                  const credential = firebase.auth.FacebookAuthProvider.credential(
                    dataToken.accessToken
                  )
                  // login with credential
                  await firebase
                    .auth()
                    .signInWithCredential(credential)
                    .then(currentUser => {
                      console.log('debugging fb currentUser', currentUser)
                      if (currentUser) {
                        resolve(currentUser)
                      }
                    })
                    .catch(e => {
                      console.log('debugging e', e)
                      reject(e)
                    })
                } else {
                  reject(new Error('Invalid fb token cancalled'))
                }
              }
            })
            .catch(e => {
              console.log('debugging e', e)
              reject(e)
            })
        }, 3000)
      } catch (e) {
        console.log('debugging e', e)
        reject(e)
      }
    })
  }

  gqlLogin = (token, role) => {
    return new Promise((resolve, reject) => {
      try {
        const mutation = gql`
          ${gqlLogin}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              token,
              roleType: role,
              authenticateType: 'LOGIN',
              extra: null,
            },
          })
          .then(({data, errors}) => {
            console.log('debugging data', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (
              data &&
              data.authenticate &&
              data.authenticate.data &&
              data.authenticate.data.userId
            ) {
              resolve(data.authenticate.data)
            }
          })
          .catch(e => {
            reject(e)
            console.log('debugging gqlLogin err')
          })
      } catch (e) {
        reject(e)
        console.log('debugging gqlLogin err', e)
      }
    })
  }

  forgotPassword = email => {
    console.log('email', email)
    return new Promise((resolve, reject) => {
      try {
        firebase
          .auth()
          .sendPasswordResetEmail(email)
          .then(currentUser => {
            console.log('entered the action', currentUser)
            const user = JSON.stringify(currentUser)
            console.log('entered the action', user)

            resolve(true)
          })
          .catch(error => {
            console.log('console', error)
            reject(error)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  firebaseEmailLogin = (username, password) => {
    return new Promise((resolve, reject) => {
      try {
        firebase
          .auth()
          .signInWithEmailAndPassword(username, password)
          .then(currentUser => {
            if (currentUser && currentUser.user) {
              console.log('debugging firebaseEmailLogin currentUser', currentUser)
              resolve(currentUser.user)
            } else {
              reject(new Error('current user not found'))
              console.log('debugging firebaseEmailLogin error')
            }
          })
          .catch(e => {
            reject(e)
            console.log('debugging firebaseEmailLogin error')
          })
      } catch (e) {
        reject(e)
        console.log('debugging firebaseEmailLogin error')
      }
    })
  }

  getIdToken = async () => {
    return new Promise((resolve, reject) => {
      try {
        firebase
          .auth()
          .currentUser.getIdToken()
          .then(res => {
            resolve(res)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  gqlSwitchRole = ({email, switchFrom, switchTo}) => {
    return new Promise((resolve, reject) => {
      try {
        const mutation = gql`
          ${gqlSwitchRole}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              pEmail: email,
              pSwitchFrom: switchFrom,
              pSwitchTo: switchTo,
            },
          })
          .then(({data, errors}) => {
            console.log('gqlSwitchRole', errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data && data.switchUserByRole && data.switchUserByRole.json) {
              const res = JSON.parse(data.switchUserByRole.json)
              if (res && res.userId) {
                resolve(res)
              } else {
                reject(new Error('debugging gqlSwitchRole gql error'))
              }
            } else {
              reject(new Error('debugging gqlSwitchRole gql error'))
            }
          })
          .catch(e => {
            reject(e)
            console.log('debugging gqlSwitchRole err')
          })
      } catch (e) {
        reject(e)
        console.log('debugging gqlSwitchRole err', e)
      }
    })
  }
}

const instance = new LoginService()
export default instance
