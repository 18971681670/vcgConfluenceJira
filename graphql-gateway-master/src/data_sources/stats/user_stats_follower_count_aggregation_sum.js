import {BatchableAPI} from '../base/batchable_api';

/**
 * API representing sum of User Stats followerCount aggregated by a time frame
 */
export class UserStatsFollowerCountAggregationSum extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Aysnc bulk fetch information of followerCount within given time frames
   * @param {Array} keys An array of time frames (objects with `from`/`to` fields)
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    return await this.post(`internal/graphql/me/userStats/followerCount/timeAggregation/sum`, keys);
  }
}
