/* eslint-disable */
import {Node} from '../base/node';

/**
 * API representing Config objects
 */
export class Config extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'config-service';
  }

  /**
   * Config Service
   */
  get resourceType() {
    return 'Config';
  }

  /**
   * Map API response
   * @param {ConfigAPIResponse} obj An item from API response
   * @return {Remote Config} An object under GraphQL schema
   */
  reducer({env, ...obj}) {
   obj.id = obj.remoteConfig.clientApplicationId;
    return {
      ...super.reducer(obj),
      clientId: obj.remoteConfig.clientApplicationId,
      timestamp: obj.remoteConfig.timestamp,
      lastSupportedAndroidVersion: obj.remoteConfig.lastSupportedAndroidVersion,
      updateBannerMinVersion: obj.remoteConfig.updateBannerMinVersion,
      updateBannerMaxVersion: obj.remoteConfig.updateBannerMaxVersion,
      unsupportedAndroidVersionMessage: obj.remoteConfig.unsupportedAndroidVersionMessage,
      emailVerificationCutOffTimestamp: obj.remoteConfig.emailVerificationCutOfTimestamp,
      blacklist: obj.remoteConfig.blackList,
      envStore: env,
      versionSupport: obj.remoteConfig.versionDetail
    };
  }

  /**
   * Get remote config for specific client application id specified in header
   *
   * @param {id} clientId
   * @param version
   * @return {RemoteConfig} The remote config for specific client Application Id
   */
  async getByClientId(clientId, version) {
    const remoteConfig = await this.get(`/internal/config`,this.tidyQuery({clientId, version}));
    const {env, clientApplicationId} = await this.get(`/internal/config/env`, this.tidyQuery({clientId}))
    return this.reducer({remoteConfig, env});
  };

  /**
     * Create/Update a Remote Config
     *
     * @param {Int} clientId The client Application Id
     * @param {object} input RemoteConfigInput
     * @return {RemoteConfig} The created/updated config for specific application Id
     */
    async updateConfig(clientId, input) {
      const remoteConfig = await this.put(`internal/config/properties?clientId=`+clientId, input);
      const {env, clientApplicationId} = await this.get(`/internal/config/env`, this.tidyQuery({clientId}));
      return this.reducer({remoteConfig, env});
    }

 /**
     * Create/Update only blacklist of mobile config
     *
     * @param {Int} clientId The client Application Id
     * @param {object} with words to add to addToBlacklist and words to remove from removeFromBlacklist
     * @return {RemoteConfig} The created/updated blacklist in config for specific application Id
     */
    async updateBlacklist(clientId, input) {
      const remoteConfig = await this.put(`internal/config/blacklist?clientId=`+clientId, input);
      const {env, clientApplicationId} = await this.get(`/internal/config/env`, this.tidyQuery({clientId}));
      return this.reducer({remoteConfig, env});
    }

};
