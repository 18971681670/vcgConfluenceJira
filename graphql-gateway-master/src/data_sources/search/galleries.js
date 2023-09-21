import {API} from '../base/api';

const SORT_RULES = {
  RELEVANCE: ['_score,desc'],
  ID_DESC: ['id,desc'],
  // FIXME: "editors" isn't a feature in the context of gallery but it fixes the bug https://500pxinc.atlassian.net/browse/SQP-5879
  EDITORS_DESC: ['feature.editors.start,desc', 'id,desc'],
};

// Should match the definitions in GalleryFilterType
const GALLERY_FILTER_TYPE = {
  STATUS: 'status',
  USER_STATUS: 'user_status',
  USER_ID: 'user_id',
  PRIVACY: 'privacy',
  NSFW: 'nsfw',
  FEATURE_NAME: 'feature.name',
  FEATURE_START_AT: 'feature.start_at',
  FEATURE_END_AT: 'feature.end_at',
  IS_EDITORS_CHOICE: 'is_editors_choice',
};

/**
 * Paginated API for Gallery search
 */
export class GallerySearch extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'search';
  }

  /**
   * Get a paginated list of searched photo ids
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pegination.pageSize The number of items in a page.
   * @param {String} search The search string
   * @param {Array} filters The list of filter objects
   * @param {String} sort The sorting option
   */
  async paginatedGalleryIdList({pageNum, pageSize}, search, filters, sort) {
    /*
     * Note: filters ends up a JSONified string of an array of key-value objects
     * [{\"key\":\"feature.name\",\"value\":\"editors\"},{\"key\":\"nsfw\",\"value\":\"false\"}]
     */
    const serializedFilters = filters ? filters.map((filter) => ({
      key: GALLERY_FILTER_TYPE[filter.key],
      value: filter.value,
    })) : [];

    const qs = {
      page: pageNum,
      rpp: pageSize,
      term: search,
      filters: JSON.stringify(serializedFilters),
      sort: SORT_RULES[sort],
    };

    const response = await this.get(`/internal/graphql/galleries`, this.tidyQuery(qs));

    return {
      __galleryIds: response.ids,
      totalCount: response.total_items,
    };
  }
}
