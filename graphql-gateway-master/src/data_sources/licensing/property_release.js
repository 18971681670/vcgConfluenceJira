import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing PropertyRelease from licensing
 */
export class PropertyRelease extends Node {
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
    return 'PropertyRelease';
  }

  /**
   * Map API response to PropertyRelease schema
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
   * Create PropertyRelease resource
   * @param {Object} input Creation params
   * @param {String} input.filename Original filename of the property release
   * @return {Object} A newly created PropertyRelease resource
   */
  async create(input) {
    const body = this.inputToBody(input, {
      convertedMapping: {
        filename: {
          fieldName: 'file_name',
        },
      },
    });

    const response = await this.post('internal/graphql/propertyReleases', body);
    return {
      propertyRelease: this.reducer(response.licensing_release),
      directUpload: {
        url: response.presigned_post.url,
        fields: JSON.stringify(response.presigned_post.fields),
      },
    };
  }

  /**
   * Activate PropertyRelease resource
   * @param {String} internalId property release ID
   * @return {Object} A newly activated PropertyRelease resource
   */
  async activate(internalId) {
    const response = await this.post(`internal/graphql/propertyReleases/${internalId}/activate`);
    return this.reducer(response.licensing_release);
  }
}
