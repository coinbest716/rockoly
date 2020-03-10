/** @format */
import gql from 'graphql-tag'
import BaseService from './BaseService'
import {GQL, CONSTANTS} from '@common'

export const PRICE_EVENT = {
  STORE: 'PRICE_EVENT/STORE',
}

class PriceCalculationService extends BaseService {
  constructor() {
    super()
    this.storeData = []
  }

  getStoreData = async () => {
    try {
      const gqlVal = GQL.query.master.storeTypeGQLTAG
      const query = gql`
        ${gqlVal}
      `

      this.client
        .query({
          query,
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('data getStoreData', data)
          if (
            data &&
            data.allStoreTypeMasters &&
            data.allStoreTypeMasters.nodes &&
            data.allStoreTypeMasters.nodes.length
          ) {
            this.emit(PRICE_EVENT.STORE, {
              storeData: data.allStoreTypeMasters.nodes,
            })
          } else {
            this.emit(PRICE_EVENT.STORE, {storeData: []})
          }
        })
        .catch(() => {
          this.emit(PRICE_EVENT.STORE, {storeData: []})
        })
    } catch (e) {
      this.emit(PRICE_EVENT.STORE, {storeData: []})
    }
  }

  requestAmountByChef = items => {
    console.log('requestAmountByChef', items)
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.booking.createRequestGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: items,
          })
          .then(({data, errors}) => {
            console.log('requestAmount', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data && data.createChefBookingRequestHistory) {
              // this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED, {})
              resolve(data.createChefBookingRequestHistory)
            }
          })
          .catch(error => {
            console.log('error', error)
            reject(error)
          })
      } catch (err) {
        console.log('err', err)
        reject(err)
      }
    })
  }

  accpetChefRequestPayment = items => {
    console.log('accpetChefRequestPayment', JSON.stringify(items))
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.booking.acceptChefRequestGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              pData: JSON.stringify(items),
            },
          })
          .then(({data, errors}) => {
            console.log('accpetChefRequestPayment data', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data && data.customerAcceptChefBookingRequestedChanges) {
              resolve(data.customerAcceptChefBookingRequestedChanges)
            }
          })
          .catch(error => {
            console.log('error', error)
            reject(error)
          })
      } catch (err) {
        console.log('err', err)
        reject(err)
      }
    })
  }

  makePaymentByCustomer = items => {
    console.log('makePaymentByCustomer', items)
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.booking.paymentGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: items,
          })
          .then(({data, errors}) => {
            console.log('makePaymentByCustomer data', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data && data.bookingPaymentTest) {
              resolve(data.bookingPaymentTest)
            }
          })
          .catch(error => {
            console.log('error', error)
            reject(error)
          })
      } catch (err) {
        console.log('err', err)
        reject(err)
      }
    })
  }
}

const instance = new PriceCalculationService()
export default instance
