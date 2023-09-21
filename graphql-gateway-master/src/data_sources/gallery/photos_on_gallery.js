import {atob} from '../../utils/base64';
import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from Gallery to Photo in gallery
 */
export class PhotosOnGallery extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'gallery';
  }

  /**
   * Get a paginated list of Photo ids and cursors in gallery
   * @param {String} cursor - the initial cursor.
   * @param {number} size - rpp.
   * @param {number} galleryId - legacy id of gallery.
   * @param {boolean} before - 'before' this cursor.
   * @param {boolean} inclusive - whether item in cursor should be returned.
   */
  async cursorPaginatedPhotoIdList({cursor, size, previous, legacyId, inclusive}) {
    const qs = {
      cursor: cursor || null,
      size,
      before: previous,
    };

    /*
     * FIXME: Fix this by supporting inclusive in the MS directly
     * Broken by 75b37196585dc54fe23cdb6b6d21200e4a387a60 in gallery MS
     */
    const shouldFetchFirstPhoto = cursor && !previous && inclusive;

    const response = await this.get(`internal/graphql/galleries/${legacyId}/photos`, this.tidyQuery(qs));

    const cursors = response.cursors || [];
    let startCursor = null;
    let endCursor = null;
    if (cursors.length > 0) {
      startCursor = previous ? cursors[cursors.length - 1] : cursors[0];
      endCursor = previous ? cursors[0] : cursors[cursors.length - 1];
    }

    const photoIds = response.ids;
    if (shouldFetchFirstPhoto) {
      const firstPhotoId = atob(cursor).split(',')[1];
      startCursor = cursor;
      photoIds.unshift(firstPhotoId);
      cursors.unshift(cursor);
    }

    // FIXME: May be broken by trying to wedge in the first item
    const pageInfo = {
      hasNextPage: response.has_next_page,
      hasPreviousPage: response.has_previous_page,
      startCursor,
      endCursor,
    };

    return {
      photoIds,
      cursors,
      pageInfo,
      totalCount: response.total_count,
    };
  }

  /**
   * Get a paginated list of Photo IDs (Legacy, dont use!)
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {Number} galleryId Internal ID of Gallery
   */
  async legacyPaginatedPhotoIdList({pageNum, pageSize}, galleryId) {
    const qs = {
      page: pageNum,
      size: pageSize,
    };

    const response = await this.get(`internal/graphql/galleries/${galleryId}/legacyphotos`, this.tidyQuery(qs));

    return {
      __photoIds: response.photo_ids,
      totalCount: response.total_items,
    };
  }

  /**
   * Get a paginated list of Photo IDs those were newly added since gallery was last published.
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {Number} galleryId Internal ID of Gallery
   */
  async paginatedNewlyAddedPhotoIdList({pageNum, pageSize}, galleryId) {
    const qs = {
      page: pageNum,
      size: pageSize,
    };

    const response = await this.get(`internal/graphql/galleries/${galleryId}/photos/new`, this.tidyQuery(qs));

    return {
      __photoIds: response.photo_ids,
      totalCount: response.total_items,
    };
  }

  /**
   * Add Photos resource to a Gallery
   * @param {Object} input Input
   * @param {Number} input.photoLegacyIds Photo IDs
   * @param {Number} input.galleryLegacyId Gallery ID
   */
  async add({galleryLegacyId, photoLegacyIds}) {
    await this.post(`/internal/graphql/galleries/${galleryLegacyId}/photos`, photoLegacyIds);
  }

  /**
   * Add all Photos of a gallery to another Gallery
   * @param {Object} input Input
   * @param {Number} input.fromGalleryLegacyId from Gallery ID
   * @param {Number} input.toGalleryLegacyId to Gallery ID
   */
  async addGalleryPhotos({fromGalleryLegacyId, toGalleryLegacyId}) {
    await this.post(`/internal/graphql/galleries/add/${fromGalleryLegacyId}/photos/${toGalleryLegacyId}`);
  }

  /**
   * Remove a Photo resource from a Gallery
   * @param {Object} input Input
   * @param {Number} input.photoLegacyId Photo ID
   * @param {Number} input.galleryLegacyId Gallery ID
   */
  async remove({galleryLegacyId, photoLegacyId}) {
    await this.delete(`/internal/graphql/galleries/${galleryLegacyId}/photos/${photoLegacyId}`);
  }

  /**
   * batch remove Photos resource to a Gallery
   * @param {Object} input Input
   * @param {Number} input.photoLegacyIds Photo IDs
   * @param {Number} input.galleryLegacyId Gallery ID
   */
  async batchRemove({galleryLegacyId, photoLegacyIds}) {
    await this.post(`/internal/graphql/galleries/${galleryLegacyId}/photos/batch`, photoLegacyIds);
  }

  /**
   * Rearrange the order of photos in a gallery.
   * @param {Object} input
   */
  async rearrangeGalleryPhoto(input) {
    await this.put(`internal/graphql/me/gallery/photos/rearrange`, input);
  }
}
