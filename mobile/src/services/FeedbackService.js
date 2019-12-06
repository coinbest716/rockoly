/** @format */

import gql from 'graphql-tag'
import {Alert} from 'react-native'
import {Toast} from 'native-base'
import BaseService from './BaseService'
import {GQL} from '@common'
import {BOOKING_HISTORY_LIST_EVENT} from './BookingHistoryService'

export const FEEDBACK_EVENT = {
  FEEDBACK: 'FEEDBACK',
}

class FeedbackService extends BaseService {
  constructor() {
    super()
    this.feedback = {}
  }

  giveFeedback = items => {
    console.log('giveFeedback', items)
    return new Promise((resolve, reject) => {
      const gqlValue = GQL.mutation.review.createGQLTAG
      const mutation = gql`
        ${gqlValue}
      `
      console.log('giveFeedback query', mutation)
      try {
        this.client
          .mutate({
            mutation,
            variables: {
              reviewPoint: items.reviewPoint,
              reviewDesc: items.reviewDesc,
              reviewComplaintsDesc: items.reviewComplaintsDesc,
              chefId: items.chefId,
              customerId: items.customerId,
              isReviewedByChefYn: items.isReviewedByChefYn,
              isReviewedByCustomerYn: items.isReviewedByCustomerYn,
              reviewRefTablePkId: items.reviewRefTablePkId,
              reviewRefTableName: items.reviewRefTableName,
            },
          })
          .then(({data}) => {
            console.log('data giveFeedback', data)
            if (data === undefined) {
              console.log('error')
            } else if (data.code) {
              console.log('error')
            } else {
              Toast.show({
                text: 'Feedback Submitted Successfully',
                duration: 3000,
              })
              // this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED, {})
              this.emit(FEEDBACK_EVENT.FEEDBACK, {})
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

const instance = new FeedbackService()
export default instance
