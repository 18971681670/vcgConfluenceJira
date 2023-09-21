import {Node} from '../base/node';

/**
 * User Block Operation.
 */
export class Block extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'messenger-expermental';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'userblock';
  }

  /**
   * create user block
   * @param {*} blockId user id of blocked
   */
  async createBlock(blockId) {
    await this.post(`chat/block/create?blockId=${blockId}`);
    return 'success';
  }

  /**
   * cancel user block
   * @param {*} blockId user id of cancel blocked
   */
  async cancelBlock(blockId) {
    await this.delete(`chat/block/cancel?blockId=${blockId}`);
    return 'success';
  }

  /**
   * check is block
   * @param {*} blockId user if of blocked
   */
  async isBlock(blockId) {
    return await this.get(`chat/block/isblock?blockId=${blockId}`);
  }

  /**
   * Get a paginated list of Gallery resources belonging to current user
   * @param {number} cursor The blockId.
   * @param {number} pageSize The number of items in a page.
   */
  async blockedUserListByCursor(cursor, pageSize) {
    const userId = this.currentUserId;
    if (!userId) {
      return {
        data: [],
        cursor: undefined,
      };
    }

    const qs = {
      size: pageSize,
      cursor,
    };

    const response = await this.get(`/chat/block/blocks`, this.tidyQuery(qs));
    return response;
  }
}
