import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing PhotoView from photo
 */
export class PhotoKeyWordToken extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'photo';
  }

  /**
   * Aysnc bulk fetch information of PhotoView resources
   * @param {Array} input An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async signPhotoKeywordReqeuest(input) {
    const userId = this.currentUserId;
    if (null == userId) {
      return {};
    }
    const mappingConfig = {
      camelToSnakeMapping: ['intersectionQuantity', 'unionQuantity', 'photoLegacyIds', 'imageSize'],
    };
    const body = this.inputToBody(input, mappingConfig);
    const response = await this.post(`internal/graphql/users/${userId}/photoKeyWordToken`, body);
    return {
      requestBody: response.request_body,
      requestUrl: response.request_url,
    };
  }
}
