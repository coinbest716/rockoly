/** @format */
import gql from 'graphql-tag'
import BaseService from './BaseService'
import {GQL} from '@common'

export const SETTING_KEY_NAME = {
  COMMISSION_KEY: 'BOOKING_SERVICE_CHARGE_IN_PERCENTAGE',
  BOOKING_CANCEL_KEY: 'NO_OF_MINUTES_FOR_BOOKING_CANCEL',
  STRIPE_SERVICE_CHARGE_IN_CENTS: 'STRIPE_SERVICE_CHARGE_IN_CENTS',
  STRIPE_SERVICE_CHARGE_IN_PERCENTAGE: 'STRIPE_SERVICE_CHARGE_IN_PERCENTAGE',
}
class SettingsService extends BaseService {
  constructor() {
    super()
    this.settings = {}
  }

  getSettings(keyName) {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.query.setting.getSettingValueGQLTAG
        const query = gql`
          ${gqlValue}
        `
        this.client
          .query({
            query,
            variables: {
              pSettingName: keyName,
            },
            fetchPolicy: 'network-only',
          })
          .then(({data}) => {
            if (data && data.getSettingValue) {
              if (keyName === SETTING_KEY_NAME.COMMISSION_KEY) {
                resolve(data.getSettingValue)
              } else if (keyName === SETTING_KEY_NAME.BOOKING_CANCEL_KEY) {
                resolve(data.getSettingValue)
              } else {
                resolve(data.getSettingValue)
              }
            } else {
              reject(new Error('Setting value not found'))
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

  getStripeCents() {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.query.setting.getSettingValueGQLTAG
        const query = gql`
          ${gqlValue}
        `
        this.client
          .query({
            query,
            variables: {
              pSettingName: SETTING_KEY_NAME.STRIPE_SERVICE_CHARGE_IN_CENTS,
            },
            fetchPolicy: 'network-only',
          })
          .then(({data}) => {
            if (data) {
              console.log('dtat', data)
              resolve(data.getSettingValue)
            } else {
              reject(new Error('Setting value not found'))
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

  getStripePercentage() {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.query.setting.getSettingValueGQLTAG
        const query = gql`
          ${gqlValue}
        `
        this.client
          .query({
            query,
            variables: {
              pSettingName: SETTING_KEY_NAME.COMMISSION_KEY,
            },
            fetchPolicy: 'network-only',
          })
          .then(({data}) => {
            if (data) {
              console.log('dtat', data)
              resolve(data.getSettingValue)
            } else {
              reject(new Error('Setting value not found'))
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
const instance = new SettingsService()
export default instance
