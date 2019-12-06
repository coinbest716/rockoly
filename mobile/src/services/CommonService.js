/** @format */
import gql from 'graphql-tag'
import BaseService from './BaseService'
import {GQL} from '@common'

export const COMMON_LIST_NAME = {
  CHEF_LIST: 'CHEF_LIST',
  CHEF_NOTIFICATION: 'CHEF_NOTIFICATION',
  CUSTOMER_NOTIFICATION: 'CUSTOMER_NOTIFICATION',
  CHEF_PAYMENTS: 'CHEF_PAYMENTS',
  CUSTOMER_PAYMENTS: 'CUSTOMER_PAYMENTS',
  CUSTOMER_FOLLOW_CHEF: 'CUSTOMER_FOLLOW_CHEF',
  CHEF_BOOKING: 'CHEF_BOOKING',
  CUSTOMER_BOOKING: 'CUSTOMER_BOOKING',
  CHEF_NOT_AVAILABILITY: 'CHEF_NOT_AVAILABILITY',
  CONVERSATIONS: 'CONVERSATIONS',
  CONVERSATION_MESSAGES: 'CONVERSATION_MESSAGES',
  CHEF_UNREAD_COUNT: 'CHEF_UNREAD_COUNT',
  CUSTOMER_UNREAD_COUNT: 'CUSTOMER_UNREAD_COUNT',
}

class CommonService extends BaseService {
  constructor() {
    super()
    this.totalCount = {}
  }

  getTotalCount = (type, params) => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.query.custom.totalCountGQLTAG

        const query = gql`
          ${gqlValue}
        `
        this.client
          .query({
            query,
            fetchPolicy: 'network-only',
            variables: {
              pData: JSON.stringify({
                type,
                ...params,
              }),
            },
          })
          .then(({data}) => {
            if (data && data.totalCountByParams) {
              resolve(data.totalCountByParams)
            } else {
              resolve(0)
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

const instance = new CommonService()
export default instance
