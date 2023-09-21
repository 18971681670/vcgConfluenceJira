import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing LicensingContributor from licensing
 */
export class LicensingContributor extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'LicensingContributor';
  }

  /**
   * Map API response to LicensingContributor schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      signed: obj.contributor_activation_status == 1,
      signedAt: obj.contributor_activation_status == 1 ? obj.enable_or_disable_time : null,
      __metAutoLicensingCriteria: obj.met_auto_licensing_criteria,
      __autoLicensingSettingUpdatedAt: obj.auto_licensing_setting_updated_at,
      autoLicensingSetting: obj.auto_licensing_setting,
    };
  }

  /**
   * Aysnc bulk fetch information of LicensingContributor resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const lookupById = {};

    // Convert to string for .includes check
    keys = keys.map((key) => key.toString());

    if (this.currentUserId && keys.includes(this.currentUserId.toString())) {
      const response = await this.get(`internal/graphql/licensingContributors/info`);
      lookupById[response.id] = response;
    }

    return keys.map((id) => {
      return (lookupById[id] || null);
    });
  }

  /**
   * Sign the licensing agreement
   * @return {Object} The licensing contributor object
   */
  async create() {
    const response = await this.post('internal/graphql/licensingContributors');

    return this.reducer(response);
  }

  /**
   * Update Auto Licensing Setting
   * @param {string} setting Auto Licensing Setting
   * @return {Object} The licensing contributor object
   */
  async updateAutoLicensingSetting(setting) {
    const body = {
      autoLicensingSetting: setting,
    };
    const response = await this.post('internal/graphql/licensingContributors/updateAutoLicensingSetting', body);
    return this.reducer(response);
  }
}
