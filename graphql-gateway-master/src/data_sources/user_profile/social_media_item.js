import {Node} from '../base/node';

/**
 * API representing SocialMedia from user_profile
 */
export class SocialMediaItem extends Node {
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
    return 'SocialMediaItem';
  }

  /**
   * Map API response to SocialMediaItem schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      name: obj.provider_name,
      value: obj.contact,
      visible: obj.visible,
    };
  }

  /**
   * update user social media
   * @param {Array} socialMediaItems a socialMediaItem input array
   */
  async updateItems(socialMediaItems) {
    if (!socialMediaItems) {
      return;
    }
    const tabs = socialMediaItems.map((tab) => {
      return {
        provider_name: tab.name,
        contact: tab.value ? tab.value : '',
        visible: tab.visible,
      };
    });
    return await this.patch(`internal/graphql/userProfile/socialMediaItems`, tabs);
  }

  /**
   * Get a sociaMediaItem array within the given id
   * @param {int} __internalId
   * @param {Array} providers an array of SocialMediaEnum
   * @return {Object} A sociaMediaItem
   */
  async loadItemByProvider(__internalId, providers) {
    const arrays = await this.get(`internal/graphql/userProfile/socialMediaItems`, {userid: __internalId});
    const respArray = [];
    const respMap = {};
    arrays.forEach((item) => {
      if (providers.includes(item.provider_name)) respMap[item.provider_name] = this.reducer(item);
    });
    providers.forEach((provider) => {
      if (respMap.hasOwnProperty(provider)) respArray.push(respMap[provider]);
      else respArray.push({name: provider, value: '', visible: true, id: '', legacyId: '0'});
    });
    return respArray;
  }

  /**
   * Get the sociamedia info within the given id
   * @param {int} __internalId
   * @return {Array} A promise which will return an array of response from API corresponding
   */
  async loadData(__internalId) {
    const response = await this.get(`internal/graphql/userProfile/socialMediaItems`, {userid: __internalId});
    return response.map((tab) => this.reducer(tab));
  }
}
