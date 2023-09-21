import {API} from '../base/api';

/**
 * Data source for generic stats data
 */
export class ServiceGlobalStatsData extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Get the last updated at timestamp
   * @return {Promise<String>} ISO timestamp
   */
  async getLastUpdatedTime() {
    const response = await this.get(`/internal/graphql/me/lastUpdatedAt`);

    return response.last_updated_at;
  }
}
