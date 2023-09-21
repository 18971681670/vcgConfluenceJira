import {Node} from '../base/node';

/**
 * Message Operation.
 */
export class Message extends Node {
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
    return 'message';
  }

  /**
   * Map API response
   * @param {*} obj
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
   * direct combine message.
   *
   * @param {*} param0
   */
  async directCombileMessage({id, sender, receiver, kind, read, content, createdAt}) {
    const obj = {
      id: id,
      sender: sender,
      receiver: receiver,
      kind: kind,
      read: read,
      content: JSON.parse(content),
      createdAt: createdAt,
    };
    return this.reducer(obj);
  }

  /**
   * send text message
   *
   * @param {*} recieverId
   * @param {*} message
   */
  async sendText(recieverId, message) {
    const response = await this.post(`chat/message/send/text/to/${recieverId}`, message);
    return this.reducer(response);
  }

  /**
   * send photo message
   *
   * @param {*} receiverId
   * @param {*} photoId
   */
  async sendPhoto(receiverId, photoId) {
    const photoBody = {
      photoId: photoId,
    };

    const response = await this.post(`chat/message/send/photo/to/${receiverId}`, photoBody);
    return this.reducer(response);
  }

  /**
   * send gallery message
   *
   * @param {*} receiverId
   * @param {*} galleryId
   */
  async sendGallery(receiverId, galleryId) {
    const galleryBody = {
      galleryId: galleryId,
    };

    const response = await this.post(`chat/message/send/gallery/to/${receiverId}`, galleryBody);
    return this.reducer(response);
  }

  /**
   * send user profile message
   *
   * @param {*} receiverId
   * @param {*} profileId
   */
  async sendUserProfile(receiverId, profileId) {
    const profileBody = {
      userId: profileId,
    };

    const response = await this.post(`chat/message/send/profile/to/${receiverId}`, profileBody);
    return this.reducer(response);
  }

  /**
   * send quest message.
   * @param {*} receiverId
   * @param {*} questId
   */
  async sendQuest(receiverId, questId) {
    const questBody = {
      questId: questId,
    };

    const response = await this.post(`chat/message/send/quest/to/${receiverId}`, questBody);

    return this.reducer(response);
  }

  /**
   * send resource message.
   *
   * @param {*} receiverId
   * @param {*} resourceId
   */
  async sendResource(receiverId, resourceId) {
    const resourceBody = {
      resourceId: resourceId,
    };

    const response = await this.post(`chat/message/send/resource/to/${receiverId}`, resourceBody);

    return this.reducer(response);
  }

  /**
   * delete user inbox conversation, don't delete message history.
   * @param {*} toUserIds
   */
  async deleteUserConverstaion(toUserIds) {
    await this.delete(`chat/conversation/delete/inbox?toUserIds=${toUserIds}`);
    return 'ok';
  }

  /**
   * maintain user relationship, create new relationship or change stranger to friend
   *
   * @param {*} toUserId
   * @param {*} youFollowing
   * @param {*} heFollowing
   */
  async userRelation(toUserId) {
    const obj = await this.post(`chat/relation/${toUserId}`);

    return {
      ...super.idReducer(obj.conversationId),

      conversationId: obj.conversationId,
      userId: obj.fromUserId,
      toUserId: obj.toUserId,
      unreadCount: 0,
      lastlyMessage: null,
      lastlyMessageTime: null,
    };
  }
}
