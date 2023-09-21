import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing GearBrand from gear
 */
export class GearBrand extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'gear';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'GearBrand';
  }

  /**
   * Map API response to GearBrand schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      name: obj.name,

      __slug: obj.slug,
    };
  }

  /**
   * Aysnc bulk fetch information of GearBrand resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    // eslint-disable-next-line max-len
    const response = await this.get(`internal/graphql/brands/findByIds`, qs);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }
}
