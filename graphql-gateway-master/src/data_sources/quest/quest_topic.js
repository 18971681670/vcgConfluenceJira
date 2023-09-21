import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * Logged-in user's licensing photo candidates
 */
export class QuestTopic extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'contest';
  }

  /**
   *
   * @param {*} keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys,
    };
    const response = await this.get(`internal/graphql/quests/findQuestTopicByIds`, qs);
    return keys.map((id) => {
      if (response[id]==null) return null;
      return response[id].map((obj) => {
        if (obj==null) return null;
        return {
          questTopicId: obj.id,
          questId: obj.quest_id,
          inspirationGalleryId: obj.inspiration_gallery_id,
          topicName: obj.name,
          mySubmittedCount: obj.my_submitted_count || 0,
        };
      }) || [];
    });
  }
}
