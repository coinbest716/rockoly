/** @format */

import gql from 'graphql-tag'
import firebase from 'react-native-firebase'
import BaseService from './BaseService'
import {GQL, CONSTANTS} from '@common'

export const UPDATE_BASIC_PROFILE_EVENT = {
  UPDATE_CHEF_BASIC_PROFILE: 'UPDATE_CHEF_BASIC_PROFILE',
  UPDATE_CUSTOMER_BASIC_PROFILE: 'UPDATE_CUSTOMER_BASIC_PROFILE',
  GET_PROFILE_PIC_URL: 'GET_PROFILE_PIC_URL',
  GET_PROFILE_ATTACHMENTS: 'GET_PROFILE_ATTACHMENTS',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  UPDATING_DATA: 'UPDATING_DATA',
}
const storage = firebase.storage()
const storageRef = storage.ref()

class BasicProfileService extends BaseService {
  emitProfileEvent = () => {
    this.emit(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, true)
  }

  profileSubscriptionForCustomer = async customerId => {
    try {
      const gqlValue = GQL.subscription.customer.profileGQLTAG
      const query = gql`
        ${gqlValue}
      `
      const subs = this.client.subscribe({
        query,
        variables: {
          customerId,
        },
      })
      subs.subscribe(
        () => {
          this.emit(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, true)
        },
        e => {
          console.log('ERROR: profileSubscriptionForCustomer', e)
        }
      )
      return subs
    } catch (e) {
      console.log('ERROR: profileSubscriptionForCustomer', e)
      return null
    }
  }

  profileSubscriptionForChef = async chefId => {
    try {
      const gqlValue = GQL.subscription.chef.ProfileGQLTAG
      const query = gql`
        ${gqlValue}
      `
      const subs = this.client.subscribe({
        query,
        variables: {
          chefId,
        },
      })
      subs.subscribe(
        () => {
          this.emit(UPDATE_BASIC_PROFILE_EVENT.UPDATING_DATA, true)
        },
        e => {
          console.log('ERROR: profileSubscriptionForChef', e)
        }
      )
      return subs
    } catch (e) {
      console.log('ERROR: profileSubscriptionForChef', e)
      return null
    }
  }

  updateChefProfile = values => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updateBasicInfoGQLTag
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              chefId: values.chefId,
              chefSalutation: values.chefSalutation,
              chefFirstName: values.chefFirstName,
              chefLastName: values.chefLastName,
              chefGender: values.chefGender,
              chefDob: values.chefDob,
              chefPicId: values.chefPicId,
            },
          })
          .then(({data}) => {
            if (
              data &&
              data.updateChefProfileByChefId &&
              data.updateChefProfileByChefId.chefProfile
            ) {
              resolve(true)
            } else {
              reject(new Error('ERROR: updateChefProfile'))
            }
          })
          .catch(e => {
            console.log('ERROR: updateChefProfile', e)
            reject(e)
          })
      } catch (e) {
        console.log('ERROR: updateChefProfile', e)
        reject(e)
      }
    })
  }

  updateCustomerProfile = async values => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.customer.updateBasicInfoGQLTag
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              customerId: values.customerId,
              customerSalutation: values.customerSalutation,
              customerFirstName: values.customerFirstName,
              customerLastName: values.customerLastName,
              customerGender: values.customerGender,
              customerDob: values.customerDob,
              customerPicId: values.customerPicId,
            },
          })
          .then(({data}) => {
            if (
              data &&
              data.updateCustomerProfileByCustomerId &&
              data.updateCustomerProfileByCustomerId.customerProfile
            ) {
              resolve(true)
            } else {
              reject(new Error('ERROR: updateCustomerProfile'))
            }
          })
          .catch(e => {
            console.log('ERROR: updateCustomerProfile', e)
            reject(e)
          })
      } catch (e) {
        console.log('ERROR: updateCustomerProfile', e)
        reject(e)
      }
    })
  }

  saveImage = async (userId, imageInfo) => {
    try {
      let value = {}
      const dateTime = new Date().getTime()
      const randNo = Math.floor(Math.random() * 9000000000) + 1000000000
      const unsubscribe = storageRef
        .child(`${userId}/PROFILE_PICTURE/${dateTime}_${randNo}`)
        .putFile(imageInfo.uri, {contentType: imageInfo.mime})
        .on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          res => {
            if (res.bytesTransferred > 0) {
              const progress = (res.totalBytes / res.bytesTransferred) * 100
              console.log('Uploading progress', ' ', Math.round(progress), new Date())
            } else {
              console.log('Uploading no bytes transferred')
            }
            if (res.state === firebase.storage.TaskState.SUCCESS) {
              console.log('Uploading image completed', new Date())
              unsubscribe()
              value = {
                pAttachmentUrl: res.downloadURL,
                pAttachmentType: 'IMAGE',
              }
              this.emit(UPDATE_BASIC_PROFILE_EVENT.GET_PROFILE_PIC_URL, {image: value})
            }
          },
          () => {
            unsubscribe()
            this.emit(UPDATE_BASIC_PROFILE_EVENT.GET_PROFILE_PIC_URL, {image: null})
          }
        )
    } catch (e) {
      this.emit(UPDATE_BASIC_PROFILE_EVENT.GET_PROFILE_PIC_URL, {image: null})
    }
  }

  updateProfilePic = (isChef, id, picId) => {
    return new Promise((resolve, reject) => {
      try {
        let gqlValue = ``
        const variables = {}
        if (isChef) {
          gqlValue = GQL.mutation.chef.updateChefProfilePicGQLTAG
          variables.chefId = id
          variables.chefPicId = picId
        } else {
          gqlValue = GQL.mutation.customer.updateCustomerProfilePicGQLTAG
          variables.customerId = id
          variables.customerPicId = picId
        }

        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables,
          })
          .then(({data}) => {
            if (data && isChef) {
              if (
                data &&
                data.updateChefProfileByChefId &&
                data.updateChefProfileByChefId.chefProfile
              ) {
                resolve(true)
              } else {
                reject(new Error('ERROR: updateProfilePic'))
              }
            } else if (data && !isChef) {
              if (
                data &&
                data.updateCustomerProfileByCustomerId &&
                data.updateCustomerProfileByCustomerId.customerProfile
              ) {
                resolve(true)
              } else {
                reject(new Error('ERROR: updateProfilePic'))
              }
            }
          })
          .catch(e => {
            console.log('ERROR: updateProfilePic', e)
            reject(e)
          })
      } catch (e) {
        console.log('ERROR: updateProfilePic', e)
        reject(e)
      }
    })
  }
}

const instance = new BasicProfileService()
export default instance
