import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing SocialMedia from user_profile
 */
export class TosAcceptance extends Node {
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
    return 'TosAcceptance';
  }

  /**
   * Map API response to SocialMedia schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      // from JSON fields to GraphQL schema fields
      documentName: obj.document_name,
      signingTimestamp: obj.signing_timestamp,
      ip: obj.ip,
    };
  }

  /**
   * Get the sociamedia info within the given id
   * @param {int} __internalId
   * @return {SocialMedia}
   */
  async loadData(__internalId) {
    const response = await this.get(`internal/graphql/userProfile/tosAcceptance`, {userid: __internalId});
    if (null==response) {
      return {};
    } else {
      return this.reducer({
        ...response,
        id: __internalId,
      });
    }
  }
}
