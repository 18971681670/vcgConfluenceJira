import {API} from '../base/api';

/**
 * Paginated API for LicensingRelease resources belonging to current user
 */
export class MyLicensingReleases extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * Get a paginated list of LicensingRelease resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {String} filter The type of release
   */
  async paginatedLicensingReleaseList({pageNum, pageSize}, filter) {
    const qs = {
      page: pageNum,
      size: pageSize,
      filter: filter && filter.toLowerCase(),
    };

    const response = await this.get(`internal/graphql/me/licensingReleases`, this.tidyQuery(qs));
    const __licensingReleases = response.releases.map((obj) => {
      switch (obj.release_type) {
        case 'property':
          return this.siblingDataSources.propertyRelease.reducer(obj);
        case 'model':
          return this.siblingDataSources.modelRelease.reducer(obj);
      }
    });

    return {
      __licensingReleases,
      totalCount: response.total_items,
    };
  }
}
