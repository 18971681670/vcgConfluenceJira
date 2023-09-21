import {API} from '../base/api';

/**
 * Aggregate photo stats
 */
export class PhotosAggregateStats extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'photo';
  }

  /**
   * Aggregate photo stats for user
   * @param {Object} userLegacyId - The legacy user id
   */
  async getAggregateStats({userLegacyId}) {
    // FIXME: Create a graphql endpoint for this
    const response = await this.get(`v3/photo/users/${userLegacyId}/photo_stats`);
    return {
      viewCount: response.stats.views_count,
      likeCount: response.stats.likes_count,
      commentsCount: response.stats.comments_count,
    };
  }
}
