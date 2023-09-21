import {API} from '../base/api';

/**
 * Data source for generic stats data
 */
export class StatsTrackingV2 extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'tracking-service-v2';
  }


  /**
   * Send view tracking events
   * @param {Array} actions list of view events
   */
  async batchTracking(actions) {
    await this.post(`internal/graphql/tracking`, actions);
  }
}
