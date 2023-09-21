import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from Gallery to Photo in gallery
 */
export class Title extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'ai-service';
  }

  /**
   * Get suggest categories of a uploaed photo.
   * @param {ID} photoId the id of uploaded photo.
   * @return {String} title of photo.
   */
  async getPhotoTitle(photoId) {
    try {
      const response = await this.get(`/internal/caption/${photoId}`);
      return response;
    } catch (e) {
      return null;
    }
  }
}
