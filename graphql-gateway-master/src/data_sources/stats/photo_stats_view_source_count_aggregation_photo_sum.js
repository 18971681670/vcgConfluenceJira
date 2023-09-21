import {BatchableAPI} from '../base/batchable_api';

/**
 * API representing sum of Photo Stats viewCount aggregated by a time frame
 */
export class PhotoStatsViewSourceCountAggregationPhotoSum extends BatchableAPI {
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
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys, {from, to}) {
    const qs = {
      ids: keys,
      from,
      to,
    };
    // eslint-disable-next-line max-len
    const response = await this.get(`internal/graphql/me/photoStats/viewCount/timeAggregation/photos/sourceSumByIds`, qs);
    const lookupById = response.reduce(function(map, obj) {
      map[obj.photo_id] = {
        homeFeedCount: obj.home_feed_count,
        discoverCount: obj.discover_count,
        searchCount: obj.search_count,
        profileCount: obj.profile_count,
      };
      return map;
    }, {});
    return keys.map((id) => {
      return (lookupById[id] || {
        homeFeedCount: 0,
        discoverCount: 0,
        searchCount: 0,
        profileCount: 0,
      });
    });
  }
}
