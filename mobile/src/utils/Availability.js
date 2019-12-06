/** @format */
import moment from 'moment'

export const AVAILABILITY_TYPE = {
  AVAILABLE: 'AVAILABLE',
  NOT_AVAILABLE: 'NOT_AVAILABLE',
}

export const DATE_TYPE = {
  DATE: 'DATE',
  TIME: 'TIME',
}

export const commonDateFormat = 'YYYY-MM-DD'
export const displayTimeFormat = 'hh:mm A'
export const dbTimeFormat = 'HH:mm:ss'
export const displayDateFormat = 'DD-MMM-YYYY'
export const dbDateFormat = 'YYYY-MM-DD HH:mm:ss'
export const displayDateTimeFormat = 'YYYY-MM-DD hh:mm A'
// const time = moment().format('hh:mm A')

const defaultFromTime = '10:00 AM'
const defaultToTime = '05:00 PM'
export const availabilityDaysDefault = [
  {
    title: 'MON',
    dow: 1,
    checked: false,
    fromTime: defaultFromTime,
    toTime: defaultToTime,
    isInvalid: false,
  },
  {
    title: 'TUE',
    dow: 2,
    checked: false,
    fromTime: defaultFromTime,
    toTime: defaultToTime,
    isInvalid: false,
  },
  {
    title: 'WED',
    dow: 3,
    checked: false,
    fromTime: defaultFromTime,
    toTime: defaultToTime,
    isInvalid: false,
  },
  {
    title: 'THU',
    dow: 4,
    checked: false,
    fromTime: defaultFromTime,
    toTime: defaultToTime,
    isInvalid: false,
  },
  {
    title: 'FRI',
    dow: 5,
    checked: false,
    fromTime: defaultFromTime,
    toTime: defaultToTime,
    isInvalid: false,
  },
  {
    title: 'SAT',
    dow: 6,
    checked: false,
    fromTime: defaultFromTime,
    toTime: defaultToTime,
    isInvalid: false,
  },
  {
    title: 'SUN',
    dow: 7,
    checked: false,
    fromTime: defaultFromTime,
    toTime: defaultToTime,
    isInvalid: false,
  },
]

export const GMTToLocal = (time, type) => {
  try {
    if (type === DATE_TYPE.DATE) {
      return moment(moment.utc(time).local()).format(displayDateFormat)
    }
    if (type === DATE_TYPE.TIME) {
      return moment(moment.utc(time).local()).format(displayTimeFormat)
    }
  } catch {
    return null
  }
}

export const LocalToGMT = time => {
  try {
    return moment(time).toISOString()
  } catch {
    return null
  }
}

export const fetchDate = bookingDate => {
  try {
    return moment(bookingDate).format(dbDateFormat)
  } catch {
    return null
  }
}
