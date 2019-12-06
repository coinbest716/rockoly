/** @format */
import moment from 'moment'

export const createdDate = params => {
  //let gmt = new Date(params + 'Z')
  try {
    let date = moment(moment.utc(params).local()).format('MM-DD-YYYY')
    return date
  } catch (e) {
    return null
  }
}

export const currentDate = () => {
  let date = moment(new Date()).format('MM-DD-YYYY')
  console.log('dsadjalksjdlakjsd123123', date)
  return date
}

export const BusinessDate = params => {
  try {
    let date = moment(moment.utc(params).local()).format('MM-DD-YYYY')
    return date
  } catch (e) {
    return null
  }
}

//Pass 'week' or 'month' as params
export const getStartEndTime = val => {
  let from_date = moment().startOf(val)
  let from_date_format = moment(from_date).format('YYYY-MM-DD hh:mm:ss')
  let to_date = moment().endOf(val)
  let to_date_format = moment(to_date).format('YYYY-MM-DD hh:mm:ss')
  let obj = {
    start_time: from_date_format,
    end_time: to_date_format,
  }
  return obj
}
