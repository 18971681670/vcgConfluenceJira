import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing PhotoView from photo
 */
export class PhotoViewCount extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'photo';
  }

  /**
   * Aysnc bulk fetch information of PhotoView resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };
    const response = await this.get(`internal/graphql/photos/findViewCountsByIds`, qs);

    const lookupById = response.reduce(function(map, obj) {
      map[obj.id] = obj.times_viewed;
      return map;
    }, {});

    return keys.map((id) => {
      return (lookupById[id] || 0);
    });
  }

  /**
   * Aysnc increment PhotoView count
   * @param {Array} keys An array of keys to increment view count
   * @return {Promise<void>}
   */
  async incrementViewCount(keys) {
    if (keys && keys.length > 0) {
      try {
        const ids = keys.filter((k) => !!k).join(',');
        await this.post(`internal/graphql/increment/viewCount?ids=${ids}`);
      } catch (e) {
        // ignore error
      }
    }
  }
}
