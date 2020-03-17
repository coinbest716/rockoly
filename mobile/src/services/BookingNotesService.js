/** @format */
import gql from 'graphql-tag'
import BaseService from './BaseService'
import {GQL} from '@common'

export const BOOKING_NOTES = {
  BOOKING_NOTES_DETAIL: 'BOOKING_NOTES_DETAIL',
  BOOKING_NOTES_ADDED: 'BOOKING_NOTES_ADDED',
  CONVERSATION_LIST: 'CONVERSATION_LIST',
  CREATE_CHAT: 'CREATE_CHAT',
  BOOKING_NOTES_DETAIL_SUBS: 'BOOKING_NOTES_DETAIL_SUBS',
}

class BookingNotesService extends BaseService {
  fetchNotesSubscription = conversationId => {
    console.log('conversationId fetchNotesSubscription', conversationId)
    try {
      const gqlValue = GQL.subscription.chat.messsageHistoryGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .subscribe({
          query,
          variables: {
            conversationHistId: conversationId,
          },
        })
        .subscribe(
          res => {
            console.log('Listeninggg notes', res)
            this.emit(BOOKING_NOTES.BOOKING_NOTES_DETAIL_SUBS, {notesSubs: res})
          },
          e => {
            console.log(e)
          }
        )
    } catch (error) {
      console.log(error)
    }
  }

  getConversationList = async (entityId, first, offset) => {
    console.log('entityId', entityId)
    try {
      const gqlValue = GQL.query.chat.getConversationListGQLTAG
      const query = gql`
        ${gqlValue}
      `
      console.log('gqlValue', gqlValue)
      this.client
        .query({
          query,
          fetchPolicy: 'network-only',
          variables: {
            pEntityId: entityId,
            first,
            offset,
          },
        })
        .then(({data}) => {
          console.log('data getConversationList', data)
          if (
            data &&
            data.getConversationList &&
            data.getConversationList.nodes &&
            data.getConversationList.nodes.length
          ) {
            this.emit(BOOKING_NOTES.CONVERSATION_LIST, {
              conversationList: data.getConversationList.nodes,
            })
          } else {
            console.log('else')
            this.emit(BOOKING_NOTES.CONVERSATION_LIST, {conversationList: []})
          }
        })
        .catch(err => {
          console.log('catch', err)
          this.emit(BOOKING_NOTES.CONVERSATION_LIST, {conversationList: []})
        })
    } catch (e) {
      console.log('catchhhh', e)
      this.emit(BOOKING_NOTES.CONVERSATION_LIST, {conversationList: []})
    }
  }

  getBookingNotesDetail = async (conversationId, first, offset) => {
    try {
      const gqlValue = GQL.query.chat.conversationMessagesGQLTAG
      const query = gql`
        ${gqlValue}
      `
      this.client
        .query({
          query,
          variables: {
            conversationHistId: conversationId,
            first,
            offset,
          },
          fetchPolicy: 'network-only',
        })
        .then(({data}) => {
          console.log('data getBookingHistoryList', data)
          if (
            data &&
            data.allMessageHistories &&
            data.allMessageHistories.nodes &&
            data.allMessageHistories.nodes.length
          ) {
            this.emit(BOOKING_NOTES.BOOKING_NOTES_DETAIL, {
              bookingNotesDetail: data.allMessageHistories.nodes,
            })
          } else {
            this.emit(BOOKING_NOTES.BOOKING_NOTES_DETAIL, {bookingNotesDetail: []})
          }
        })
        .catch(() => {
          this.emit(BOOKING_NOTES.BOOKING_NOTES_DETAIL, {bookingNotesDetail: []})
        })
    } catch (e) {
      this.emit(BOOKING_NOTES.BOOKING_NOTES_DETAIL, {bookingNotesDetail: []})
    }
  }

  addBookingNotes = obj => {
    try {
      const gqlValue = GQL.mutation.chat.createMsgGQLTAG
      const mutation = gql`
        ${gqlValue}
      `
      this.client
        .mutate({
          mutation,
          variables: obj,
        })
        .then(({data}) => {
          console.log('data addBookingNotes', data)
          if (
            data &&
            data.createMessageHistory &&
            data.createMessageHistory.messageHistory &&
            Object(data.createMessageHistory.messageHistory).length !== 0
          ) {
            this.emit(BOOKING_NOTES.BOOKING_NOTES_ADDED, {
              newNotes: data.createMessageHistory.messageHistory,
            })
          } else {
            this.emit(BOOKING_NOTES.BOOKING_NOTES_ADDED, {newNotes: {}})
          }
        })
        .catch(error => {
          this.emit(BOOKING_NOTES.BOOKING_NOTES_ADDED, {newNotes: {}})
        })
    } catch (err) {
      this.emit(BOOKING_NOTES.BOOKING_NOTES_ADDED, {newNotes: {}})
    }
  }

  createChat = (chefId, customerId, message) => {
    console.log('checkChat', chefId, customerId, message)
    try {
      const gqlValue = GQL.mutation.chat.createConversationGQLTAG
      console.log('gqlValue', gqlValue)
      const mutation = gql`
        ${gqlValue}
      `

      this.client
        .mutate({
          mutation,
          variables: {
            pChefId: chefId,
            pCustomerId: customerId,
            pMsgText: message,
          },
        })
        .then(({data}) => {
          console.log('data addBookingNotes', data)
          if (
            data &&
            data.createConversationHistByParams &&
            data.createConversationHistByParams.conversationHistory &&
            data.createConversationHistByParams.conversationHistory.conversationHistId
          ) {
            this.emit(
              BOOKING_NOTES.CREATE_CHAT,
              data.createConversationHistByParams.conversationHistory.conversationHistId
            )
          } else {
            this.emit(BOOKING_NOTES.CREATE_CHAT, '')
          }
        })
        .catch(error => {
          console.log('error', error)
          this.emit(BOOKING_NOTES.CREATE_CHAT, '')
        })
    } catch (err) {
      console.log('err', err)
      this.emit(BOOKING_NOTES.CREATE_CHAT, '')
    }
  }
}

const instance = new BookingNotesService()
export default instance
