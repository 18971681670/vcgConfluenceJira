import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing SitePromotion from membership
 */
export class SitePromotion extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'membership';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'SitePromotion';
  }

  /**
   * Whether this resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether SitePromotion resource is queryable. `false` by default.
   */
  /*
   * Uncomment if needed
   * get queryable() {
   *   return true;
   * }
   */

  /**
   * Compute the caching hint for a SitePromotion resource.
   *
   * For resources owned by *individual community users*, make sure three different kinds traffic are differentiated:
   * 1) Anonymous visitors: make use `scope: PUBLIC` is used;
   * 2) Logged-in visitors who are not the resource owner: make use `scope: PRIVATE` is used;
   * 3) Logged-in resource owner: make use `scope: PRIVATE` is used.
   *
   * For resources not owned by individual users (i.e., *created by 500px operational team*), such as Quests,
   * Membership Subscriptions, and etc, we can set `scope: PUBLIC`. For some draft resources, you may want to set
   * `scope: PRIVATE`.
   *
   * @param {*} obj The object
   * @return {*} Caching hint
   */
  /*
   * Uncomment if needed
   * cacheHint(obj) {
   *   if (!this.currentUserId) {
   *     // anonymous
   *     return {
   *       maxAge: 600,
   *       scope: 'PUBLIC',
   *     };
   *   } else if (this.currentUserId != obj.user_id) {
   *     // logged-in but not the owner
   *     return {
   *       maxAge: 600,
   *       scope: 'PRIVATE',
   *     };
   *   } else {
   *     // logged-in and the owner
   *     return {
   *       maxAge: 0,
   *       scope: 'PRIVATE',
   *     };
   *   }
   * }
   */

  /**
   * Map API response to SitePromotion schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),
      promoCode: obj.promo_code,
    };
  }

  /**
   * get site promotion if exist, or null.
   */
  async sitePromotion() {
    const __response = await this.get(`internal/graphql/sitePromotion`);
    if (__response) {
      return this.reducer(__response);
    }
    return null;
  };
}
