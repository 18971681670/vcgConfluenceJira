import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API for Stat resources belonging to current user
 */
export class PhotoStatsHighlightUserViewCountAggregationSum extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Get the userProfileViewCount within the given time
   * @param {String} from From ISO timestamp (inclusive)
   * @param {String} to To ISO timestamp (exclusive)
   * @return {Number} userProfileViewCount
   */
  async loadData(from, to) {
    const qs = {
      from,
      to,
    };
    const response = await this.get(`internal/graphql/me/userStats/viewCount/timeAggregation/sum`, this.tidyQuery(qs));
    return response || 0;
  }
}
