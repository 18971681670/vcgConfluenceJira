const crypto = require('crypto');

export const KEY_SPAN = 300; // seconds

/**
 * base64Encode
 * @param {*}  buffer
 * @return {string} base64Encode string
 */
export const base64Encode = (buffer) => {
  return buffer.toString('base64')
      .replace(/\+/g, '-') // Convert '+' to '-'
      .replace(/\//g, '_'); // Convert '/' to '_'
};

/**
 * get auth token
 * @param {String} message - message string
 * @param {String} secret - secret string
 * @return {String} encoded token
 */
export const getAuthToken = (message, secret) => {
  const mac = crypto.createHmac('sha256', secret)
      .update(message)
      .digest();
  return base64Encode(mac);
};
