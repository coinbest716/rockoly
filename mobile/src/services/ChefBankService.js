/** @format */
import gql from 'graphql-tag'
import {Alert} from 'react-native'
import {Toast} from 'native-base'
import BaseService from './BaseService'
import {GQL} from '@common'

export const CHEF_BANK = {
  CHEF_BANK_LIST: 'CHEF_BANK/CHEF_BANK_LIST',
  ADDED_NEW_BANK_DETAILS: 'ADDED_NEW_BANK_DETAILS',
  UPDATING_BANK_DETAILS: 'UPDATING_BANK_DETAILS',
}

class ChefBankService extends BaseService {
  constructor() {
    super()
    //
    this.bankdetails = {}
    this.bankList = []
  }

  chefBankSubs = chefId => {
    try {
      const gqlValue = GQL.subscription.chef.bankProfileGQLTAG
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
            this.bankList = res
            this.emit(CHEF_BANK.UPDATING_BANK_DETAILS, {bankList: res})
          },
          e => {
            console.log(e)
          }
        )
    } catch (e) {
      console.log('error', e)
    }
  }

  addBankDetails = ({chefId, token}) => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.chef.saveChefBankDetailsGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              chefId,
              token,
            },
          })
          .then(({data}) => {
            if (
              data &&
              data.saveChefBankDetails &&
              data.saveChefBankDetails.data &&
              data.saveChefBankDetails.data.chef_stripe_user_id
            ) {
              this.emit(CHEF_BANK.ADDED_NEW_BANK_DETAILS, true)
              resolve(true)
            } else {
              reject(new Error('Could not save bank details'))
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

  getBankList = async chefId => {
    console.log('getBankList', chefId)
    const gqlValue = GQL.query.stripe.accountDetailsByChefIdGQLTAG
    const query = gql`
      ${gqlValue}
    `
    console.log('getBankList query', gqlValue)
    try {
      const {data} = await this.client.query({
        query,
        variables: {chefId},
        fetchPolicy: 'network-only',
      })
      console.log('data getBankList', data)
      if (data === undefined) {
        console.log('error')
      } else if (data.code) {
        console.log('error')
      } else {
        this.bankList = data
        this.emit(CHEF_BANK.CHEF_BANK_LIST, {bankList: data})
      }
    } catch (err) {
      console.log('catch', err)
      Alert.alert('Info', JSON.stringify(err.message))
    }
  }

  removeBankCard = async (chefId, accountId) => {
    return new Promise((resolve, reject) => {
      const gqlValue = GQL.mutation.stripe.removeChefAccountGQLTAG
      const mutation = gql`
        ${gqlValue}
      `
      try {
        this.client
          .mutate({
            mutation,
            variables: {
              chefId,
              accountId,
            },
          })
          .then(({data}) => {
            console.log('data removeCard', data)
            if (data === undefined) {
              console.log('error')
            } else if (data.code) {
              console.log('error')
            } else {
              this.emit(CHEF_BANK.ADDED_NEW_BANK_DETAILS, true)
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

  setDefaultBank = (id, isDefaultYn) => {
    return new Promise((resolve, reject) => {
      const gqlValue = GQL.mutation.chef.updateDefaultBankProfileGQLTAG
      const mutation = gql`
        ${gqlValue}
      `
      try {
        this.client
          .mutate({
            mutation,
            variables: {
              chefBankProfileId: id,
              isDefaultYn,
            },
          })
          .then(({data}) => {
            if (data !== undefined && data !== null) {
              Toast.show({
                text: 'Set Default Bank Successfully',
                duration: 3000,
              })
              resolve(data)
            }
          })
      } catch (err) {
        Alert.alert('Info', JSON.stringify(err.message))
        reject(err)
      }
    })
  }
}

const instance = new ChefBankService()
export default instance
