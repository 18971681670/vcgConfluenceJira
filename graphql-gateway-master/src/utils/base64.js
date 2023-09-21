/**
 * base64 encoding
 * @param {string} plaintext The original string for encoding
 * @return {string} The string encoded by base64
 */
export function btoa(plaintext) {
  return Buffer.from(plaintext).toString('base64');
}

/**
 * base64 decoding
 * @param {string} encoded The base64 encoded string
 * @return {string} The decoded string
 */
export function atob(encoded) {
  return Buffer.from(encoded, 'base64').toString();
}
