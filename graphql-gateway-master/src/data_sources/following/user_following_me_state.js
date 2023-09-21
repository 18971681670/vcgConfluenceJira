import {BatchableAPI} from '../base/batchable_api';

/**
 * API representing UserFollowingMeState from following
 */
export class UserFollowingMeState extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'following';
  }

  /**
   * Aysnc bulk fetch information of UserFollowingMeState resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    if (!this.currentUserId) {
      return keys.map(() => null);
    }

    const qs = {
      ids: keys.join(','),
    };

    const response = await this.get(`internal/graphql/followedState/findByIds`, qs);

    return keys.map((id) => {
      return response[id];
    });
  }
}
