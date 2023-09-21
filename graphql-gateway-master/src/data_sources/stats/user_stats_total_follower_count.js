import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing User Stats totalFollowerCount at a specific time
 */
export class UserStatsTotalFollowerCount extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Get the followerCount within the given time frame
   * @param {String} at ISO timestamp
   * @return {Number} followerCount
   */
  async loadData(at) {
    const qs = {
      until: at,
    };
    return await this.get(`internal/graphql/me/userStats/totalFollowerCount/until`, this.tidyQuery(qs));
  }
}
