import {API} from '../base/api';

/**
 * Paginated API for Gallery resources belonging to current user
 */
export class MyGalleries extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'gallery';
  }

  /**
   * Get a paginated list of Gallery resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {String} sort Sorting option
   * @param {String} search Fuzzy name searching option
   * @param {Boolean} showNude Option to show nude
   */
  async paginatedGalleryList({pageNum, pageSize}, sort, search, showNude) {
    /*
     * TODO: Temporary workaround for microservice auth issues
     * microservice returns all galleries for everyone if user is null
     */
    const userId = this.currentUserId;
    if (null == userId) {
      return {
        __galleries: [],
        totalCount: 0,
      };
    }

    const qs = {
      page: pageNum,
      size: pageSize,
      name: search,
      showNude,
      sort,
    };

    const response = await this.get(`internal/graphql/me/galleries`, this.tidyQuery(qs));
    const __galleries = response.galleries.map((obj) => {
      return this.siblingDataSources.gallery.reducer(obj);
    });

    return {
      __galleries,
      totalCount: response.total_items,
    };
  }

  /**
   * Get a paginated list of Gallery resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {String} sort Sorting option
   * @param {String} search Fuzzy name searching option
   * @param {Boolean} showNude Option to show nude
   * @param {String} privacy privacy option
   */
  async paginatedGalleryListV2({pageNum, pageSize}, sort, search, showNude, privacy) {
    /*
     * TODO: Temporary workaround for microservice auth issues
     * microservice returns all galleries for everyone if user is null
     */
    const userId = this.currentUserId;
    if (null == userId) {
      return {
        __galleries: [],
        totalCount: 0,
      };
    }

    const qs = {
      page: pageNum,
      size: pageSize,
      name: search,
      showNude,
      sort,
      privacy,
    };

    const response = await this.get(`internal/graphql/me/galleries`, this.tidyQuery(qs));
    const __galleries = response.galleries.map((obj) => {
      return this.siblingDataSources.gallery.reducer(obj);
    });

    return {
      __galleries,
      totalCount: response.total_items,
      cursors: [1],
    };
  }

  /**
   * Get list of My Gallery ids of some photos
   * @param {keys} keys photoLegacyIds
   */
  async myGalleryIdOfPhotos(keys) {
    const qs = {
      ids: keys.join(','),
    };
    const response = await this.get(`internal/graphql/galleries/findGalleryIdsByPhotos`, this.tidyQuery(qs));

    return keys.map((key) => {
      return {
        photoLegacyId: key,
        gallerylegacyIds: response[key] || [],
      };
    });
  }

  /**
   * rearrange the display order of a user's gallery in gallery list.
   * @param {Object} input
   */
  async rearrageGallery(input) {
    await this.put(`internal/graphql/me/galleries/rearrange`, input);
  }

  /**
   * update private galleries without a token
   * @param {Object} galleryIds list of gallery ids
   */
  async backfillPrivateGalleryTokens({galleryIds}) {
    const qs = {
      galleryIds: galleryIds.join(','),
    };
    return await this.post(`/internal/graphql/galleries/backfillPrivateToken`, this.tidyQuery(qs));
  }
}
