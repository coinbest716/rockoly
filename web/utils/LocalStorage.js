import { toastMessage } from './Toast';

// set value to local storage
export const StoreInLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

// get value from local storage
export const GetValueFromLocal = async key => {
  try {
    const value = await localStorage.getItem(key);
    if (value !== null) {
      // We have data!
      return JSON.parse(value);
    } else {
      return false;
    }
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};
