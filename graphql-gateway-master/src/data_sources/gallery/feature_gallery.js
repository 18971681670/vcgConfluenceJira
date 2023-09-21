import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * API representing Featuring a Gallery from gallery
 */
export class FeatureGallery extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'gallery';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'gallery';
  }

  /**
   * Whether a resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether the resource is queryable. `false` by default.
   */
  get queryable() {
    return false;
  }

  /**
   * feature a gallery.
   * @param {String} userLegacyId the id of the user who owns the gallery to be featured.
   * @param {String} galleryLegacyId the id of a gallery to be featured.
   */
  async featureGallery(userLegacyId, galleryLegacyId) {
    return await this.put(`v1/users/${userLegacyId}/galleries/${galleryLegacyId}/editors_choice/add`);
  }

  /**
   * unfeature a gallery.
   * @param {String} userLegacyId the id of the user who owns the gallery to be unfeatured.
   * @param {String} galleryLegacyId the id of a gallery to be unfeatured.
   */
  async unfeatureGallery(userLegacyId, galleryLegacyId) {
    const response = await this.put(`v1/users/${userLegacyId}/galleries/${galleryLegacyId}/editors_choice/remove`);
    return response;
  }
}
