import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing PhotoLikedByMeState from liking
 */
export class PhotoLikedByMeState extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'liking';
  }

  /**
   * Aysnc bulk fetch information of PhotoLikedByMeState resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    if (!this.currentUserId) {
      return keys.map(() => null);
    }

    const qs = {
      ids: keys,
      userId: this.currentUserId,
    };

    const response = await this.get(`internal/graphql/photos/findLikedByMeStatesByIds`, qs);

    return keys.map((id) => {
      return response[id];
    });
  }

  /**
   * Like a photo
   * @param {String} photoInternalId Photo ID
   */
  async like(photoInternalId) {
    await this.post(`internal/graphql/photos/${photoInternalId}/likedByMeState`);
  }

  /**
   * Unlike a photo
   * @param {String} photoInternalId Photo ID
   */
  async unlike(photoInternalId) {
    await this.delete(`internal/graphql/photos/${photoInternalId}/likedByMeState`);
  }

  /**
   * likeResource
   * @param {String} resourceId Photo ID
   * @param {LikedResourceType} resourceType Photo ID
   */
  async likeResource(resourceId, resourceType) {
    await this.post(`internal/graphql/resource/${resourceId}/liked?resourceTypeEnum=${resourceType}`);
  }

  /**
   * unlikeResource
   * @param {String} resourceId Photo ID
   * @param {LikedResourceType} resourceType Photo ID
   */
  async unlikeResource(resourceId, resourceType) {
    await this.post(`internal/graphql/resource/${resourceId}/unliked?resourceTypeEnum=${resourceType}`);
  }
  /**
   * unlikeResource
   * @param {String} id Photo ID
   * @param {String} resourceTypeEnum Photo ID
   */
  async resourceLikedByMe(id, resourceTypeEnum) {
    const qs = {
      ids: id,
      resourceTypeEnum: resourceTypeEnum,
    };

    const response = await this.get(`internal/graphql/resource/findUserLikedByIds`, qs);

    return response[id];
  }

  /**
   * unlikeResource
   * @param {String} userId Photo ID
   * @param {Array} paramList Photo ID
   */
  async batchSaveLiked(userId, paramList) {
    await this.post(`internal/graphql/resource/${userId}/batchSave`, paramList);
  }
}
