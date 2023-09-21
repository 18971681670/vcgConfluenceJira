import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * Virtual resource: UserPhotoAggregation
 */
export class UserPhotoStatsAggregation extends Node {
  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'UserPhotoAggregation';
  }

  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Whether this resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether PhotoStatsAggregation resource is queryable. `false` by default.
   */
  get queryable() {
    return true;
  }

  /**
   * get the like count of all photos of a user.
   * @param {ID} userId id of user in db.
   * @return {int} the total like count.
   */
  async getUserLikeCount(userId) {
    const likeCount = await this.get(`/internal/graphql/me/findAllVotesByUserId/${userId}`);
    return likeCount || 0;
  }

  /**
   * get the view count of all photos of a user.
   * @param {ID} userId
   * @return {int} the total view count.
   */
  async getUserViewCount(userId) {
    const viewCount = await this.get(`/internal/graphql/me/findAllViewsByUserId/${userId}`);

    return viewCount || 0;
  }
}
