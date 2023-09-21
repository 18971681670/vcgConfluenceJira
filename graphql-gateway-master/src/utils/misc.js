/**
 * Generate a reverse lookup table
 * @param {Object} mapping A lookup table
 * @return {Object} A reverse lookup table
 */
export function reverseLookupTable(mapping) {
  return Object.keys(mapping).reduce((acc, k) => {
    acc[mapping[k]] = k;
    return acc;
  }, {});
}
