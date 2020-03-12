/** @format */

import gql from 'graphql-tag'
import {Alert} from 'react-native'

import {Toast} from 'native-base'
import BaseService from './BaseService'
import {GQL} from '@common'

export const CHEF_PREFERNCE_EVENT = {
  ADDITIONAL_SERVICES: 'CHEF_PREFERNCE_EVENT/ADDITIONAL_SERVICES',
  CERTIFICATE: 'CHEF_PREFERNCE_EVENT/CERTIFICATE',
}

class ChefPreferenceService extends BaseService {
  constructor() {
    super()
    this.certificateData = []
    this.additionalServiceData = []
  }

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
                text: 'Complexity saved.',
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
              // chefGratuity: params.chefGratuity,
              chefPricePerHour: params.chefPricePerHour,
              // noOfGuestsCanServe: params.noOfGuestsCanServe,
              noOfGuestsMax: params.noOfGuestsMax,
              noOfGuestsMin: params.noOfGuestsMin,
              // discount: params.discount,
              // personsCount: params.personsCount,
            },
          })
          .then(({data, errors}) => {
            console.log('updateRatePreferencesData', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data && data.updateChefProfileExtendedByChefProfileExtendedId) {
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
                text: 'Specialties / Experience details saved.',
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
                text: 'Chef Experience saved.',
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
                text: 'Service saved.',
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

  getAdditionalServices = async () => {
    try {
      const gqlVal = GQL.query.master.allAdditionalServiceTypeMastersGQLTAG
      const query = gql`
        ${gqlVal}
      `

      this.client
        .query({
          query,
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('data getAdditionalServices', data)
          if (
            data &&
            data.allAdditionalServiceTypeMasters &&
            data.allAdditionalServiceTypeMasters.nodes &&
            data.allAdditionalServiceTypeMasters.nodes.length
          ) {
            this.emit(CHEF_PREFERNCE_EVENT.ADDITIONAL_SERVICES, {
              additionalServiceData: data.allAdditionalServiceTypeMasters.nodes,
            })
          } else {
            this.emit(CHEF_PREFERNCE_EVENT.ADDITIONAL_SERVICES, {additionalServiceData: []})
          }
        })
        .catch(() => {
          this.emit(CHEF_PREFERNCE_EVENT.ADDITIONAL_SERVICES, {additionalServiceData: []})
        })
    } catch (e) {
      this.emit(CHEF_PREFERNCE_EVENT.ADDITIONAL_SERVICES, {additionalServiceData: []})
    }
  }

  getCertifications = async () => {
    try {
      const gqlVal = GQL.query.master.allCertificateTypeMastersGQLTAG
      const query = gql`
        ${gqlVal}
      `

      this.client
        .query({
          query,
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('data getCertifications', data)
          if (
            data &&
            data.allCertificateTypeMasters &&
            data.allCertificateTypeMasters.nodes &&
            data.allCertificateTypeMasters.nodes.length
          ) {
            this.emit(CHEF_PREFERNCE_EVENT.CERTIFICATE, {
              certificateData: data.allCertificateTypeMasters.nodes,
            })
          } else {
            this.emit(CHEF_PREFERNCE_EVENT.CERTIFICATE, {certificateData: []})
          }
        })
        .catch(() => {
          this.emit(CHEF_PREFERNCE_EVENT.CERTIFICATE, {certificateData: []})
        })
    } catch (e) {
      this.emit(CHEF_PREFERNCE_EVENT.CERTIFICATE, {certificateData: []})
    }
  }
}

const instance = new ChefPreferenceService()
export default instance
