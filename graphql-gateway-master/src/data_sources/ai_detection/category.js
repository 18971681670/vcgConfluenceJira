import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from Gallery to Photo in gallery
 */
export class Category extends API {
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
   * @return {array} list of photo categories.
   */
  async getPhotoCategory(photoId) {
    try {
      const response = await this.get(`category/${photoId}`);
      if (response) {
        return response.categories.map((item) => {
          return {
            category: item.category,
            probability: item.score,
          };
        });
      }
      return [];
    } catch (exception) {
      return [];
    }
  }
}
