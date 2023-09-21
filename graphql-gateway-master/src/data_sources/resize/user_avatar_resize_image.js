import {Node} from '../base/node';
import {logger} from '../../utils/logger';

const SIZE_MAPPING = {
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'large',
  LARGE: 'default',
  COVER: 'cover',
};

/**
 * API representing UserAvatarResizeImage from Resize
 */
export class UserAvatarResizeImage extends Node {
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
    return 'UserAvatarResizeImage';
  }

  /**
   * Map API response to UserAvatarResizeImage schema
   * @param {Array} objects A list of items from API response representing all images
   * @return {Array} An list of image objects under GraphQL schema
   */
  reducer(objects) {
    return objects.map((obj) => {
      return {
        ...super.reducer(obj),
        size: obj.size,
        url: obj.https,
      };
    });
  }

  /**
   * Aysnc bulk fetch information of UserAvatarResizeImage resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const response = await this.post(`internal/graphql/userAvatarResizeImages/findByIds`, keys);
    return keys.map((key) => {
      const {userId, version, sizes} = key;
      const obj = response[userId];
      if (!obj) {
        return null;
      }

      return sizes.map((size) => {
        const item = obj[SIZE_MAPPING[size]];
        return item ? {
          ...item,
          id: [userId, version, size],
          size,
        } : null;
      });
    });
  }
}
