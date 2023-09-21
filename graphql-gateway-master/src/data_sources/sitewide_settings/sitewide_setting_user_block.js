import {API} from '../base/api';

/**
 * API for sitewide-settings user block
 */
export class SitewideSettingUserBlock extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'sitewide-setting';
  }

  /**
   * user block.
   *
   * @param {long} userLegacyId - The user who is blocked
   */
  async userBlock(userLegacyId) {
    return await this.post(`/internal/graphql/user-block/block/${userLegacyId}`);
  }

  /**
   * user unblock.
   *
   * @param {long} userLegacyId - The user who is unblocked
   */
  async userUnblock(userLegacyId) {
    return await this.post(`/internal/graphql/user-block/unblock/${userLegacyId}`);
  }

  /**
   * user blockList.
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @return {Promise<any>} userBlockList
   */
  async userBlockList({pageNum, pageSize}) {
    pageNum = pageNum - 1;
    const response = await this.get(`/internal/graphql/user-block/userBlockListPaginated`, {pageNum, pageSize});
    return {
      __userIds: response.ids,
      totalCount: response.count,
    };
  }

  /**
   *  fetch block userIds
   * @param {*} userId currentUserId
   * @return {Array} [blockedUserId]
   */
  async getUserBlockIdList(userId) {
    if (!userId) {
      return [];
    }
    return await this.get(`/internal/graphql/user-block/blockedUserIdList`);
  }
}
