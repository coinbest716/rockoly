/** @format */

export function getENVConfig(key) {
  try {
    return process && process.env
      ? process.env['REACT_APP_' + key] || /* default without react_app*/ process.env[key]
      : null
  } catch (e) {
    return null
  }
}
