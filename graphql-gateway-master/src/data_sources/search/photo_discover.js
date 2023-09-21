import {API} from '../base/api';

const SORT_RULES = {
  NONE: [], // Equivalent to pulse for popular
  POPULAR_PULSE: [], // Equivalent to NONE, maps to rating in popular
  POPULAR_NEWEST: ['popular_start_at,desc'],
};


// Should match the definitions in PhotoDiscoverFilterType
const PHOTO_DISCOVER_FILTER_TYPE = {
  FOLLOWERS_COUNT: 'followers_count',
  CATEGORY: 'category',
  FEATURE_NAME: 'feature_name',
  FEATURE_START_AT: 'feature_start_at',
  FEATURE_END_AT: 'feature_end_at',
  EXCLUDE_CATEGORY: 'exclude_category',
};

/**
 * Paginated API for Photo Discover search
 */
export class PhotoDiscoverSearch extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'search';
  }

  /**
   * Get a paginated list of discover photo ids
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {String} search The search string
   * @param {Array} filters The list of filter objects
   * @param {String} sort The sorting option
   */
  async paginatedDiscoverPhotoIdList({pageNum, pageSize}, search, filters, sort) {
    /*
     * Note: filters ends up a JSONified string of an array of key-value objects
     * [{\"key\":\"feature.name\",\"value\":\"fresh\"},{\"key\":\"category\",\"value\":\"7,14\"}]
     */
    const serializedFilters = filters ? filters.map((filter) => ({
      key: PHOTO_DISCOVER_FILTER_TYPE[filter.key],
      value: filter.value,
    })) : [];

    const qs = {
      page: pageNum,
      rpp: pageSize,
      term: search,
      filters: JSON.stringify(serializedFilters),
      sort: SORT_RULES[sort],
    };

    const response = await this.get(`/internal/graphql/discover`, this.tidyQuery(qs));
    return {
      __photoIds: response.ids,
      totalCount: response.total_items,
    };
  }
}
