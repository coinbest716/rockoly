/** @format */
import firebase from 'react-native-firebase'
import gql from 'graphql-tag'
import {GQL, CONSTANTS} from '@common'
import BaseService from './BaseService'

const gqlRegister = GQL.mutation.auth.authtenticateGQLTAG
const gglChefBasicProfile = GQL.mutation.chef.updateBasicInfoGQLTag
const gqlCustomerBasicProfile = GQL.mutation.customer.updateBasicInfoGQLTag
const gqlCheckEmailAndMobileNoExists = GQL.query.auth.checkEmailAndMobileNoExistsGQLTAG

export const REGISTER_SERVICE_EVENT = {
  EMAIL_REGISTER: 'REGISTER/EMAIL_REGISTER',
}

class RegisterService extends BaseService {
  constructor() {
    super()
    this.currentUser = {}
  }

  checkEmailAndMobileNoExists = (email, mobileNumber) => {
    return new Promise((resolve, reject) => {
      try {
        const query = gql`
          ${gqlCheckEmailAndMobileNoExists}
        `
        this.client
          .query({
            query,
            variables: {
              pEmail: email,
              pMobileNo: mobileNumber,
            },
            fetchPolicy: 'network-only',
          })
          .then(({data, errors}) => {
            console.log('checkEmailAndMobileNoExists errors', errors)
            if (errors) {
              reject(errors[0].message)
            } else if (
              data &&
              data.checkEmailAndMobileNoExists &&
              data.checkEmailAndMobileNoExists.success === true
            ) {
              resolve(true)
            } else {
              reject(new Error('GraphQL error: EMAIL_AND_MOBILE_NO_IS_ALREADY_EXISTS'))
            }
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  saveBasicDetails = ({isChef, firstName, lastName, mobileNumber, callingCode}, currentUser) => {
    return new Promise((resolve, reject) => {
      try {
        let gqlSaveProfile = ``
        let obj = {}
        if (isChef && currentUser) {
          gqlSaveProfile = gglChefBasicProfile
          obj = {
            chefId: currentUser.chefId,
          }
          if (firstName) {
            obj.chefFirstName = firstName
          }
          if (lastName) {
            obj.chefLastName = lastName
          }
          if (mobileNumber) {
            obj.chefMobileNumber = mobileNumber
          }
          if (callingCode) {
            obj.chefMobileCountryCode = callingCode
          }

          // chefDob: dateOfBirth,
        } else if (currentUser) {
          gqlSaveProfile = gqlCustomerBasicProfile
          obj = {
            customerId: currentUser.customerId,
          }
          if (firstName) {
            obj.customerFirstName = firstName
          }
          if (lastName) {
            obj.customerLastName = lastName
          }
          if (mobileNumber) {
            obj.customerMobileNumber = mobileNumber
          }
          if (callingCode) {
            obj.customerMobileCountryCode = callingCode
          }
          // customerDob: dateOfBirth,
        } else {
          reject(new Error('user id not found'))
        }
        const mutation = gql`
          ${gqlSaveProfile}
        `

        console.log('debugging obj', gqlSaveProfile, obj)
        this.client
          .mutate({
            mutation,
            variables: obj,
          })
          .then(({data}) => {
            console.log('debugging saveBasicDetails success', data)
            if (
              isChef &&
              data &&
              data.updateChefProfileByChefId &&
              data.updateChefProfileByChefId.chefProfile
            ) {
              //
              resolve(true)
            } else if (
              data &&
              data.updateCustomerProfileByCustomerId &&
              data.updateCustomerProfileByCustomerId.customerProfile
            ) {
              //
              resolve(true)
            }
          })
          .catch(e => {
            console.log('debugging saveBasicDetails error', e)
            reject(e)
          })
      } catch (e) {
        console.log('debugging saveBasicDetails error', e)
        reject(e)
      }
    })
  }

  firebaseEmailRegister = (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(currentUser => {
            console.log('debugging firebaseEmailRegister currentUser', currentUser)
            if (currentUser && currentUser.user) {
              resolve(currentUser)
            } else {
              reject(new Error('current user not found'))
              console.log('debugging firebaseEmailRegister error')
            }
          })
          .catch(e => {
            console.log('ERROR: firebase email register error', e)
            reject(e)
            console.log('debugging firebaseEmailRegister error')
          })
      } catch (e) {
        reject(e)
        console.log('debugging firebaseEmailRegister error')
      }
    })
  }

  gqlRegister = (token, role, userData) => {
    return new Promise((resolve, reject) => {
      try {
        const mutation = gql`
          ${gqlRegister}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              token,
              roleType: role,
              authenticateType: 'REGISTER',
              extra: JSON.stringify(userData),
            },
          })
          .then(({data}) => {
            if (
              data &&
              data.authenticate &&
              data.authenticate.data &&
              data.authenticate.data.userId
            ) {
              resolve(data.authenticate.data)
            } else {
              reject(new Error('register gql error'))
            }
          })
          .catch(e => {
            console.log('register gqlRegister err', e)
            reject(e)
          })
      } catch (e) {
        console.log('register gqlRegister err', e)
        reject(e)
      }
    })
  }
}

const instance = new RegisterService()
export default instance
