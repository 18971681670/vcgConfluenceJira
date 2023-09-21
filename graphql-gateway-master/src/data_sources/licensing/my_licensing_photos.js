import {API} from '../base/api';

/**
 * Paginated API for LicensingPhoto resources belonging to current user
 */
export class MyLicensingPhotos extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * Get a paginated list of LicensingPhoto resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {string} status The status filter
   * @param {string} sort The sort filter*
   */
  async paginatedLicensingPhotoList({pageNum, pageSize}, status, sort) {
    const qs = {
      page: pageNum,
      size: pageSize,
      status,
      sort,
    };

    const response = await this.get(`internal/graphql/me/licensingPhotos`, this.tidyQuery(qs));

    return {
      __photoIds: response.data,
      totalCount: response.total_items,
    };
  }

  /**
   * Get a paginated list of LicensingPhoto resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {string} status The status filter
   * @param {string} sort The sort filter*
   */
  async paginatedLicensingPhotoListV2({pageNum, pageSize}, status, sort) {
    const qs = {
      page: pageNum,
      size: pageSize,
      status,
      sort,
    };

    const response = await this.get(`internal/graphql/me/licensingPhotosV2`, this.tidyQuery(qs));

    return {
      __photoIds: response.data,
      totalCount: response.total_items,
      cursors: [1],
    };
  }

  /**
   * Get a paginated list of LicensingPhoto resources belonging to  user with userId
   * @param {string} userId query user id.
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {string} status The status filter
   */
  async paginatedLicensingPhotoListByUserId(userId, {pageNum, pageSize}, status) {
    const qs = {
      page: pageNum,
      size: pageSize,
      status,
      user_id: userId,
    };

    const response = await this.get(`internal/graphql/licensingPhotos`, this.tidyQuery(qs));

    return {
      __photoIds: response.data,
      totalCount: response.total_items,
    };
  }

  /**
   * Get the count for profile.
   * @param {Number} userId
   * @param {Boolean} isAdmin
   */
  async countForProfile(userId, isAdmin) {
    const response = await this.get(`internal/graphql/licensingPhotos/${userId}/count?isAdmin=` + isAdmin);
    return response;
  }
}
