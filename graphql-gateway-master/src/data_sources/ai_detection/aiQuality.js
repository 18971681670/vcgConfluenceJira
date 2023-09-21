import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from Gallery to Photo in gallery
 */
export class AiQuality extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'ai-service';
  }

  /**
   * Bulk get intersection and union collection of aiQuality for multiple photos.
   * @param {*[]} photoIds The list of photo information payload, include id.
   * @return {Object} the object contain intersection and union collection of keyword data.
   */
  async batchGetPhotoAiQualities(photoIds) {
    const response = await this.post(`/aiquality`, photoIds);
    const result = response.map((item) => {
      return {
        ...item,
        photoId: item.photo_id,
        qualityTier: item.quality_tier,
      };
    });
    return result;
  }
}
