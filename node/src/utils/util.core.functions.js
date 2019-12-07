import _ from 'lodash';

// convert String To CamelCase
export function convertStringToCamelCase(str) {
  let newStr = _.camelCase(str);
  return newStr;
}

// convert object keys to camelCase
export function convertObjectKeysToCamelCase(strAsObject) {
  var newObject = {};
  _.forEach(strAsObject, function (value, key) {
      // checks that a value is a plain object or an array - for recursive key conversion
      if (_.isPlainObject(value) || _.isArray(value)) {
        // recursively update keys of any values that are also objects
        value = convertObjectKeysToCamelCase(value);
      }
      newObject[_.camelCase(key)] = value;
    }
  );
  return newObject;
}

// trim the values
export function strTrim(str) {
  return _.trim(str);
}

// check if object is empty
export function checkIfObjectIsEmpty(strAsObject) {
  return _.isEmpty(strAsObject);
}

// check if string matched
export function checkIfStringMatched(str1, str2) {
  let isMatched;
  str1 = strTrim(str1);
  str2 = strTrim(str2);
  isMatched = (str1 === str2);
  return isMatched;
}
