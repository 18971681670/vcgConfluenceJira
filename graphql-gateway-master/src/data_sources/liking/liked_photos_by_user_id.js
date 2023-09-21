import {API} from '../base/api';

/**
 * Liking
 */
export class LikedPhotos extends API {
  /**
   * Description
   */
  get serviceName() {
    return 'liking';
  }

  /**
   * Get paginated list of photo ids
   * @param {Object} dynamo Db Cursor and pageSize
   * @param {String} currentUserId
   */
  async paginatedLikedPhotoIdsList({dynamoDbCursor, pageSize, sort}, currentUserId) {
    if (!currentUserId) {
      return {
        photoIds: [],
        lastPageCursor: undefined,
      };
    }

    const qs = this.tidyQuery({
      size: pageSize,
      cursor: dynamoDbCursor,
      sort: sort,
    });

    const response = await this.get(`internal/graphql/photos/${currentUserId}/likedPhotos`, qs);

    return {
      photoIds: response.photo_ids,
      lastPageCursor: response.last_evaluated_key,
    };
  }

  // eslint-disable-next-line require-jsdoc
  async paginatedLikedResourceList({dynamoDbCursor, pageSize, sort, filter}, currentUserId) {
    if (!currentUserId) {
      return {
        resourceIds: [],
        lastPageCursor: undefined,
      };
    }

    const qs = this.tidyQuery({
      size: pageSize,
      cursor: dynamoDbCursor,
      sort: sort,
      resourceType: filter,
    });

    const response = await this.get(`/internal/graphql/resource/${currentUserId}/likedList`, qs);

    return {
      resourceIds: response.photo_ids,
      lastPageCursor: response.last_evaluated_key,
    };
  }

  /**
   * judge user has liked data or not.
   * @param {Long} currentUserId currentUserId
   * @return {Boolean} userHasLikedData
   */
  async userHasLikedData(currentUserId) {
    if (!currentUserId) {
      return false;
    }

    const response = await this.get(`/internal/graphql/resource/${currentUserId}/hasLiked`);

    return response;
  }
}
