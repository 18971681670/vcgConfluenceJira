import {API} from '../base/api';

/**
 * Paginated API for Photo resources
 */
export class UserPhotos extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'photo';
  }

  /**
   * Get a paginated list of Photo resources belonging to user of photo
   * @param {number} size The number of items returned (first or last)
   * @param {boolean} previous whether to use before (defaults to after)
   * @param {string} cursor cursor for the next fetch (none for first)
   * @param {string} legacyId legacy photo id around which to search
   */
  async cursorPaginatedPhotoIdList({cursor, size, previous, legacyId}) {
    const qs = {
      previous,
      size,
      cursor,
    };

    const response = await this.get(`/internal/graphql/photos/${legacyId}/photoIds`, this.tidyQuery(qs));

    const pageInfo = {
      hasNextPage: response.page_info.has_next_page,
      hasPreviousPage: response.page_info.has_previous_page,
      startCursor: response.page_info.start_cursor,
      endCursor: response.page_info.end_cursor,
    };

    const photoIds = [];
    const cursors = [];
    response.cursors.map((cursorObj) => {
      const photoId = Object.keys(cursorObj)[0];
      photoIds.push(photoId);
      cursors.push(cursorObj[photoId]);
    });

    return {
      photoIds,
      cursors,
      pageInfo,
      totalCount: response.total,
    };
  }
}
