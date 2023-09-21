import {API} from '../base/api';

/**
 * API representing users following me
 */
export class UsersFollowingMe extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'following';
  }

  /**
   * Aysnc fetch ids of users following this userId
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {String} userId id of requested user
   * @return {Object} user ids and count
   */
  async paginatedUserIdList({pageNum, pageSize}, userId) {
    const qs = {
      page: pageNum,
      rpp: pageSize,
    };

    const response = await this.get(`internal/graphql/user/${userId}/followedByUsers`, qs);
    return {
      __userIds: response.ids,
      totalCount: response.count,
    };
  }
}
