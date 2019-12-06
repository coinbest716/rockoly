/** @format */
import moment from 'moment'

export const availabilityTime = params => {
  const date = moment(new Date()).format('YYYY-MM-DD')
  const time = moment(date + ' ' + params).format('hh:mmA')
  return time
}

export const bussinessTime = params => {
  try {
    const time = moment(moment.utc(params).local()).format('hh:mm A')
    return time
  } catch (e) {
    return null
  }
}
