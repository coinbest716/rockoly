/** @format */

import Config from 'react-native-config'

export default {
  ...Config,
  LANGUAGE_CODE: 'en',
  PAGINATION: {
    CHEF_LIST: 50,
    FAV_LIST: 50,
    CHEF_PAYMENT_HISTORY: 50,
    CUSTOMER_PAYMENT_HISTORY: 50,
    SET_UNAVAILABLITY: 50,
    BOOKING_HISTORY: 50,
    NOTIFICATION: 50,
  },
  PAYMENT_METHOD_LIMIT: {
    CHEF: 3,
    CUSTOMER: 5,
  },
}
