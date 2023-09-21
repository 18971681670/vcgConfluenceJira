import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from Photo to User in photo
 */
export class InGalleriesOnPhoto extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'gallery';
  }

  /**
   * Get a paginated list of Gallery IDs
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {Number} photoId - legacy id of Photo
   * @param {Number} photoOwnerUserId - legacy id of Photo uploader
   */
  async paginatedGalleryList({pageNum, pageSize}, photoId, photoOwnerUserId) {
    const qs = {
      page: pageNum,
      size: pageSize,
      photoOwnerUserId,
    };

    const response = await this.get(`internal/graphql/photos/${photoId}/inGalleries`, this.tidyQuery(qs));
    const __galleries = response.galleries.map((obj) => {
      return this.siblingDataSources.gallery.reducer(obj);
    });

    return {
      __galleries,
      totalCount: response.total_items,
    };
  }


  /**
   * Get a paginated list of Gallery IDs
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {Number} storyId - legacy id of story
   */
  async paginatedGalleryListForStory({pageNum, pageSize}, storyId) {
    const qs = {
      page: pageNum,
      size: pageSize,
      storyId,
    };

    const response = await this.get(`v1/user/story/photos/inGalleries`, this.tidyQuery(qs));
    const __galleries = response.galleries.map((obj) => {
      return this.siblingDataSources.gallery.reducer(obj);
    });

    return {
      __galleries,
      totalCount: response.total_items,
    };
  }
}
