/** @format */
import {message} from 'antd'

export const StoreInLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    message.error(error.message)
  }
}
// get value from local storage
export const GetValueFromLocal = async key => {
  try {
    const value = await localStorage.getItem(key)
    if (value !== null) {
      // We have data!
      return JSON.parse(value)
    } else {
      return false
    }
  } catch (error) {
    message.error(error.message)
  }
}
