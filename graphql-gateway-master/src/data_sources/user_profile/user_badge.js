import {Node} from '../base/node';

/**
 * API representing UserBadge from user_profile
 */
export class UserBadge extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'userprofile';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'UserBadge';
  }
  /**
   * Map API response to UserBadge schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      // from JSON fields to GraphQL schema fields
      badges: obj.badges,
    };
  }

  /**
   * Aysnc bulk fetch information of user badge resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };
    const response = await this.get(`internal/graphql/userBadges/findByIds`, qs);
    return keys.map((id) => ({
      id,
      badges: response[id],
    }));
  }
}
