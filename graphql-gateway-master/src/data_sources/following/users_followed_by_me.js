import {API} from '../base/api';

/**
 * API representing users followed by this user
 */
export class UsersFollowedByMe extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'following';
  }

  /**
   * Aysnc fetch ids of users followed by this user
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


    const response = await this.get(`internal/graphql/user/${userId}/followingUsers`, qs);
    return {
      __userIds: response.ids,
      totalCount: response.count,
    };
  }
}
