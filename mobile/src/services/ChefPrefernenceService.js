/** @format */

import gql from 'graphql-tag'
import {Alert} from 'react-native'

import {Toast} from 'native-base'
import BaseService from './BaseService'
import {GQL} from '@common'

export const CHEF_PREFERNCE_EVENT = {}

class ChefPreferenceService extends BaseService {
  updateComplexityPreferencesData = inputData => {
    console.log('inputData', inputData)
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updateComplexityGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        console.log('gqlValue', gqlValue)
        this.client
          .mutate({
            mutation,
            variables: inputData,
          })
          .then(({data, errors}) => {
            console.log('updateComplexityPreferencesData', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data && data.updateChefProfileExtendedByChefProfileExtendedId) {
              Toast.show({
                text: 'Complexity Updated Successfully',
                duration: 3000,
              })
              resolve(data.updateChefProfileExtendedByChefProfileExtendedId)
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

  updateRatePreferencesData = ({params}) => {
    console.log('data', params)
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updatePriceForBookingGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        console.log('gqlValue', gqlValue)
        this.client
          .mutate({
            mutation,
            variables: {
              chefProfileExtendedId: params.chefProfileExtendedId,
              chefGratuity: params.chefGratuity,
              chefPricePerHour: params.chefPricePerHour,
              noOfGuestsCanServe: params.noOfGuestsCanServe,
              noOfGuestsMax: params.noOfGuestsCanServe,
              noOfGuestsMin: params.noOfGuestsMin,
              discount: params.discount,
              personsCount: params.personsCount,
            },
          })
          .then(({data, errors}) => {
            console.log('updateRatePreferencesData', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data && data.updateChefProfileExtendedByChefProfileExtendedId) {
              Toast.show({
                text: 'Values Updated Successfully',
                duration: 3000,
              })
              resolve(data.updateChefProfileExtendedByChefProfileExtendedId)
            }
          })
          .catch(e => {
            reject(e)
          })
      } catch (e) {
        console.log('error', e)
        reject(e)
      }
    })
  }

  updateChefWorkData = inputData => {
    console.log('inputData', inputData)
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updateChefWorkDetailsGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        console.log('gqlValue', gqlValue)
        this.client
          .mutate({
            mutation,
            variables: inputData,
          })
          .then(({data, errors}) => {
            console.log('updateChefWorkData', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data) {
              Toast.show({
                text: 'Chef Work Details Updated Successfully',
                duration: 3000,
              })
              resolve(data)
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

  updateChefExperienceData = inputData => {
    console.log('inputData', inputData)
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updateChefExperienceDetailsGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        console.log('gqlValue', gqlValue)
        this.client
          .mutate({
            mutation,
            variables: inputData,
          })
          .then(({data, errors}) => {
            console.log('updateChefExperienceData', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data) {
              Toast.show({
                text: 'Chef Experience Details Updated Successfully',
                duration: 3000,
              })
              resolve(data)
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

  updateService = inputData => {
    console.log('inputData', inputData)
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.updateServiceGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        console.log('gqlValue', gqlValue)
        this.client
          .mutate({
            mutation,
            variables: inputData,
          })
          .then(({data, errors}) => {
            console.log('updateService', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data) {
              Toast.show({
                text: 'Service Details Updated Successfully',
                duration: 3000,
              })
              resolve(data)
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
}

const instance = new ChefPreferenceService()
export default instance
