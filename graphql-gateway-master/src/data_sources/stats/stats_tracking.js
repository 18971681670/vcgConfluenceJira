import {API} from '../base/api';
import {CATEGORY_REVERSE_MAPPING} from '../photo/photo';
import {cloneDeep} from 'lodash';

/**
 * Data source for generic stats data
 */
export class StatsTracking extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'stats';
  }

  /**
   * Send view tracking events
   * @param {Array} views list of view events
   */
  async sendStatsTrackingViewEvent(views) {
    const body = views.map((v) => {
      const event = cloneDeep(v);
      if (event.metadata && event.metadata.category) {
        event.metadata.category = parseInt(CATEGORY_REVERSE_MAPPING[event.metadata.category]);
      }
      return event;
    });
    return this.post(`internal/graphql/sendViewTrackingEvent`, body);
  }
}
