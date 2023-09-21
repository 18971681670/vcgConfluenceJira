import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';
/**
 * Logged-in user's licensing photo candidates
 */
export class PhotoTags extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'tagging';
  }

  /**
   *
   * @param {*} keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys,
    };

    const response = await this.get(`internal/graphql/photos/findTagsByIds`, qs);

    return keys.map((id) => {
      return response[id] || [];
    });
  }

  /**
   * Overwrite photo tags
   * @param {*} internalId  Internal photo id
   * @param {Array<String>} tags Tags to overwrite
   */
  async update(internalId, tags) {
    if (!tags) {
      return;
    }

    const body = tags;

    return await this.post(`internal/graphql/photos/${internalId}/tags`, body);
  }
}
