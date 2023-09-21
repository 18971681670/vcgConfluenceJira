import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing PhotoCommentCounter from commenting
 */
export class PhotoCommentCounter extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'comment';
  }

  /**
   * Aysnc bulk fetch information of PhotoCommentCounter resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    console.log('调用后端接口，没走缓存。。。');
    const response = await this.get(`internal/graphql/photos/findCommentCountersByIds`, qs);

    return keys.map((id) => {
      return response[id];
    });
  }

  /**
   * Aysnc bulk fetch information of PhotoCommentCounter resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async commentsTotalCountStory(keys) {
    const qs = {
      ids: keys.join(','),
    };

    console.log('调用后端接口，没走缓存。。。');
    const response = await this.get(`internal/graphql/story/findCommentCountersByIds`, qs);

    return keys.map((id) => {
      return response[id];
    });
  }
}
