import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing Comment from comment
 */
export class Comment extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'comment';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Comment';
  }

  /**
   * Map API response to Comment schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      parentLegacyId: obj.parent_id && obj.parent_id.toString(),
      body: obj.body,
      createdAt: obj.created_at,
      milliAfterCreatedAt: obj.created_at ? (new Date() - new Date(obj.created_at)).toString() : null,

      __photoUserId: obj.to_whom_user_id,
      __replies: obj.replies,
      __creatorUserId: obj.user_id,
    };
  }

  /**
   * Aysnc bulk fetch information of Comment resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    const response = await this.get(`internal/graphql/comments/findByIds`, qs);

    return keys.map((id) => {
      const item = response[id];
      if (item) item.milliAfterCreatedAt = item.created_at ? (new Date() - new Date(item.created_at)).toString() : null;
      return (item || null);
    });
  }


  /**
   * Create comment
   * @param {Object} input Creation params
   * @param {ID} input.photoLegacyId photo id which comment on.
   * @param {ID} input.userLegacyId the user id who own the photo.
   * @param {String} input.commentContent the comment body.
   */
  async create(input) {
    const body = {
      photo_id: input.photoLegacyId,
      comment_content: input.commentContent,
      to_whom_user_id: input.userLegacyId,
    };
    const response = await this.post('internal/graphql/comments/create', body);

    return {
      comment: this.reducer(response),
    };
  }

  /**
   * Create story comment
   * @param {Object} input Creation params
   * @param {ID} input.photoLegacyId photo id which comment on.
   * @param {ID} input.userLegacyId the user id who own the photo.
   * @param {String} input.commentContent the comment body.
   */
  async createForStory(input) {
    const body = {
      story_id: input.photoLegacyId,
      comment_content: input.commentContent,
      to_whom_user_id: input.userLegacyId,
    };
    const response = await this.post('internal/story/comments/create', body);

    return {
      comment: this.reducer(response),
    };
  }

  /**
   *
   * @param {Object} input Creation params
   * @param {ID} input.photoLegacyId photo id which comment on.
   * @param {ID} input.commentLegacyId comment id which be replied.Comment.
   * @param {ID} input.userLegacyId the user id who own the photo.
   * @param {String} input.commentContent the comment body.
   */
  async createOnComment(input) {
    const body = {
      photo_id: input.photoLegacyId,
      replied_comment_id: input.commentLegacyId,
      comment_content: input.commentContent,
      to_whom_user_id: input.userLegacyId,
    };
    const response = await this.post('internal/graphql/comments/reply', body);
    return {
      comment: this.reducer(response),
    };
  }

  /**
   *
   * @param {Object} input Creation params
   * @param {ID} input.photoLegacyId photo id which comment on.
   * @param {ID} input.commentLegacyId comment id which be replied.Comment.
   * @param {ID} input.userLegacyId the user id who own the photo.
   * @param {String} input.commentContent the comment body.
   */
  async addCommentOnStoryComment(input) {
    const body = {
      story_id: input.photoLegacyId,
      replied_comment_id: input.commentLegacyId,
      comment_content: input.commentContent,
      to_whom_user_id: input.userLegacyId,
    };
    const response = await this.post('internal/graphql/story/reply', body);
    return {
      comment: this.reducer(response),
    };
  }

  /**
   *
   * @param {Object} input Deletion params
   * @param {ID} input.commentLegacyId comment id which will be deleted.
   * @param {ID} input.photoOwnerLegacyUserId the user id of photo which the deleted comment belongs to.
   */
  async deleteComment(input) {
    const qs = {
      comment_id: input.commentLegacyId,
      photo_owner_user_id: input.photoOwnerLegacyUserId,
    };

    await this.delete('internal/graphql/comments/delete', qs);
  }
}
