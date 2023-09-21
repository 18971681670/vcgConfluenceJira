import {API} from '../base/api';

/**
 * Logged-in user's licensing photo candidates
 */
export class MyLicensingPhotoCandidates extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * Get a paginated list of items in the given gallery, identified by the
   * private token
   * @param {Object} pagination The page number, starting from 1.
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pegination.pageSize The number of items in a page.
   * @param {string} status The filter
   */
  async paginatedPhotoIdList({pageNum, pageSize}, status) {
    const qs = {
      page: pageNum,
      size: pageSize,
      status,
    };

    const res = await this.get(`internal/graphql/me/licensingPhotoCandidates`, this.tidyQuery(qs));

    return {
      __photoIds: res.ids,
      totalCount: res.total_items,
    };
  }

  /**
   * suggest photo query from es
   * @param {number} pageNum
   * @param {string} filter
   * @param {SuggestPhotoSort} sort
   * @return {Promise<{__photoIds, totalCount}>}
   */
  async pagePhotoIdListByES({pageNum, pageSize}, filter, sort) {
    const qs = {
      page: pageNum,
      size: pageSize,
      filter: filter,
      sort: sort,
    };

    const res = await this.get(`/internal/graphql/me/licensingPhotoCandidates`, this.tidyQuery(qs));

    return {
      __photoIds: res.ids,
      totalCount: res.total_items,
      cursors: [1],
    };
  }
}
