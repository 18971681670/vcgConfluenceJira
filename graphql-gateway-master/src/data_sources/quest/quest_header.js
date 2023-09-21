import {API} from '../base/api';
import {logger} from '../../utils/logger';

/**
 * API representing Quest from quest
 */
export class QuestHeader extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'contest';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'QuestHeader';
  }

  /**
   * Whether a resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether Quest resource is queryable. `false` by default.
   */
  get queryable() {
    return true;
  }

  /**
   * Compute the caching hint for a quest
   * @param {*} obj The object
   * @return {*} Caching hint
   */
  cacheHint() {
    // no cache and private for draft quests (internal onely)
    return {
      maxAge: 300,
      scope: 'PUBLIC',
    };
  }

  /**
   * Aysnc fetch QuestHeader resource
   * @return {Promise<Array>} A promise which will return an array of response from API
   */
  async getQuestHeaders() {
    const response = [
      {
        // Purple: https://500px.com/photo/1044683464/very-peri-by-inge-schuster
        __photoId: '1049724709',
        text: 'Challenges to help photographers test their skills, get recognized for their work, and win exciting prizes.',
      },
      {
        // Store guy: https://500px.com/photo/1047647530/light-island-by-alessio-laratta
        __photoId: '169389613',
        text: 'Challenges to help photographers test their skills, get recognized for their work, and win exciting prizes.',
      },
      {
        // Zebra: https://500px.com/photo/1034644219/zebras-in-the-sandstorm-by-anskar-lenzen
        __photoId: '1041602447',
        text: 'Challenges to help photographers test their skills, get recognized for their work, and win exciting prizes.',
      },
    ];
    return response;
  }
}
