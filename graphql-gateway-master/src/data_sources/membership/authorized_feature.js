import {logger} from '../../utils/logger';
import {BatchableAPI} from '../base/batchable_api';

/**
 * API representing AuthorizedFeature from membership
 */
export class AuthorizedFeature extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'usercenter';
  }

  /**
   * Enable multi context mode
   */
  constructor() {
    super(true);
  }

  /**
   * Aysnc bulk fetch information of AuthorizedFeature resources
   * @param {Array} keys An array of keys for bulk loading
   * @param {Object} context Context of the bulk query
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys, context) {
    const res = await this.get(`v2/authentication/session`);

    return keys.map((key) => {
      if (res.authorizations[key.toLowerCase()]) {
        return key;
      } else {
        return null;
      }
    });

    // TODO Please add your code to call the microservice
    const qs = {
      ...context,
      features: keys.map((k) => k.toLowerCase()),
    };

    const response = await this.post(`internal/graphql/authorizedFeatures/findByNames`, qs);

    return response;

    /*
     * const lookupById = response.reduce(function(map, obj) {
     *   map[obj.id] = obj;
     *   return map;
     * }, {});
     */

    /*
     * return keys.map((id) => {
     *   return (lookupById[id] || null);
     * });
     */
  }
}
