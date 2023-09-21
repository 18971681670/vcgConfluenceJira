import {BatchableAPI} from '../base/batchable_api';

/**
 * API representing sum of Photo Stats viewCount aggregated by a time frame
 */
export class PhotoStatsViewSourceCountAggregationSum extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Enable multiContext mode
   */
  constructor() {
    super(true);
  }

  /**
   * Aysnc bulk fetch information of viewCount within given time frames
   * @param {Array} keys An array of time frames (objects with `from`/`to` fields)
   * @param context
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async bulkLoadData(keys, {source}) {
    return await this.post(`internal/graphql/me/photoStats/viewCount/timeAggregation/sources/${source}/sum`, keys);
  }
}
