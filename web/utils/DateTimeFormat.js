import moment from 'moment';
import { toastMessage, renderError } from './Toast';

//availability time picker default start time & end time
export const initialStartTime = '09:00';
export const initialEndTime = '09:30';
export const endTimeLimit = '20:00';
export const getCurrentDate = new Date();
export const timeFormat = 'hh:mm:ss';
export const timeFormatWith = 'hh:mm A';
export const hourOnly = 'HH';
export const minOnly = 'mm';
export const time24Format = 'HH:mm';
export const dateFormat = 'MM-DD-YYYY';
export const reverseDateFormat = 'YYYY-MM-DD';
export const dateWithTime = 'Do MMMM YYYY, h:mm a';
export const dateFormatAll = 'Do MMMM YYYY';
export const dateWithTimeFormat = 'MM-DD-YYYY HH:mm:ss';
export const dateWithAllFormat = 'YYYY-MM-DDTHH:mm:SS';
export const checkIfItIsFutureDate = 'MM/DD/YYYY';
export const month = 'month';
export const M = 'M';
export const timeOnly = 'h:mm a';
export const dateWithTime1 = 'MM-DD-YYYY h:mm a';
// export const checkIfItIsFutureDate = 'MM-DD-YYYY hh:mm';

// covert integer time to local time
export const convertIntegerToTime = value => {
  try {
    let result = new Date(value * 1000);
    return result.toUTCString();
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// concat date and time to get time
export const getTime = (date, time) => {
  try {
    return moment(date + ' ' + time).format(timeFormatWith);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// concat date and time to get time
export const getDate = (date, time) => {
  try {
    return moment(date + ' ' + time, dateWithTimeFormat).format(dateWithTimeFormat);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// concat date and time to get time
export const getIsoDate = (date, time) => {
  try {
    return moment(date + ' ' + time, dateWithTimeFormat).toISOString();
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get timestamp
export const getTimestamp = date => {
  try {
    return new Date(date);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get date format
export const getDateFormat = date => {
  try {
    return moment(date).format(dateFormat);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get date format
export const getDateWithTime = date => {
  try {
    return moment(date).format(dateWithTime1);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get date local format
export const getDateWithTimeLocal = date => {
  try {
    let localTime = getLocalTime(date);
    return moment(localTime).format(dateWithTime1);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get time format
export const getTimeOnly = date => {
  try {
    return moment(date).format(timeOnly);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get date format for gql query
export const getDateFormatGql = date => {
  try {
    return moment(date).format(dateWithTimeFormat);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// convert 12 hours foramt to 24 hours time format
export const convert12to24Format = date => {
  try {
    return moment(date, [timeFormatWith]).format(time24Format);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// convert 12 hours foramt to 24 hours time hours
export const convert12to24Hours = (date, type) => {
  try {
    if (type === 'Mins') {
      return moment(date, [timeFormatWith]).format(minOnly);
    } else if (type === 'Hours') {
      return moment(date, [timeFormatWith]).format(hourOnly);
    }
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

//getting Time format
export const checkFutureDate = key => {
  return moment(key).format(checkIfItIsFutureDate);
};

//getting Time format
export const convertDateandTime = key => {
  let localTime = getLocalTime(key);
  return moment(localTime).format(dateWithTime);
};

export const NotificationconvertDateandTime = key => {
  let localTime = getLocalTime(key);
  return moment(localTime).format('MM-DD-YYYY');
};

//getting date format
export const convertDate = key => {
  return moment(key).format(dateFormatAll);
};

// get 24 hours Format
export const getTimeFormat = date => {
  try {
    return moment(date).format(time24Format);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get Hours Format
export const getHourFormat = date => {
  try {
    return moment(date).format(hourOnly);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get current date
export const fromDate = () => {
  try {
    return moment().format(dateFormat);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

export const fromDateReversed = () => {
  try {
    return moment().format(reverseDateFormat);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get future date reverseDateFormat
export const futureMonth = () => {
  try {
    return moment()
      .add(3, M)
      .format(dateFormat);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};
export const futureMonthReversed = () => {
  try {
    return moment()
      .add(3, M)
      .format(reverseDateFormat);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};
// get last 2 month date
export const last2Month = () => {
  try {
    return moment()
      .subtract(2, M)
      .format(dateFormat);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get date, month, year
export const getDateMonthYear = date => {
  try {
    return moment(date, dateWithAllFormat);
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get current month start date and end date
export const getCurrentMonth = () => {
  try {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const startDate = moment([year, month - 1]);
    const endDate = moment(startDate).endOf('month');
    const fromDate = startDate.toDate();
    const toDate = endDate.toDate();
    // console.log('eeeeeeeeeeeeee', startDate, fromDate, getDateFormatGql(fromDate));
    let currentMonth = {
      fromDate: getDateFormatGql(fromDate),
      toDate: getDateFormatGql(toDate),
    };
    return currentMonth;
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get from and to date as gmt formate
export const getDataForGmt = (date, type) => {
  try {
    if (type === 'startDate') {
      const startDate = date + ' ' + '00:00:00';
      const fromDate = moment(startDate, dateWithTimeFormat).format();
      // console.log('sssssssssssssssssss', startDate, fromDate, new Date(fromDate));
      return getDateFormatGql(new Date(fromDate));
    } else if (type === 'endDate') {
      const endDate = date + ' ' + '23:59:59';
      const toDate = moment(endDate, dateWithTimeFormat).format();
      return getDateFormatGql(new Date(toDate));
    }
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

// get local time
export const getLocalTime = date => {
  try {
    return moment.utc(date).toDate();
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

//get fromnow time
export const fromNow = date => {
  try {
    return moment.utc(date).fromNow();
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};
