import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing ModelRelease from licensing
 */
export class ModelRelease extends Node {
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
    return 'ModelRelease';
  }

  /**
   * Map API response to ModelRelease schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      filename: obj.file_name,
      downloadLink: obj.download_link,
      type: obj.release_type.toUpperCase(),
      status: obj.status.toUpperCase(),
    };
  }


  /**
   * Create ModelRelease resource
   * @param {Object} input Creation params
   * @param {String} input.filename Original filename of the model release
   * @return {Object} A newly created ModelRelease resource
   */
  async create(input) {
    const body = this.inputToBody(input, {
      convertedMapping: {
        filename: {
          fieldName: 'file_name',
        },
      },
    });

    const response = await this.post('internal/graphql/modelReleases', body);
    return {
      modelRelease: this.reducer(response.licensing_release),
      directUpload: {
        url: response.presigned_post.url,
        fields: JSON.stringify(response.presigned_post.fields),
      },
    };
  }

  /**
   * Create Digital ModelRelease resource
   * @param {Object} input Creation params
   * @param {String} input.filename Original filename of the model release
   * @return {Object} A newly created ModelRelease resource
   */
  async createModelReleaseInvitation(input) {
    const body = {
      firstname: input.firstName,
      lastname: input.lastName,
      licensing_photo_id: input.legacyLicensingPhotoId,
      taken_country: input.takenCountry,
      taken_province: input.takenProvince,
      taken_city: input.takenCity,
      photographer_firstname: input.photographerFirstName,
      photographer_lastname: input.photographerLastName,
      shoot_description: input.shootDescription,
      release_title: input.modelReleaseTitle,
      taken_at: input.takenAt,
    };

    const response = await this.post('internal/graphql/modelReleaseInvitations', body);
    return {
      modelRelease: this.reducer(response.licensing_release),
    };
  }

  /**
   * Activate ModelRelease resource
   * @param {String} internalId model release ID
   * @return {Object} A newly activated ModelRelease resource
   */
  async activate(internalId) {
    const response = await this.post(`internal/graphql/modelReleases/${internalId}/activate`);
    return this.reducer(response.licensing_release);
  }

  /**
   * Aysnc bulk fetch information of model releases resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };
    const response = await this.get(`internal/graphql/modelReleases/findByReleaseIds`, qs);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }
}
