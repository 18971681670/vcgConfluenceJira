import {Node} from '../base/node';

/**
 * API representing AutoLicensingPhoto from licensing
 */
export class AutoLicensingPhoto extends Node {
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
    return 'AutoLicensingPhoto';
  }

  /**
   * Map API response to AutoLicensingPhoto schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      // from JSON fields to GraphQL schema fields
      status: obj.status,
      __licensingPhotoInfo: JSON.parse(obj.licensing_photo_info || '{}'),
    };
  }

  /**
   * Aysnc bulk fetch information of AutoLicensingPhoto resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      photoIds: keys.join(','),
    };
    const response = await this.get(`internal/graphql/autoLicensingPhotos/findByIds`, qs);
    return keys.map((id) => response[id] || null);
  }

  /**
   * Cancel Auto Licensing photo
   * @param {number} photoId photo id
   * @return {Object} Auto Licensing photo object
   */
  async cancelAutoLicensing(photoId) {
    const response = await this.post(`internal/graphql/autoLicensingPhotos/${photoId}/cancel`);
    return this.reducer(response);
  }
}
