/** @format */

import gql from 'graphql-tag'
import BaseService from './BaseService'
import {GQL} from '@common'

export const BOOKING_DETAIL_EVENT = {
  BOOKING_DETAIL: 'BOOKING/BOOKING_DETAIL',
  BOOKING_DETAIL_SUBS: 'BOOKING/BOOKING_DETAIL_SUBS',
  REQUEST_BOOKING_DETAIL: 'BOOKING/REQUEST_BOOKING_DETAIL',
}

class BookingDetailService extends BaseService {
  getBookingDetail = async bookingHistId => {
    try {
      const gqlValue = GQL.query.booking.byIdGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({
          query,
          variables: {
            chefBookingHistId: bookingHistId,
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          if (data && data.chefBookingHistoryByChefBookingHistId) {
            this.emit(BOOKING_DETAIL_EVENT.BOOKING_DETAIL, {
              bookingDetail: data.chefBookingHistoryByChefBookingHistId,
            })
          } else {
            this.emit(BOOKING_DETAIL_EVENT.BOOKING_DETAIL, {bookingDetail: {}})
          }
        })
        .catch(e => {
          console.log('ERROR getBookingDetail', e)
          this.emit(BOOKING_DETAIL_EVENT.BOOKING_DETAIL, {bookingDetail: {}})
        })
    } catch (e) {
      console.log('ERROR getBookingDetail', e)
      this.emit(BOOKING_DETAIL_EVENT.BOOKING_DETAIL, {bookingDetail: {}})
    }
  }

  getRequestBookingDetail = async bookingHistId => {
    try {
      const gqlValue = GQL.query.booking.requestedBookingByIdGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({
          query,
          variables: {
            bookingHistId,
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          if (
            data &&
            data.allChefBookingRequestHistories &&
            data.allChefBookingRequestHistories.nodes
          ) {
            this.emit(BOOKING_DETAIL_EVENT.REQUEST_BOOKING_DETAIL, {
              requestBookingDetail: data.allChefBookingRequestHistories.nodes,
            })
          } else {
            this.emit(BOOKING_DETAIL_EVENT.REQUEST_BOOKING_DETAIL, {requestBookingDetail: {}})
          }
        })
        .catch(e => {
          console.log('ERROR getBookingDetail', e)
          this.emit(BOOKING_DETAIL_EVENT.REQUEST_BOOKING_DETAIL, {requestBookingDetail: {}})
        })
    } catch (e) {
      console.log('ERROR getBookingDetail', e)
      this.emit(BOOKING_DETAIL_EVENT.REQUEST_BOOKING_DETAIL, {requestBookingDetail: {}})
    }
  }

  getBookingDetailSubs = async bookingHistId => {
    try {
      const gqlValue = GQL.subscription.booking.chefBookingHistoryGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .subscribe({
          query,
          variables: {
            chefBookingHistId: bookingHistId,
          },
        })
        .subscribe(
          res => {
            this.emit(BOOKING_DETAIL_EVENT.BOOKING_DETAIL_SUBS, {bookingDetailSubs: res})
          },
          e => {
            console.log(e)
          }
        )
    } catch (e) {
      this.emit(BOOKING_DETAIL_EVENT.BOOKING_DETAIL_SUBS, {bookingDetailSubs: {}})
    }
  }
}

const instance = new BookingDetailService()
export default instance
