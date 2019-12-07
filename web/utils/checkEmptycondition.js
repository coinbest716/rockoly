// Check string is empty or not
export const isStringEmpty = str => {
  if (str && str !== '' && str !== undefined && str !== null) {
    return true;
  } else {
    return false;
  }
};

// Check object is empty or not
export const isObjectEmpty = str => {
  if (str && str !== undefined && str !== null && Object.keys(str).length !== 0) {
    return true;
  } else {
    return false;
  }
};

// Check array is empty or not
export const isArrayEmpty = str => {
  if (str && str !== undefined && str !== null && str.length !== 0) {
    return true;
  } else {
    return false;
  }
};

// Check number is empty or not
export const isNumberEmpty = str => {
  if (str && str !== undefined && str !== null) {
    return true;
  } else {
    return false;
  }
};

// Check boolean is empty or not
export const isBooleanEmpty = str => {
  if (str && str !== undefined && str !== null && str === true) {
    return true;
  } else {
    return false;
  }
};

//hasOwnProperty for array
export const hasProperty = (data, value) => {
  if (data && data.hasOwnProperty(value)) {
    return true;
  } else {

    return false;
  }
};
