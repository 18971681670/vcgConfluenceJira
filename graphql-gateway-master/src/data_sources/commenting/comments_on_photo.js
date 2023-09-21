import {API} from '../base/api';
// import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from Photo to Comment in commenting
 */
export class CommentsOnPhoto extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'comment';
  }

  /**
   * Get a paginated list of Comment resources
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {Number} photoId Internal ID of Photo
   */
  async paginatedCommentList({pageNum, pageSize}, photoId) {
    const qs = {
      page: pageNum,
      size: pageSize,
    };

    const response = await this.get(`internal/graphql/photos/${photoId}/comments`, this.tidyQuery(qs));
    const __comments = response.comments.map((obj) => {
      return this.siblingDataSources.comment.reducer(obj);
    });

    return {
      __comments,
      totalCount: response.total_items,
    };
  }

  /**
   * Get a paginated list of Comment resources
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {Number} photoId Internal ID of Photo
   */
  async paginatedStoryCommentList({pageNum, pageSize}, photoId) {
    const qs = {
      page: pageNum,
      size: pageSize,
    };

    const response = await this.get(`internal/graphql/story/${photoId}/comments`, this.tidyQuery(qs));
    const __comments = response.comments.map((obj) => {
      return this.siblingDataSources.comment.reducer(obj);
    });

    return {
      __comments,
      totalCount: response.total_items,
    };
  }
}
