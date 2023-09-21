import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing sum of Photo Stats commentCount aggregated by a time frame
 */
export class PhotoStatsCommentCountAggregationPhotoSum extends BatchableAPI {
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
   * Aysnc bulk fetch information of commentCount within given time frames
   * @param {Array} keys An array of time frames (objects with `from`/`to` fields)
   * @param context
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async bulkLoadData(keys, {from, to}) {
    const qs = {
      ids: keys,
      from,
      to,
    };

    // eslint-disable-next-line max-len
    const response = await this.get(`internal/graphql/me/photoStats/commentAndReplyCount/timeAggregation/photos/sourceSumByIds`, qs);

    const lookupById = response.reduce(function(map, obj) {
      map[obj.photo_id] = obj.count;
      return map;
    }, {});

    return keys.map((id) => {
      return (lookupById[id] || null);
    });
  }
}
