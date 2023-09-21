import {internalToGlobalId} from '../../utils/global_id';
import {API} from '../base/api';


/**
 * API representing Profile Groups from monolith
 */
export class ProfileGroups extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return process.env.MONOLITH_URL || '500px.com';
  }

  /**
   * Get the internal service base url per microservice
   * @return {string} The base URL
   */
  get baseURL() {
    return `https://${this.serviceName}/`;
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'ProfileGroups';
  }

  /**
   * Compute the caching hint
   * @param {*} obj The object
   * @return {*} Caching hint
   */
  cacheHint(obj) {
    return {
      maxAge: 600,
      scope: 'PUBLIC',
    };
    return obj;
  }

  /**
   * Map API response to schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      groups: obj.map((group) => ({
        ...group,
        id: internalToGlobalId(this.resourceType, group.id),
        legacyId: group.id,
      })),
    };
  }

  /**
   *
   * @param {*} username Username of a user
   */
  async getGroups(username) {
    return await this.get(`${username}/groups.json`);
  }
}
