/** @format */

import gql from 'graphql-tag'
import {Alert} from 'react-native'
import {Toast} from 'native-base'
import BaseService from './BaseService'
import {GQL} from '@common'

export const BOOKING_HISTORY_LIST_EVENT = {
  BOOKING_HISTORY_LIST: 'BOOKING_HISTORY/BOOKING_HISTORY_LIST',
  BOOKING_HISTORY_STATUS_UPDATED: 'BOOKING_HISTORY/BOOKING_HISTORY_STATUS_UPDATED',
  BOOKING_HISTORY_UPDATING: 'BOOKING_HISTORY_UPDATING',
}

class BookingHistoryService extends BaseService {
  constructor() {
    super()
    this.bookingHistory = []
    this.bookingStatusUpdated = {}
  }

  bookingSubsByCustomer = customerId => {
    try {
      const gqlValue = GQL.subscription.booking.byCustomerIdGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .subscribe({
          query,
          variables: {
            customerId,
          },
        })
        .subscribe(
          res => {
            this.bookingHistory = res
            this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_UPDATING, {bookingHistory: res})
          },
          e => {
            console.log(e)
          }
        )
    } catch (e) {
      console.log('error', e)
    }
  }

  bookingSubsByChef = chefId => {
    try {
      const gqlValue = GQL.subscription.booking.byChefIdGQLTAG
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
            this.bookingHistory = res
            this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_UPDATING, {bookingHistory: res})
          },
          e => {
            console.log(e)
          }
        )
    } catch (e) {
      console.log('error', e)
    }
  }

  checkAvailablity = ({chefId, fromTime, toTime, gmtFromTime, gmtToTime}) => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.query.booking.checkBookingByParamsGQLTAG
        const query = gql`
          ${gqlValue}
        `
        this.client
          .query({
            query,
            variables: {
              pChefId: chefId,
              pFromTime: fromTime,
              pToTime: toTime,
              pGmtFromTime: gmtFromTime,
              pGmtToTime: gmtToTime,
            },
            fetchPolicy: 'network-only',
          })
          .then(({data, errors}) => {
            console.log('checkAvailablity errors', errors)
            if (errors) {
              reject(errors[0].message)
            } else if (
              data &&
              data.checkBookingByParams &&
              data.checkBookingByParams.success === true
            ) {
              resolve(true)
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

  bookNow = inputData => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.booking.createGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: inputData,
          })
          .then(({data}) => {
            console.log('debugging data', data)
            if (
              data &&
              data.createBooking &&
              data.createBooking.data &&
              data.createBooking.data.chef_booking_hist_id
            ) {
              resolve(data.createBooking.data.chef_booking_hist_id)
            } else {
              reject(new Error('Booking failed'))
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

  getBookingHistoryList = async gqlValue => {
    console.log('getBookingHistoryList')

    try {
      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({
          query,
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('data getBookingHistoryList', data)
          if (
            data &&
            data.listBookingByDateRange &&
            data.listBookingByDateRange.nodes &&
            data.listBookingByDateRange.nodes.length
          ) {
            this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST, {
              bookingHistory: data.listBookingByDateRange.nodes,
            })
          } else {
            this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST, {bookingHistory: []})
          }
        })
        .catch(() => {
          this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST, {bookingHistory: []})
        })
    } catch (e) {
      this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_LIST, {bookingHistory: []})
    }
  }

  addNotes = obj => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.notes.createNotesGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: obj,
          })
          .then(({data}) => {
            console.log('data addNotes', data)
            if (data) {
              resolve(data)
            }
          })
          .catch(error => {
            console.log('catch', error)
            reject(error)
          })
      } catch (err) {
        console.log('catch', err)
        reject(err)
      }
    })
  }

  completeBooking = obj => {
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.booking.completeGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: obj,
          })
          .then(({data}) => {
            console.log('data completeBooking', data)
            if (data && data.bookingComplete) {
              this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED, {})
              resolve(data)
            }
          })
          .catch(error => {
            console.log('catch', error)
            reject(error)
          })
      } catch (err) {
        console.log('catch', err)
        reject(err)
      }
    })
  }

  updateBookingHistoryStatus = items => {
    console.log('updateBookingHistory', items)
    return new Promise((resolve, reject) => {
      try {
        const gqlValue = GQL.mutation.booking.updateGQLTAG
        const mutation = gql`
          ${gqlValue}
        `
        this.client
          .mutate({
            mutation,
            variables: {
              chefBookingHistId: items.bookingHistId,
              chefBookingStatusId: items.bookingStatusId,
              chefBookingCompletedByCustomerYn: items.bookingCompletedByCustomer,
              chefBookingCompletedByChefYn: items.bookingCompletedByChef,
              chefBookingChefRejectOrCancelReason: items.bookingChefRejectOrCancelReason,
              chefBookingCustomerRejectOrCancelReason: items.bookingCustomerRejectOrCancelReason,
            },
          })
          .then(({data, errors}) => {
            console.log('booking history status', data, errors)
            if (errors) {
              reject(errors[0].message)
            } else if (data && data.updateChefBookingHistoryByChefBookingHistId) {
              this.emit(BOOKING_HISTORY_LIST_EVENT.BOOKING_HISTORY_STATUS_UPDATED, {})
              resolve(data)
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

const instance = new BookingHistoryService()
export default instance
