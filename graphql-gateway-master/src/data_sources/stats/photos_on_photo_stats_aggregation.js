import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from PhotoStatsAggregation to Photo in stats
 */
export class PhotosOnPhotoStatsAggregation extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Get a paginated list of Photo IDs
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {String} from Starting timestamp (inclusively)
   * @param {String} to Ending timestamp (exclusively)
   */
  async paginatedPhotoIdList({pageNum, pageSize}, from, to) {
    const qs = {
      page: pageNum,
      size: pageSize,
      from,
      to,
    };

    // eslint-disable-next-line max-len
    const response = await this.get(`internal/graphql/me/photoStats/viewCount/timeAggregation/photos`, this.tidyQuery(qs));
    const __photoIds = response.photos.map((item)=>item.photo_id);
    const __photoEdgePayloads = response.photos.map((item) => {
      return {
        viewCount: item.view_count,
        // pass this over to edge in case the photo cannot be hydrated
        __photoId: item.photo_id,
      };
    });

    return {
      __photoIds: __photoIds,
      __photoEdgePayloads: __photoEdgePayloads,
      totalCount: response.total_count,
    };
  }
}
