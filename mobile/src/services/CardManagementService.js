/** @format */
import gql from 'graphql-tag'
import {Toast} from 'native-base'
import {Alert} from 'react-native'
import BaseService from './BaseService'
import {GQL} from '@common'

export const CARD_MANAGEMENT_LIST_EVENT = {
  CARD_MANAGEMENT_LIST: 'CARD_MANAGEMENT/CARD_MANAGEMENT_LIST',
  NEW_CARD_ADDED: 'CARD_MANAGEMENT/NEW_CARD_ADDED',
}

class CardManagementService extends BaseService {
  constructor() {
    super()
    this.cardsList = []
  }

  getCardData = async (customerStripeId, limit) => {
    const gqlValue = GQL.query.stripe.customerCardsGQLTAG
    const query = gql`
      ${gqlValue}
    `
    this.client
      .query({
        query,
        variables: {
          customerId: customerStripeId,
          limit,
        },
        fetchPolicy: 'network-only',
      })
      .catch(e => {})
      .then(({data}) => {
        if (data === undefined) {
          console.log('error')
        } else if (data.code) {
          console.log('error')
        } else {
          this.cardsList = data
          this.emit(CARD_MANAGEMENT_LIST_EVENT.CARD_MANAGEMENT_LIST, {cardsList: data})
        }
      })
  }

  addCard = async cardInfo => {
    return new Promise((resolve, reject) => {
      const gqlValue = GQL.mutation.stripe.attachCardToCustomerTAG
      const mutation = gql`
        ${gqlValue}
      `
      try {
        this.client
          .mutate({
            mutation,
            variables: {
              email: cardInfo.email,
              customerId: cardInfo.customer,
              cardToken: cardInfo.tokenId,
            },
          })
          .then(({data}) => {
            console.log('data addCard', data)
            if (data === undefined) {
              console.log('error')
            } else if (data.code) {
              console.log('error')
            } else {
              Toast.show({
                text: 'Added Card Successfully',
                duration: 3000,
              })
              this.emit(CARD_MANAGEMENT_LIST_EVENT.NEW_CARD_ADDED)
              resolve(data)
            }
          })
          .catch(error => {
            console.log('catch', error)
          })
      } catch (err) {
        console.log('catch', err)
        Alert.alert('Info', JSON.stringify(err.message))
      }
    })
  }

  removeCard = async (customerId, cardId) => {
    return new Promise((resolve, reject) => {
      const gqlValue = GQL.mutation.stripe.removeCardGQLTAG
      const mutation = gql`
        ${gqlValue}
      `
      try {
        this.client
          .mutate({
            mutation,
            variables: {
              customerId,
              cardId,
            },
          })
          .then(({data}) => {
            console.log('data removeCard', data)
            if (data === undefined) {
              console.log('error')
            } else if (data.code) {
              console.log('error')
            } else {
              Toast.show({
                text: 'Remove Card Successfully',
                duration: 3000,
              })
              resolve(data)
            }
          })
          .catch(error => {
            console.log('catch', error)
          })
      } catch (err) {
        console.log('catch', err)
        Alert.alert('Info', JSON.stringify(err.message))
      }
    })
  }
}

const instance = new CardManagementService()
export default instance
