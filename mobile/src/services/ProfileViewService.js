/** @format */

import gql from 'graphql-tag'
import {Alert} from 'react-native'
import BaseService from './BaseService'
import {GQL} from '@common'

export const PROFILE_VIEW_EVENT = {
  PROFILE_VIEW: 'PROFILE/PROFILE_VIEW',
}

const chefProfileQuery = GQL.query.chef.profileByIdGQLTAG
const customerProfileQuery = GQL.query.customer.profileByIdGQLTAG

class ProfileViewService extends BaseService {
  constructor() {
    super()
    this.profileDetails = {}
  }

  getProfile = currentUser => {
    return new Promise((resolve, reject) => {
      try {
        if (!currentUser) {
          reject(new Error('user empty'))
        }
        let isChef = false
        let gqlValue = ``
        let obj = {}
        if (currentUser.hasOwnProperty('chefId')) {
          isChef = true
          gqlValue = chefProfileQuery
          obj = {
            chefId: currentUser.chefId,
          }
        } else if (currentUser.hasOwnProperty('customerId')) {
          gqlValue = customerProfileQuery
          obj = {
            customerId: currentUser.customerId,
          }
        } else {
          reject(new Error('id empty'))
        }
        const query = gql`
          ${gqlValue}
        `
        this.client
          .query({
            query,
            variables: obj,
            fetchPolicy: 'network-only',
          })
          .then(({data}) => {
            if (isChef && data && data.chefProfileByChefId) {
              resolve(data.chefProfileByChefId)
            } else if (data && data.customerProfileByCustomerId) {
              resolve(data.customerProfileByCustomerId)
            } else {
              reject(new Error('empty res'))
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

  getProfileDetails = async chefIdData => {
    const gqlValue = GQL.query.chef.profileByIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    try {
      const {data} = await this.client.query({
        query,
        variables: {
          chefId: chefIdData,
        },
        fetchPolicy: 'network-only',
      })
      if (data === undefined) {
        console.log('error')
      } else if (data.code) {
        console.log('error')
      } else {
        this.profileDetails = data
        this.emit(PROFILE_VIEW_EVENT.PROFILE_VIEW, {profileDetails: data})
      }
    } catch (err) {
      console.log('catch', err)
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }
}

const instance = new ProfileViewService()
export default instance
