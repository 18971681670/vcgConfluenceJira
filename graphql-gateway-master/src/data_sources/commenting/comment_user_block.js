import {API} from '../base/api';

/**
 * API for comment user block
 */
export class CommentUserBlock extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'comment';
  }

  /**
   * comment user block.
   *
   * @param {long} userLegacyId - The user who is blocked
   */
  async commentUserBlock(userLegacyId) {
    return await this.post(`/internal/graphql/comment/userBlock/${userLegacyId}`);
  }

  /**
   * comment user unblock.
   *
   * @param {long} userLegacyId - The user who is unblocked
   */
  async commentUserUnblock(userLegacyId) {
    return await this.post(`/internal/graphql/comment/userUnblock/${userLegacyId}`);
  }
}
