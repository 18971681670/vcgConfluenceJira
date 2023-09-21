import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from UserStatsAggregation to User in stats
 */
export class UnfollowedByUsersOnUserStatsAggregation extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Get a paginated list of User IDs
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {Array} __internalId Starting timestamp (inclusively)
   * @param {String} filter Ending timestamp (exclusively)
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async paginatedUserIdList({pageNum, pageSize}, from, to) {
    const qs = {
      page: pageNum,
      size: pageSize,
      from,
      to,
    };

    const response = await this.get(`internal/graphql/me/userStats/unfollowerCount/timeAggregation/users`, this.tidyQuery(qs));
    const __userIds = response.unfollowers.map((item)=>item.follower_id);
    const __userEdgePayloads = response.unfollowers.map((item) => {
      return {
        unfollowedAt: item.unfollowed_at,
      };
    });

    return {
      __userIds: __userIds,
      __userEdgePayloads: __userEdgePayloads,
      totalCount: response.total_count,
    };
  }
}
