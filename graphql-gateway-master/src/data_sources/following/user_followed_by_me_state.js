import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing UserFollowedByMeState from following
 */
export class UserFollowedByMeState extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'following';
  }

  /**
   * Aysnc bulk fetch information of UserFollowedByMeState resources
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

    const response = await this.get(`internal/graphql/followingState/findByIds`, qs);

    return keys.map((id) => {
      return response[id];
    });
  }

  /**
   * current user is follwing 500px account.
   */
  async isHomefeedNeedRecommand() {
    if (!this.currentUserId) {
      return false;
    }

    const __needRecommend = await this.get(`internal/graphql/need_recommend`);

    return __needRecommend;
  }

  /**
   * Follow a user
   * @param {String} userInternalId internal ID
   */
  async follow(userInternalId) {
    await this.post(`internal/graphql/users/${userInternalId}/followedByMeState`);
  }

  /**
   * Unfollow a user
   * @param {String} userInternalId internal ID
   */
  async unfollow(userInternalId) {
    await this.delete(`internal/graphql/users/${userInternalId}/followedByMeState`);
  }
}
