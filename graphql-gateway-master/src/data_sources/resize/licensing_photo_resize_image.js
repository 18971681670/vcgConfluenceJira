import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing PhotoResizeImage from Resize
 */
export class LicensingPhotoResizeImage extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'LicensingPhotoResizeImage';
  }

  /**
   * Map API response of a list of resize images to a list of objects in PhotoResizeImage schema
   * @param {Array} obj A list of resize images from API response
   * @return {Array} An list of object under GraphQL schema
   */
  reducer(obj) {
    return obj.map((t) => {
      return {
        ...super.reducer(t),
        size: t.size,
        url: t.url,
      };
    });
  }

  /**
   * Aysnc bulk fetch information of PhotoResizeImage resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const url = `internal/graphql/licensingPhotoResizeImages/findByIds`;
    const response = await this.post(url, keys);
    return keys.map((key) => {
      const {id, userId, watermark, storedAt} = key;
      const obj = response[id];
      return obj.map((t) => {
        t.id = [id, userId, watermark, storedAt, t.size];
        return t;
      } );
    });
  }
}
