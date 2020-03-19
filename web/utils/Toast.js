import { toast } from 'react-toastify';
import Router from 'next/router';

import errorCodes from './ErrorMessageString';
import * as util from './checkEmptycondition';
import { logOutUser } from './LogOut';

const toastStyles = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  autoClose: true,
  toastId: null,
  closeButton: false,
};

const errorToastStyle = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  toastId: null,
  closeButton: false,
};

export const success = 'success';
export const error = 'error';
export const renderError = 'renderError';

export function toastMessage(type, Message) {
  if (Message) {
    // To prevent duplicate toast to open at same time
    toast.dismiss();

    let toastMessage = null;
    let messageString = null;

    // if error message
    // if in object format
    if (typeof Message === 'object' && util.hasProperty(Message, 'message')) {
      messageString = Message.message;
    }
    // if in string format
    else if (typeof Message === 'string') {
      messageString = Message;
    }

    // // Format the message
    if (messageString) {
      if (messageString.indexOf('STATUS_ID_REQUIRED') >= 0) {
        toastMessage = errorCodes.STATUS_ID_REQUIRED;
      } else if (messageString.indexOf('CHEF_ID_REQUIRED') >= 0) {
        toastMessage = errorCodes.CHEF_ID_REQUIRED;
      } else if (
        messageString.indexOf('FROM_TIME_IS_REQUIRED') >= 0 ||
        messageString.indexOf('GMT_FROM_TIME_IS_REQUIRED') >= 0 ||
        messageString.indexOf('FROM_TIME_REQUIRED') >= 0
      ) {
        toastMessage = errorCodes.FROM_TIME_IS_REQUIRED;
      } else if (
        messageString.indexOf('TO_TIME_REQUIRED') >= 0 ||
        messageString.indexOf('GMT_TO_TIME_IS_REQUIRED') >= 0 ||
        messageString.indexOf('TO_TIME_REQUIRED') >= 0
      ) {
        toastMessage = errorCodes.TO_TIME_REQUIRED;
      } else if (messageString.indexOf('CHEF_NOT_AVAILABLE_ON_THIS_DATE') >= 0) {
        toastMessage = errorCodes.CHEF_NOT_AVAILABLE_ON_THIS_DATE;
      } else if (messageString.indexOf('CHEF_NOT_AVAILABLE_ON_THIS_TIME') >= 0) {
        toastMessage = errorCodes.CHEF_NOT_AVAILABLE_ON_THIS_TIME;
      } else if (messageString.indexOf('CHEF_HAS_BOOKING_ON_THIS_DATETIME') >= 0) {
        toastMessage = errorCodes.CHEF_HAS_BOOKING_ON_THIS_DATETIME;
      } else if (messageString.indexOf('CHEF_AS_NOT_SET_PRICE') >= 0) {
        toastMessage = errorCodes.CHEF_AS_NOT_SET_PRICE;
      } else if (messageString.indexOf('MOBILE_NO_IS_REQUIRED') >= 0) {
        toastMessage = errorCodes.MOBILE_NO_IS_REQUIRED;
      } else if (
        messageString.indexOf('EMAIL_IS_REQUIRED') >= 0 ||
        messageString.indexOf('EMAIL_ID_IS_REQUIRED') >= 0
      ) {
        toastMessage = errorCodes.EMAIL_IS_REQUIRED;
      } else if (messageString.indexOf('EMAIL_IS_ALREADY_EXISTS') >= 0) {
        toastMessage = errorCodes.EMAIL_IS_ALREADY_EXISTS;
      } else if (messageString.indexOf('MOBILE_NO_IS_ALREADY_EXISTS') >= 0) {
        toastMessage = errorCodes.MOBILE_NO_IS_ALREADY_EXISTS;
      } else if (messageString.indexOf('EMAIL_AND_MOBILE_NO_IS_ALREADY_EXISTS') >= 0) {
        toastMessage = errorCodes.EMAIL_AND_MOBILE_NO_IS_ALREADY_EXISTS;
      } else if (messageString.indexOf('NO_RECORDS_FOUND') >= 0) {
        toastMessage = errorCodes.NO_RECORDS_FOUND;
      } else if (
        messageString.indexOf('TYPE_REQUIRED') >= 0 ||
        messageString.indexOf('TYPE_IS_REQUIRED') >= 0
      ) {
        toastMessage = errorCodes.TYPE_REQUIRED;
      } else if (messageString.indexOf('INVALID_TYPE') >= 0) {
        toastMessage = errorCodes.INVALID_TYPE;
      } else if (messageString.indexOf('ENTITY_ID_IS_REQUIRED') >= 0) {
        toastMessage = errorCodes.ENTITY_ID_IS_REQUIRED;
      } else if (messageString.indexOf('DEVICE_TOKEN_IS_REQUIRED') >= 0) {
        toastMessage = errorCodes.DEVICE_TOKEN_IS_REQUIRED;
      } else if (messageString.indexOf('SWITCH_FROM_IS_REQUIRED') >= 0) {
        toastMessage = errorCodes.SWITCH_FROM_IS_REQUIRED;
      } else if (messageString.indexOf('SWITCH_TO_IS_REQUIRED') >= 0) {
        toastMessage = errorCodes.SWITCH_TO_IS_REQUIRED;
      } else if (messageString.indexOf('AVAILABILITY_DATA_IS_REQUIRED') >= 0) {
        toastMessage = errorCodes.AVAILABILITY_DATA_IS_REQUIRED;
      } else if (messageString.indexOf('DATE_IS_REQUIRED') >= 0) {
        toastMessage = errorCodes.DATE_IS_REQUIRED;
      } else if (messageString.indexOf('USER_IS_BLOCKED') >= 0) {
        toastStyles.toastId = 'USER_IS_BLOCKED';
        toastMessage = errorCodes.USER_IS_BLOCKED;
      } else if (messageString.indexOf('UNAUTHORIZED') >= 0) {
        toastMessage = errorCodes.UNAUTHORIZED;
      } else if (
        messageString.indexOf('customer_profile_customer_mobile_number_uindex') >= 0 ||
        messageString.indexOf('user_profile_user_mobile_number_uindex') >= 0
      ) {
        toastMessage = errorCodes.MOBILE_NO_IS_ALREADY_EXISTS;
      } else if (messageString.indexOf('AGE_LIMIT') >= 0) {
        toastMessage = errorCodes.AGE_LIMIT;
      } else if (messageString.indexOf('ALREADY_BOOKING_EXISTS_ON_THIS_DATETIME') >= 0) {
        toastMessage = errorCodes.ALREADY_BOOKING_EXISTS_ON_THIS_DATETIME;
      } else {
        toastMessage = messageString;
      }
    }

    if (type !== 'success' && messageString === null && toastMessage === null) {
      toastMessage = errorCodes.DEFAULT_MESSAGE;
    }

    if (toastMessage === 'Network error: Failed to fetch') {
      toastStyles.toastId = 'NETWORK_ERROR';
    }

    // show toast if not for blocked/networkError
    if (
      toastStyles.toastId === null ||
      (toastStyles.toastId !== 'USER_IS_BLOCKED' && toastStyles.toastId !== 'NETWORK_ERROR')
    ) {
      toastStyles.toastId = toastMessage;

      if (!toast.isActive(toastMessage)) {
        switch (type) {
          case 'success':
            toast.success(toastMessage, toastStyles);
            break;
          case 'error':
            toast.error(toastMessage, errorToastStyle);
            break;
          case 'renderError':
            toast.error(toastMessage, errorToastStyle);
            break;
        }
      }
    } else {
      // check if toast is shown already for blocked type
      if (!toast.isActive('USER_IS_BLOCKED') && toastStyles.toastId === 'USER_IS_BLOCKED') {
        toast.error(toastMessage, toastStyles);
        toastStyles.toastId = null;
        logOutUser();
      }

      // check if toast is shown already for blocked type
      if (!toast.isActive('NETWORK_ERROR') && toastStyles.toastId === 'NETWORK_ERROR') {
        toast.error('Please try again later', toastStyles);
        toastStyles.toastId = null;
      }
    }
  }
}
