import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';
/**
 * Logged-in user's licensing photo candidates
 */
export class Questjudge extends BatchableAPI {
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
    const response = await this.get(`internal/graphql/quests/findQuestsJudgeByIds`, qs);
    return keys.map((id) => {
      if (response[id]==null) return null;
      return response[id].map((obj) => {
        if (obj==null) return null;
        return {
          judgeBio: obj.judge_bio,
          judgeNotIn500px: !!obj.judge_not_in500px,
          personalUrl: obj.personal_url,
          judgeAvatar: obj.judge_avatar,
          judgeName: obj.judge_name,
          judgeId: obj.judge_id,
        };
      }) || [];
    });
  }
}
