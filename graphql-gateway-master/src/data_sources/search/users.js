import {API} from '../base/api';

const SORT_RULES = {
  RELEVANCE: ['_score,desc', 'rating,desc'],
  MOST_POPULAR: ['rating,desc'],
  MOST_RECENT: ['created_at,desc'],
};

/*
 * Should match the definitions in UserFilterType
 */
const USER_FILTER_TYPE = {
  STATUS: 'status',
  AVAILABLE_FOR_HIRE: 'available_for_hire',
  SPECIALTIES: 'specialties',
  HIRE_LOCATIONS: 'hire_locations',
};

/**
 * Paginated API for User search
 */
export class UserSearch extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'search';
  }

  /**
   * Get a paginated list of searched User ids
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pegination.pageSize The number of items in a page.
   * @param {String} search The search string
   * @param {Array} filters The list of filter objects
   * @param {String} sort The sorting option
   */
  async paginatedUserIdList({pageNum, pageSize}, search, filters, sort) {
    /*
     * Note: filters ends up a JSONified string of an array of key-value objects
     * [{\"key\":\"specialties\",\"value\":\"0,3,5\"},{\"key\":\"place_id\",\"value\":\"1234\"}]
     */
    const serializedFilters = filters ? filters.map((filter) => ({
      key: USER_FILTER_TYPE[filter.key],
      value: filter.value,
    })) : [];

    const qs = {
      page: pageNum,
      rpp: pageSize,
      term: search,
      filters: JSON.stringify(serializedFilters),
      sort: SORT_RULES[sort],
    };

    const response = await this.get(`/internal/graphql/users`, this.tidyQuery(qs));

    return {
      __userIds: response.ids,
      totalCount: response.total_items,
    };
  }
}
