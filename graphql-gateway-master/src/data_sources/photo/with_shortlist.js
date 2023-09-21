import {logger} from '../../utils/logger';
import {BatchableAPI} from '../base/batchable_api';

/**
 * Helps with the edge context for Photo
 */
export class WithShortlist extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'contest';
  }

  /**
   * Aysnc bulk fetch information of PhotoEdge resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const url = `internal/graphql/quests/doInshortList`;
    const response = await this.post(url, keys);
    return keys.map((key) => {
      const {photoId, questId} = key;
      return !!response[photoId+'-'+questId];
    });
  }
}
