import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from Photo to User in photo
 */
export class LikedByUsersOnPhoto extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'liking';
  }

  /**
   * Get a paginated list of User IDs
   * @param {DdbPaginationInfo} pagination pageObject
   * @param {String} pagination.exclusiveStartKey the start exclusive key of page
   * @param {Number} pagination.size the size of page
   * @param {Number} photoId Internal ID of Photo
   */
  async paginatedUserIdList({exclusiveStartKey, size}, photoId) {
    const qs = {
      cursor: exclusiveStartKey,
      size: size,
    };

    const response = await this.get(`internal/graphql/photos/${photoId}/likedByUsers`, this.tidyQuery(qs));

    const __userIds = response.data.map((item) => item.user_id);

    const __userEdgePayloads = response.data.map((item) => {
      return {
        __cursor: item.cursor,
        likedAt: item.liked_at,
      };
    });

    return {
      __userIds,
      __userEdgePayloads,
      __lastEvaluatedKey: response.last_evaluated_key,
    };
  }
}
