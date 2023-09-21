import {Node} from '../base/node';

/**
 * Paginated API for One Conversation Feed Message belong to One Conversation
 */
export class ConversationFeedMessage extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'messenger-expermental';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'ConversationMessage';
  }

  /**
   * Map API response
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    let __resolveType;
    let __photoId;
    let __galleryId;
    let __profileId;
    let __questId;
    let __resourceId;

    switch (obj.kind) {
      case 'TEXT':
        __resolveType = 'TextMessage';
        break;
      case 'PHOTO':
        __resolveType = 'PhotoMessage';
        __photoId = obj.content.photo.photoId;
        break;
      case 'PROFILE':
        __resolveType = 'UserprofileMessage';
        __profileId = obj.content.profile.userId;
        break;
      case 'GALLERY':
        __resolveType = 'GalleryMessage';
        __galleryId = obj.content.gallery.galleryId;
        break;
      case 'QUEST':
        __resolveType = 'QuestMessage';
        __questId = obj.content.quest.questId;
        break;
      case 'RESOURCE':
        __resolveType = 'ResourceMessage';
        __resourceId = obj.content.resource.resourceId;
        break;
      default:
        __resolveType = 'TextMessage';
    }

    return {
      ...super.idReducer(obj.id),

      read: obj.read,
      createdAt: obj.createdAt,
      kindContent: obj.content,
      messageType: obj.kind,
      __senderId: obj.sender,
      __receiverId: obj.receiver,
      __resolveType,
      __photoId,
      __galleryId,
      __profileId,
      __questId,
      __resourceId,
    };
  }

  /**
   * a conversation messgae feed
   *
   * @param {*} param0
   * @param {*} conversationId
   */
  async conversationMessage({exclusiveStartKey, size}, conversationId) {
    const qs = {
      toUserId: conversationId,
      cursor: exclusiveStartKey,
      rpp: size,
    };

    const response = await this.get(`chat/message`, this.tidyQuery(qs));

    const __messages = response.data.map((item) => this.reducer(item));

    return {
      __lastEvaluatedKey: response.cursor,
      __messages,
    };
  }
}
