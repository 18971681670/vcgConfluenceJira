import {BatchableAPI} from '../base/batchable_api';

/**
 * API representing sum of Photo Stats likeCount aggregated by a time frame
 */
export class PhotoStatsLikeCountAggregationSum extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Get the photoLikeCount within the given time
   * @param {String} from From ISO timestamp (inclusive)
   * @param {String} to To ISO timestamp (exclusive)
   * @return {Number} photoLikeCount
   */
  async loadData(from, to) {
    const qs = {
      from,
      to,
    };
    const response = await this.get(`internal/graphql/me/photoStats/likeCount/timeAggregation/sum`, this.tidyQuery(qs));
    return response || 0;
  }

  /**
   * Aysnc bulk fetch information of likeCount within given time frames
   * @param {Array} keys An array of time frames (objects with `from`/`to` fields)
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    return await this.post(`internal/graphql/me/photoStats/likeCount/timeAggregation/sum`, keys);
  }
}
