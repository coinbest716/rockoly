/** @format */

import gql from 'graphql-tag'
import BaseService from './BaseService'
import {GQL} from '@common'

export const PAYMENT_HISTORY_EVENT = {
  CHEF_PAYMENT_HISTORY: 'CHEF_PAYMENT_HISTORY',
  CUSTOMER_PAYMENT_HISTORY: 'CUSTOMER_PAYMENT_HISTORY',
  UPDATING_PAYMENT_HISTORY: 'UPDATING_PAYMENT_HISTORY',
}

class ChefListService extends BaseService {
  constructor() {
    super()
    this.chefpaymentHistory = []
    this.customerPaymentHistory = []
  }

  chefPaymentSubs = chefId => {
    try {
      const gqlValue = GQL.subscription.payment.byChefIdGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .subscribe({
          query,
          variables: {
            chefId,
          },
        })
        .subscribe(
          res => {
            this.customerPaymentHistory = res
            this.emit(PAYMENT_HISTORY_EVENT.UPDATING_PAYMENT_HISTORY, {customerPaymentHistory: res})
            console.log('checking....')
          },
          e => {
            console.log(e)
          }
        )
    } catch (e) {
      console.log('error', e)
    }
  }

  getChefPaymentHistory = (chefId, first, offset) => {
    try {
      const gqlValue = GQL.query.payment.paymentByChefIdGQLTAG

      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({
          query,
          variables: {chefId, first, offset},
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          if (
            data &&
            data.allBankTransferHistories &&
            data.allBankTransferHistories.nodes &&
            data.allBankTransferHistories.nodes.length
          ) {
            this.emit(PAYMENT_HISTORY_EVENT.CHEF_PAYMENT_HISTORY, {
              newChefpaymentHistory: data.allBankTransferHistories.nodes,
            })
          } else {
            this.emit(PAYMENT_HISTORY_EVENT.CHEF_PAYMENT_HISTORY, {newChefpaymentHistory: []})
          }
        })
        .catch(e => {
          this.emit(PAYMENT_HISTORY_EVENT.CHEF_PAYMENT_HISTORY, {newChefpaymentHistory: []})
        })
    } catch (e) {
      this.emit(PAYMENT_HISTORY_EVENT.CHEF_PAYMENT_HISTORY, {newChefpaymentHistory: []})
    }
  }

  getCustomerPaymentHistory = async (customerId, first, offset) => {
    try {
      const gqlValue = GQL.query.payment.paymentByCustomerIdGQLTAG

      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({
          query,
          variables: {paymentDoneByCustomerId: customerId, first, offset},
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          if (
            data &&
            data.allPaymentHistories &&
            data.allPaymentHistories.nodes &&
            data.allPaymentHistories.nodes.length
          ) {
            this.emit(PAYMENT_HISTORY_EVENT.CUSTOMER_PAYMENT_HISTORY, {
              newCustomerPaymentHistory: data.allPaymentHistories.nodes,
            })
          } else {
            this.emit(PAYMENT_HISTORY_EVENT.CUSTOMER_PAYMENT_HISTORY, {
              newCustomerPaymentHistory: [],
            })
          }
        })
        .catch(e => {
          this.emit(PAYMENT_HISTORY_EVENT.CUSTOMER_PAYMENT_HISTORY, {
            newCustomerPaymentHistory: [],
          })
        })
    } catch (e) {
      this.emit(PAYMENT_HISTORY_EVENT.CUSTOMER_PAYMENT_HISTORY, {newCustomerPaymentHistory: []})
    }
  }
}

const instance = new ChefListService()
export default instance
