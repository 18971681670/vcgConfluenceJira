import {API} from '../base/api';

/**
 * API for getting settings (ie, show_nude) of logged in user
 */
export class UserSettings extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'sitewide-setting';
  }

  /**
   * Get settings.
   *
   * @param {long} userId - The user id
   */
  async getSettings(userId) {
    return await this.get(`/internal/graphql/settings/${userId}`);
  }

  /**
   * Get isBlockedByMe.
   *
   * @param {long} userId - The user id
   */
  async isBlockedByMe(userId) {
    return await this.get(`/internal/graphql/user-block/isBlockedByMe/${userId}`);
  }
}
