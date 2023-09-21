import {Node} from '../base/node';

/**
 * Paginated API for Conversation List belonging to current user
 */
export class MyConversationList extends Node {
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
    return 'InboxConversation';
  }

  /**
   * Map API response
   * @param {Object} obj An item from API response
   * @param {Boolean} isFriend a field tag of user relationship
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj, isFriend) {
    return {
      ...super.idReducer(obj.conversationId),

      conversationId: obj.conversationId,
      userId: obj.userId,
      toUserId: obj.toUserId,
      unreadCount: obj.unreadCount,
      lastlyMessage: obj.lastlyMessage,
      lastlyMessageTime: obj.lastlyMessageTime,
      isFriend: isFriend,
    };
  }

  /**
   * get conversation list.
   *
   * @param {*} ddbPagination
   */
  async conversationList({exclusiveStartKey, size}) {
    const qs = {
      cursor: exclusiveStartKey,
      rpp: size,
    };

    const response = await this.get(`chat/conversation/friends/list`, this.tidyQuery(qs));

    const __inboxInfo = response.data.map((item) => this.reducer(item, true));

    return {
      __lastEvaluatedKey: response.cursor,
      __inboxInfo,
    };
  }

  /**
   * search my inbox list.
   *
   * @param {*} param page param
   * @param {*} text  search text
   */
  async searchConversationList({pageNum, pageSize}, text) {
    const qs = {
      searchName: text,
      page: pageNum,
      rpp: pageSize,
    };

    const response = await this.get(`chat/conversation/friends/search`, this.tidyQuery(qs));
    const __inboxInfo = response.data.map((item) => this.reducer(item, true));

    return {
      __inboxInfo,
      totalCount: response.total,
    };
  }

  /**
   * get stranger list conversations.
   */
  async strangerConversationList() {
    const response = await this.get(`chat/conversation/stranger/list`);

    const __inboxInfo = response.map((item) => this.reducer(item, false));

    return {
      __lastEvaluatedKey: '',
      __inboxInfo,
    };
  }


  /**
   * get stranger total conversation.
   */
  async totalStrangerCnt() {
    return await this.get(`chat/conversation/stranger/total`);
  }
}
