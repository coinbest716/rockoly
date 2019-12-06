/** @format */
import EventEmitter from 'EventEmitter'
import ApolloClient from '../ApolloClient'

class BaseService {
  /**
   * Initiate the event emitter
   */
  constructor() {
    this.eventEmitter = new EventEmitter()
    this.client = ApolloClient()
  }

  getClient() {
    return this.client
  }

  /**
   * Adds the @listener function to the end of the listeners array
   * for the event named @eventName
   * Will ensure that only one time the listener added for the event
   *
   * @param {string} eventName
   * @param {function} listener
   */
  on(eventName, listener) {
    const emitter = this.getEventEmitter()
    if (!emitter) {
      return
    }
    this.off(eventName, listener)
    emitter.addListener(eventName, listener)
  }

  /**
   * Will temove the specified @listener from @eventname list
   *
   * @param {string} eventName
   * @param {function} listener
   */
  off(eventName, listener) {
    const emitter = this.getEventEmitter()
    if (!emitter) {
      return
    }
    emitter.removeListener(eventName, listener)
  }

  /**
   * Will emit the event on the evetn name with the @payload
   * and if its an error set the @error value
   *
   * @param {string} event
   * @param {object} payload
   * @param {boolean} error
   */
  emit(event, payload, error = false) {
    const emitter = this.getEventEmitter()
    if (!emitter) {
      return
    }
    emitter.emit(event, payload, error)
  }

  /**
   * Returns the event emitter
   * Used for testing purpose and avoid using this during development
   */
  getEventEmitter() {
    return this.eventEmitter
  }
}

export default BaseService
