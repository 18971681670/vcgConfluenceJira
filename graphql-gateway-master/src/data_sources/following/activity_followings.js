import {API} from '../base/api';

/**
 * API representing users following me
 */
export class ActivityFollowings extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'following';
  }

  /**
   * Aysnc fetch ids of users following this userId
   * @return {Object} user ids and count
   */
  async userList() {
    const response = await this.get(`/v1/activities/followings`, {});
    return {
      __userIds: response.followings,
      totalCount: response.count,
    };
  }
}
