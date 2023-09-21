import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing PhotoStoryView from gallery
 */
export class StoryViewCount extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'gallery';
  }

  /**
   * Aysnc bulk fetch information of StoryView resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };
    const response = await this.get(`/v1/user/story/findViewCountsByIds`, qs);

    const lookupById = response.reduce(function(map, obj) {
      map[obj.id] = obj.view_count;
      return map;
    }, {});

    return keys.map((id) => {
      return (lookupById[id] || 0);
    });
  }

  /**
   * Aysnc increment StoryView count
   * @param {Array} keys An array of keys to increment view count
   * @return {Promise<void>}
   */
  async incrementViewCount(keys) {
    if (keys && keys.length > 0) {
      try {
        const ids = keys.filter((k) => !!k).join(',');
        await this.post(`/v1/user/story/increment/viewCount?storyIds=${ids}`);
      } catch (e) {
        // ignore error
      }
    }
  }
}
