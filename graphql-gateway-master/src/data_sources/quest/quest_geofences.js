import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';
/**
 * Logged-in user's licensing photo candidates
 */
export class QuestGeofences extends BatchableAPI {
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

    const response = await this.get(`internal/graphql/quests/findGeofencesByIds`, qs);

    return keys.map((id) => {
      const geofences = response[id] || [];
      return geofences.map((g) => g.country_code);
    });
  }

  /**
   * Overwrite geo fences
   * @param {*} internalId  Internal photo id
   * @param {Array<String>} geofences Tags to overwrite
   */
  async update(internalId, geofences) {
    if (!geofences) {
      return;
    }

    const body = geofences;

    return await this.post(`internal/graphql/quests/${internalId}/geofences`, body);
  }
}
