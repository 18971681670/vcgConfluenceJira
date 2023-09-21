import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing Flagging from flagging
 */
export class Flagging extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'flagging';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Flagging';
  }

  /**
   * Map API response to Flagging schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      reason: obj.reason,
      reasonDetails: obj.reason_details,
      resolved: obj.resolved,
      createdAt: obj.created_at,

      __creatorUserId: obj.user_id,
    };
  }


  /**
   * reprot comment.
   * @param {Object} input flag comment params
   * @param {ID} input.commentLegacyId comment id which will be flagged.
   * @param {ID} input.commentStatus current comment status.
   * @param {ID} input.commentOwnerLegacyUserId the user legacy id who own the comment.
   */
  async flagComment(input) {
    const body = {
      comment_id: input.commentLegacyId,
      comment_status: input.commentStatus,
      comment_owner_user_id: input.commentOwnerLegacyUserId,
    };
    await this.post('internal/graphql/flagging/comment/flag', body);
  }

  /**
   * report user.
   * @param {Object} input flag user params
   * @param {Sting} input.userLegacyId user id which will be flagged.
   * @param {Integer} input.reason type.
   * @param {Sting} input.reason_details flag details.
   */
  async flagUser(input) {
    const body = {
      resource_id: input.userLegacyId,
      reason: input.reason,
      reason_detail: input.reason_details,
    };
    return this.post('internal/graphql/flagging/user/flag', body);
  }

  /**
   * report gallery.
   * @param {Object} input flag gallery params
   * @param {Sting} input.galleryLegacyId gallery id which will be flagged.
   * @param {Sting} input.galleryOwnerLegacyId gallery owner id which will be flagged.
   * @param {Integer} input.reason type.
   * @param {Sting} input.reason_details flag details.
   */
  async flagGallery(input) {
    const body = {
      resource_id: input.galleryLegacyId,
      resource_owner_id: input.galleryOwnerLegacyId,
      reason: input.reason,
      reason_detail: input.reason_details,
    };
    return this.post('internal/graphql/flagging/gallery/flag', body);
  }

  /**
   * report photo.
   * @param {Object} input flag photo params
   * @param {String} input.photoLegacyId photo id which will be flagged.
   * @param {String} input.phototOwnerLegacyId photo owner id which will be flagged.
   * @param {Integer} input.reason type.
   * @param {String} input.reason_details flag details.
   */
  async flagPhoto(input) {
    const body = {
      resource_id: input.photoLegacyId,
      resource_owner_id: input.photoOwnerLegacyId,
      reason: input.reason,
      reason_detail: input.reason_details,
    };
    return this.post('internal/graphql/flagging/photo/flag', body);
  }

  /**
   * report groupPost.
   * @param {Object} input flag group post params
   * @param {String} input.groupPostLegacyId groupPost id which will be flagged.
   * @param {String} input.groupPosttOwnerLegacyId groupPost owner id which will be flagged.
   * @param {Integer} input.reason type.
   * @param {String} input.reason_details flag details.
   */
  async flagGroupPost(input) {
    const body = {
      resource_id: input.groupPostLegacyId,
      resource_owner_id: input.groupPostOwnerLegacyId,
      reason: input.reason,
      reason_detail: input.reason_details,
    };
    return this.post('internal/graphql/flagging/groupPost/flag', body);
  }

  /**
   * report resource.
   * @param {Object} input flag resource params
   * @param {String} input.resourceLegacyId resource id which will be flagged.
   * @param {String} input.resourceOwnerLegacyId resource owner id which will be flagged.
   * @param {Integer} input.reason type.
   * @param {String} input.reason_details flag details.
   */
  async flagResource(input) {
    const body = {
      resource_id: input.resourceLegacyId,
      resource_owner_id: input.resourceOwnerLegacyId,
      reason: input.reason,
      reason_detail: input.reason_details,
    };
    return this.post('internal/graphql/flagging/resource/flag', body);
  }

  /**
   * to get if a gallery is reported by a login user
   * @param {ID} galleryLegacyId the id of gallery.
   */
  async isGalleryReported(galleryLegacyId) {
    return this.get(`internal/graphql/flagging/gallery/reported?galleryId=${galleryLegacyId}`);
  }
}
