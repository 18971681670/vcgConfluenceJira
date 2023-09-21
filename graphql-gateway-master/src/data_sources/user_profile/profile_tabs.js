import {Node} from '../base/node';

/**
 * API representing ProfileTabs from user_profile
 */
export class ProfileTabs extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'userprofile';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'ProfileTabs';
  }


  /**
   * Map API response to ProfileTabs schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    const parsed = JSON.parse(obj);
    const tabs = parsed.map((tab) => {
      return {
        name: tab.name.toUpperCase(),
        visible: tab.visible,
      };
    });
    return {tabs};
  }

  /**
   * Get default tab set.
   * @return {Object} Default tab set.
   */
  async getDefaultTabs() {
    return Promise.resolve(this.reducer('[{"name":"photos","visible":true},{"name":"galleries","visible":true},{"name":"stories","visible":true},{"name":"licensing","visible":true},{"name":"resume","visible":false},{"name":"about","visible":true}]'));
  }

  /**
   * Get the profile tabs within the given id
   * @param {userId} userId userId
   * @return {ProfileTabs}
   */
  async getTabs(userId) {
    const response = await this.get(`internal/profile/tabs/${userId}`);
    return this.reducer(response);
  }

  /**
   * update user profile tabs
   * @param {ProfileTabs} profileTabs
   */
  async update(profileTabs) {
    const tabs = profileTabs.map((tab) => {
      return {
        name: tab.name.toLowerCase(),
        visible: tab.visible,
      };
    });
    const response = await this.put(`internal/profile/tabs`, tabs);
    return this.reducer(response);
  }

  /**
   * update one user profile tab
   * @param {ProfileTab} profileTab
   */
  async updateOneTab({name, visible}) {
    const tab = {
      name: name.toLowerCase(),
      visible,
    };
    const response = await this.patch(`internal/profile/tab`, tab);
    return this.reducer(response);
  }
}
