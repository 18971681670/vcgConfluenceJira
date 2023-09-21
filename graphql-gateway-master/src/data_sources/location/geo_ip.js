import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing GeoIp from Location
 */
export class GeoIp extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'locations';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'GeoIp';
  }

  /**
   * Map API response to GeoIp schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      countryCode: obj.iso_code,
    };
  }

  /**
   * Aysnc bulk fetch information of GeoIp resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const body = keys;

    const response = await this.post(`internal/graphql/geoIps/findByIps`, body);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }
}
