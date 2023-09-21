import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing PhotoLikeCounter from liking
 */
export class PhotoLikeCounter extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'liking';
  }

  /**
   * Aysnc bulk fetch information of PhotoLikeCounter resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys,
    };

    const response = await this.get(`internal/graphql/photos/findLikeCountersByIds`, qs);

    return keys.map((id) => {
      return response[id];
    });
  }

  /**
   * Aysnc bulk fetch information of PhotoLikeCounter resources.
   * @param {Array} keys An array of keys for bulk loading
   * @param {String} resourceTypeEnum Photo ID
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   */
  async findByResourceKey(keys, resourceTypeEnum) {
    const qs = {
      ids: keys,
      resourceTypeEnum: resourceTypeEnum,
    };

    const response = await this.get(`internal/graphql/findLikeCountersByIds`, qs);

    return response[keys];
  }
}
