import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * API for suggest photo
 */
export class SuggestPhoto extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * dismiss suggest photo.
   *
   * @param {long} photoId - photoId
   */
  async dismissSuggestPhoto(photoId) {
    logger.info('the photoId to be dismissed:' + photoId);
    return await this.post(`internal/graphql/dismissSuggest/${photoId}`);
  }
}
