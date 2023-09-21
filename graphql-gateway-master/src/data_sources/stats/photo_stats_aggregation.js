import {Node} from '../base/node';
import {logger} from '../../utils/logger';
import moment from 'moment';

/**
 * Virtual resource: PhotoStatsAggregation
 */
export class PhotoStatsAggregation extends Node {
  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'PhotoStatsAggregation';
  }

  /**
   * Whether this resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether PhotoStatsAggregation resource is queryable. `false` by default.
   */
  get queryable() {
    return true;
  }

  /**
   * Compute the caching hint for a time aggregated stats
   * @param {*} obj The object
   * @return {*} Caching hint
   */
  cacheHint({id}) {
    const to = id[2];
    if (moment(to) < moment().subtract(2, 'days')) {
      // cache longer (1d) if the time period is far away from today
      return {
        maxAge: 86400,
        scope: 'PRIVATE',
      };
    } else {
      // cache short (10m) if the time period is close to today
      return {
        maxAge: 600,
        scope: 'PRIVATE',
      };
    }
  }

  /**
   * Map API response to PhotoStatsAggregation schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      from: obj.id[1],
      to: obj.id[2],
      __noData: obj.__noData,
    };
  }

  /**
   * Aysnc bulk fetch information of PhotoStatsAggregation resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    return keys.map((key) => {
      return {
        id: key,
      };
    });
  }
}
