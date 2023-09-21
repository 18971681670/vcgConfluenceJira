import {API} from '../base/api';

/**
 * API representing eai-explore-service
 */
export class Explore extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'eai-explore-service.elephant-ai.svc.cluster.local';
  }

  /**
   * Get explore feed
   * @param {string} userId
   * @param {integer} first
   * @param {string} after
   * @return {object} The explore feed for a user
   */
  async getFeed(userId, first, after) {
    const query = {limit: first};
    if (!!after) {
      query['cursor'] = after;
    }

    const response = await this.get(`feed/${userId}`, query);
    return {
      __photoIds: response.feed,
      __next: response.next,
      __cursors: response.cursors,
    };
  }
};
