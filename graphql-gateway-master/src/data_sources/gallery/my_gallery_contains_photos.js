import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * Batchable API to check if a list of photos belong to a specific gallery of mine
 */
export class MyGalleryContainsPhotos extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'gallery';
  }

  /**
   * Bulk query input for MyGalleryContainsPhotos
   * @typedef {Object} MyGalleryContainsPhotosKey
   * @property {String} galleryInternalId Internal Gallery ID
   * @property {Array<String>} photoInternalIds A list of Internal Photo IDs
   */

  /**
   * Batch query to check if a list of photos belong to a specific gallery
   * @param {Array<MyGalleryContainsPhotosKey>} keys An array of query objects with gallery/photo
   * @return {Array} A list of arrays, each of which contains the photos in the given gallery
   */
  async bulkLoadData(keys) {
    const photoIds = new Set();
    const galleryIds = new Set();
    keys.forEach((key) => {
      galleryIds.add(key.galleryInternalId);
      key.photoInternalIds.forEach((photoId) => {
        photoIds.add(photoId);
      });
    });

    const body = {
      photo_ids: Array.from(photoIds.values()),
      gallery_ids: Array.from(galleryIds.values()),
    };

    const response = await this.post(`internal/graphql/me/galleries/containPhotos`, body);

    return keys.map((key) => {
      const queryPhotoIds = new Set(key.photoInternalIds);
      return (response[key.galleryInternalId] || []).filter((id) => {
        // must convert id to string as IDs in GraphQL are in string type.
        return queryPhotoIds.has(id.toString());
      });
    });
  }
}
