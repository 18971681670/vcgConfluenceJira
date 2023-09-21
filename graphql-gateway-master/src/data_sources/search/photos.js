import {API} from '../base/api';
import {logger} from '../../utils/logger';

const SORT_RULES = {
  RELEVANCE: ['_score,desc'],
  PULSE: ['rating,desc'],
  NEWEST: ['created_at,desc'],
  CREATED_AT_DESC: ['created_at,desc', 'id,desc'],
  CREATED_AT_ASC: ['created_at,asc', 'id,asc'],
  VIEW_COUNT_DESC: ['times_viewed,desc', 'created_at,desc'],
  VIEW_COUNT_ASC: ['times_viewed,asc', 'created_at,asc'],
  LIKE_COUNT_DESC: ['votes_count,desc', 'created_at,desc'],
  LIKE_COUNT_ASC: ['votes_count,asc', 'created_at,asc'],
  COMMENT_AND_REPLY_COUNT_DESC: ['comments_count,desc', 'created_at,desc'],
  COMMENT_AND_REPLY_COUNT_ASC: ['comments_count,asc', 'created_at,asc'],
};

// Should match the definitions in PhotoFilterType
const PHOTO_FILTER_TYPE = {
  STATUS: 'status',
  USER_STATUS: 'user_status',
  USER_ID: 'user_id',
  PRIVACY: 'privacy',
  NSFW: 'nsfw',
  CATEGORY: 'category',
  FEATURE_NAME: 'feature.name',
  FEATURE_START_AT: 'feature.start_at',
  FEATURE_END_AT: 'feature.end_at',
  CAMERA_ID: 'camera_id',
  LENS_ID: 'lens_id',
  GEO_COORDINATES: 'geo_coordinates',
  LICENSING: 'licensing',
  EXCLUDE_LICENSING_STATUS: 'exclude_licensing_status',
};

/**
 * Paginated API for Photo search
 */
export class PhotoSearch extends API {
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
  async paginatedPhotoIdList({pageNum, pageSize}, search, filters, sort) {
    /*
     * Note: filters ends up a JSONified string of an array of key-value objects
     * [{\"key\":\"feature.name\",\"value\":\"fresh\"},{\"key\":\"category\",\"value\":\"7,14\"}]
     */
    const serializedFilters = filters ? filters.map((filter) => ({
      key: PHOTO_FILTER_TYPE[filter.key],
      value: filter.value,
    })) : [];

    const qs = {
      page: pageNum,
      rpp: pageSize,
      term: search,
      filters: JSON.stringify(serializedFilters),
      sort: SORT_RULES[sort],
    };

    const response = await this.get(`/internal/graphql/photos`, this.tidyQuery(qs));

    return {
      __photoIds: response.ids,
      totalCount: response.total_items,
    };
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
  async paginatedPhotoIdListV2({pageNum, pageSize}, search, filters, sort) {
    const serializedFilters = filters ? filters.map((filter) => ({
      key: PHOTO_FILTER_TYPE[filter.key],
      value: filter.value,
    })) : [];

    const qs = {
      page: pageNum,
      rpp: pageSize,
      term: search,
      filters: JSON.stringify(serializedFilters),
      sort: SORT_RULES[sort],
    };

    logger.info('photoSearchQuery:' + JSON.stringify(qs));
    const response = await this.get(`/internal/graphql/photos`, this.tidyQuery(qs));

    return {
      __photoIds: response.ids,
      totalCount: response.total_items,
      cursors: [1],
    };
  }

  // eslint-disable-next-line require-jsdoc
  async photosAggregationSearch(term, tag, geo, only, exclude, userId, createdAfterDaysAgo, wasFeaturedType, followersCount, sort, page, rpp, imageSize, excludeNude, mediaType, likedBy, category, aggregate, top) {
    const qs = {
      term: term,
      tag: tag,
      geo: geo,
      only: only,
      exclude: exclude,
      user_id: userId,
      created_after_days_ago: createdAfterDaysAgo,
      was_featured_type: wasFeaturedType,
      followers_count: followersCount,
      sort: sort,
      page: page,
      rpp: rpp,
      image_size: imageSize,
      exclude_nude: excludeNude,
      media_type: mediaType,
      liked_by: likedBy,
      category: category,
      aggregate: aggregate,
      top: top,
    };
    return this.get('/v1/photos/aggregate/search', this.tidyQuery(qs));
  }

  // eslint-disable-next-line require-jsdoc
  async photosLikeSearch(term, terms, tag, geo, only, exclude, userId, createdAfterDaysAgo, wasFeaturedType, followersCount, sort, page, rpp, imageSize, excludeNude, mediaType, likedBy, category, camera, lens) {
    const qs = {
      term: term,
      terms: terms,
      tag: tag,
      geo: geo,
      only: only,
      exclude: exclude,
      user_id: userId,
      created_after_days_ago: createdAfterDaysAgo,
      was_featured_type: wasFeaturedType,
      followers_count: followersCount,
      sort: sort,
      page: page,
      rpp: rpp,
      image_size: imageSize,
      exclude_nude: excludeNude,
      media_type: mediaType,
      liked_by: likedBy,
      category: category,
      camera: camera,
      lens: lens,
    };
    return this.get('/v1/photos/search', this.tidyQuery(qs));
  }
}
