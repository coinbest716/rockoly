/** @format */

import gql from 'graphql-tag'
import {Alert} from 'react-native'

import {Toast} from 'native-base'
import BaseService from './BaseService'
import {GQL} from '@common'

export const CUSTOMER_PREFERNCE_EVENT = {
  CUISINES: 'CUSTOMER_PREFERNCE/CUSINES',
  ALLERGY: 'CUSTOMER_PREFERNCE/ALLERGY',
  DIETRY: 'CUSTOMER_PREFERNCE/DIETRY',
  KITCHEN_EQUIPMENT: 'CUSTOMER_PREFERNCE/KITCHEN_EQUIPMENT',
}

class CustomerPreferenceService extends BaseService {
  constructor() {
    super()
    this.cuisineData = []
    this.allergyData = []
    this.dietryData = []
    this.kitchenEquipment = []
  }

  getCuisineData = async () => {
    console.log('getCuisineData')

    try {
      const gqlVal = GQL.query.master.allCuisinesByStatusGQLTAG
      const query = gql`
        ${gqlVal}
      `

      this.client
        .query({
          query,
          variables: {
            statusId: 'APPROVED',
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('data getCuisineData', data)
          if (
            data &&
            data.allCuisineTypeMasters &&
            data.allCuisineTypeMasters.nodes &&
            data.allCuisineTypeMasters.nodes.length
          ) {
            this.emit(CUSTOMER_PREFERNCE_EVENT.CUISINES, {
              cuisineData: data.allCuisineTypeMasters.nodes,
            })
          } else {
            this.emit(CUSTOMER_PREFERNCE_EVENT.CUISINES, {cuisineData: []})
          }
        })
        .catch(() => {
          this.emit(CUSTOMER_PREFERNCE_EVENT.CUISINES, {cuisineData: []})
        })
    } catch (e) {
      this.emit(CUSTOMER_PREFERNCE_EVENT.CUISINES, {cuisineData: []})
    }
  }

  getAllergyData = async () => {
    try {
      const gqlVal = GQL.query.master.allAllergyByStatusGQLTAG
      const query = gql`
        ${gqlVal}
      `

      this.client
        .query({
          query,
          variables: {
            statusId: 'APPROVED',
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('data getAllergyData', data)
          if (
            data &&
            data.allAllergyTypeMasters &&
            data.allAllergyTypeMasters.nodes &&
            data.allAllergyTypeMasters.nodes.length
          ) {
            this.emit(CUSTOMER_PREFERNCE_EVENT.ALLERGY, {
              allergyData: data.allAllergyTypeMasters.nodes,
            })
          } else {
            this.emit(CUSTOMER_PREFERNCE_EVENT.ALLERGY, {allergyData: []})
          }
        })
        .catch(() => {
          this.emit(CUSTOMER_PREFERNCE_EVENT.ALLERGY, {allergyData: []})
        })
    } catch (e) {
      this.emit(CUSTOMER_PREFERNCE_EVENT.ALLERGY, {allergyData: []})
    }
  }

  getDietryData = async () => {
    try {
      const gqlVal = GQL.query.master.allDietaryRestrictionsByStatusGQLTAG
      const query = gql`
        ${gqlVal}
      `

      this.client
        .query({
          query,
          variables: {
            statusId: 'APPROVED',
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('data getDietryData', data)
          if (
            data &&
            data.allDietaryRestrictionsTypeMasters &&
            data.allDietaryRestrictionsTypeMasters.nodes &&
            data.allDietaryRestrictionsTypeMasters.nodes.length
          ) {
            this.emit(CUSTOMER_PREFERNCE_EVENT.DIETRY, {
              dietryData: data.allDietaryRestrictionsTypeMasters.nodes,
            })
          } else {
            this.emit(CUSTOMER_PREFERNCE_EVENT.DIETRY, {dietryData: []})
          }
        })
        .catch(() => {
          this.emit(CUSTOMER_PREFERNCE_EVENT.DIETRY, {dietryData: []})
        })
    } catch (e) {
      this.emit(CUSTOMER_PREFERNCE_EVENT.DIETRY, {dietryData: []})
    }
  }

  getKitchenEquipmentData = async () => {
    try {
      const gqlVal = GQL.query.master.allKitchenEquipmentsByStatusGQLTAG
      const query = gql`
        ${gqlVal}
      `

      this.client
        .query({
          query,
          variables: {
            statusId: 'APPROVED',
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('data getKitchenEquipmentData', data)
          if (
            data &&
            data.allKitchenEquipmentTypeMasters &&
            data.allKitchenEquipmentTypeMasters.nodes &&
            data.allKitchenEquipmentTypeMasters.nodes.length
          ) {
            this.emit(CUSTOMER_PREFERNCE_EVENT.KITCHEN_EQUIPMENT, {
              kitchenEquipment: data.allKitchenEquipmentTypeMasters.nodes,
            })
          } else {
            this.emit(CUSTOMER_PREFERNCE_EVENT.KITCHEN_EQUIPMENT, {kitchenEquipment: []})
          }
        })
        .catch(() => {
          this.emit(CUSTOMER_PREFERNCE_EVENT.KITCHEN_EQUIPMENT, {kitchenEquipment: []})
        })
    } catch (e) {
      this.emit(CUSTOMER_PREFERNCE_EVENT.KITCHEN_EQUIPMENT, {kitchenEquipment: []})
    }
  }

  updatePreferencesData = inputData => {
    console.log('inputData', inputData)
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.customer.updatePreferencesGQLTAG
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
            console.log('updatePreferencesData data', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data && data.updateCustomerPreferenceProfileByCustomerPreferenceId) {
              resolve(data.updateCustomerPreferenceProfileByCustomerPreferenceId)
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

const instance = new CustomerPreferenceService()
export default instance
