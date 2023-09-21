import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API for top Lens/Camera resources belonging to current user
 */
export class MyTopGear extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'search-service';
  }

  /**
   * Get a list of Lens resource IDs belonging to current user
   * @param {String} type `CAMERA`/`LENS`
   * @param {number} count The number of items in top list.
   * @param {Object} window Time window
   * @param {String} window.from Time window, starting timestamp (inclusive)
   * @param {String} window.to Time window, ending timestamp (exclusive)
   */
  async gearIdList(type, count, {from, to}) {
    type = type.toLowerCase();

    const qs = {
      'user.id': this.currentUserId,
      'privacy': '0,2',
      'status': 1,
      'created_at': [
        `gte:${from}`,
        `lt:${to}`,
      ],
      'aggs': [
        `root:top_gear:terms:field=${type}.id:size=${count}:order=liking_stats.count|desc`,
        `top_gear:liking_stats:stats:field=votes_count`,
        /*
         * `top_gear:commenting_stats:stats:field=comments_count`,
         * `top_gear:viewing_stats:stats:field=times_viewed`,
         */
      ],
      'sn': 'graphql',
      'f': `stats_top_${type}`,
    };

    const response = await this.get(`/aggregation/500px/photos`, this.tidyQuery(qs));
    const __gearEdgePayloads = response.results.top_gear.buckets.map((bucket) => {
      return {
        photoLikeCount: bucket.liking_stats.sum,
        photoUploadCount: bucket.doc_count,
      };
    });
    const __gearIds = response.results.top_gear.buckets.map((bucket) => {
      return bucket.key;
    });

    return {
      __gearIds,
      __gearEdgePayloads,
      totalCount: __gearIds.length,
    };
  }
}
