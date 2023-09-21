import {API} from '../base/api';
import {
  PRIVACY_REVERSE_MAPPING,
} from './photo';

const SORT_RULES = {
  ID_DESC: [
    'id,desc',
  ],
  CREATED_AT_DESC: [
    'createdAt,desc',
  ],
  VIEW_COUNT_DESC: [
    'timesViewed,desc',
    'createdAt,desc',
  ],
  LIKE_COUNT_DESC: [
    'votesCount,desc',
    'createdAt,desc',
  ],
  COMMENT_AND_REPLY_COUNT_DESC: [
    'commentsCount,desc',
    'createdAt,desc',
  ],
  HIGHEST_PULSE_DESC: [
    'highestRating,desc',
    'createdAt,desc',
  ],
};

/**
 * Paginated API for Photo resources belonging to current user
 */
export class MyPhotos extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'photo';
  }

  /**
   * Get the count for profile.
   * @param {Number} userId
   * @param {Boolean} isAdmin
   */
  async countForProfile(userId, isAdmin) {
    const response = await this.get(`internal/graphql/photos/${userId}/count?isAdmin=` + isAdmin);
    return response;
  }

  /**
   * Get a paginated list of Photo resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pegination.pageSize The number of items in a page.
   * @param {number} privacy The privacy filter
   * @param {String} sort The sorting option
   * @param {Object} window A window filter on `created_at`
   * @param {Object} window.from A filter of `created_at >= from`
   * @param {Object} window.to A filter of `created_at < to`
   */
  async paginatedPhotoList({pageNum, pageSize}, privacy, sort, {from, to} = {}) {
    const qs = {
      page: pageNum,
      size: pageSize,
      privacy: PRIVACY_REVERSE_MAPPING[privacy],
      sort: SORT_RULES[sort],
      from,
      to,
    };

    const response = await this.get(`internal/graphql/me/photos`, this.tidyQuery(qs));

    const __photos = response.data.map((obj) => {
      return this.siblingDataSources.photo.reducer(obj);
    });

    return {
      __photos,
      totalCount: response.total_items,
    };
  }

  /**
   * userPaginatedPhotoList
   * @param {number} pageNum
   * @param {number} pageSize
   * @param {number} from
   * @param {number} to
   * @param {number} userId
   * @return {*} photo list
   */
  async userPaginatedPhotoList( pageNum, pageSize, from, to, userId) {
    const qs = {
      page: pageNum,
      size: pageSize,
      privacy: PRIVACY_REVERSE_MAPPING['ALL'],
      sort: SORT_RULES['CREATED_AT_DESC'],
      from,
      to,
    };

    const response = await this.get(`internal/graphql/me/photos`, this.tidyQuery(qs), {
      headers: {
        'x-500px-user-id': userId,
      },
    });

    const __photos = response.data.map((obj) => {
      return this.siblingDataSources.photo.reducer(obj);
    });

    return {
      __photos,
      totalCount: response.total_items,
    };
  }

  /**
   * photoDownloadUrl
   * @param {Object} photoIds
   * @return {Object} download url map
   */
  async photoDownloadUrl(photoIds) {
    const response = await this.post(`internal/graphql/photoDownUrl/findByIds`, photoIds);

    return response;
  }

  /**
   * getDownloadUrlByPhotoId
   * @param {Long} photoId
   * @param {Boolean} licensingDownload
   * @return {String} download url
   */
  async getDownloadUrlByPhotoId(photoId, licensingDownload) {
    return await this.get(`internal/graphql/photoDownUrl/findByPhotoId`, {photoId, licensingDownload});
  }

  /**
   * photoResizeImages
   * @param {Array} photos
   * @param {number} userId
   * @return {Array} ResizeImages
   */
  async photoResizeImages(photos, userId) {
    const url = `internal/graphql/photoResizeImages/findByIds`;
    const response = await this.post(url, photos, {
      headers: {
        'x-500px-user-id': userId,
      },
    });

    return response;
  }

  /**
   * Get a paginated list of Photo resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pegination.pageSize The number of items in a page.
   * @param {number} privacy The privacy filter
   * @param {number} excludeNude The nude filter
   * @param {String} sort The sorting option
   * @param {number} userId The user id
   * @param {Object} window A window filter on `created_at`
   * @param {Object} window.from A filter of `created_at >= from`
   * @param {Object} window.to A filter of `created_at < to`
   */
  async paginatedUserPhotoList({pageNum, pageSize}, privacy, excludeNude, sort, userId, {from, to} = {}) {
    const qs = {
      page: pageNum,
      size: pageSize,
      privacy: PRIVACY_REVERSE_MAPPING[privacy],
      excludeNude,
      sort: SORT_RULES[sort],
      from,
      to,
    };

    const response = await this.get(`internal/graphql/user/${userId}/photos`, this.tidyQuery(qs));

    const __photos = response.data.map((obj) => {
      return this.siblingDataSources.photo.reducer(obj);
    });

    return {
      __photos,
      totalCount: response.total_items,
    };
  }
}
