import {Node} from '../base/node';
import {logger} from '../../utils/logger';
import {reverseLookupTable} from '../../utils/misc';

export const TIER_MAPPING = {
  0: 'BASIC',
  1: 'AWESOME',
  2: 'PRO',
  3: 'IOS_UNLIMITED_UPLOAD',
};

export const TIER_REVERSE_MAPPING = reverseLookupTable(TIER_MAPPING);

/**
 * API representing Membership from membership
 */
export class Membership extends Node {
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
    return 'Membership';
  }

  /**
   * Map API response to Membership schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    obj.id = obj.user_id;

    return {
      ...super.reducer(obj),
      tier: obj.tier.toUpperCase(),
      paymentStatus: (obj.tier.toUpperCase() == 'BASIC') ? null : obj.payment_status && obj.payment_status.toUpperCase(),
      autoRenewal: (obj.auto_renewal == null? false : obj.auto_renewal),
      startDate: obj.start_date,
      expiryDate: obj.expiry_date,
      period: (obj.tier.toUpperCase() == 'BASIC') ? null : obj.period && obj.period.toUpperCase(),
      provider: obj.provider,
      currentProductSaleId: obj.current_product_sale_id,
      stackingNumber: obj.stacking_number,
      stackingSaleId: obj.stacking_sale_id,
      upgradeProductId: obj.upgrade_product_id,
    };
  }

  /**
   * Aysnc bulk fetch information of Membership resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    return await Promise.all(keys.map(async (key) => {
      const membership = await this.get(`internal/graphql/memberships/${key}`);
      if (key != this.currentUserId) {
        // hide all other fields except tier.
        return {
          user_id: membership.user_id,
          tier: membership.tier,
        };
      }
      return membership;
    }));
  }

  /**
   * Fetch Membership info. All or by tier
   * @param {String} tier The tier to fetch info for
   * @return {Array} Array of MembershipInfo
   */
  async getMembershipInfo(tier) {
    const qs = {
      tier: tier,
    };
    const response = await this.get(`internal/graphql/staticMembershipInfo`, this.tidyQuery(qs));
    const result = response.map((item) => {
      return {
        tier: item.tier,
        uploadLimit: item.upload_limit,
        exclusivePayoutPercentage: item.exclusive_payout_percentage,
        nonExclusivePayoutPercentage: item.non_exclusive_payout_percentage,
      };
    });
    return result;
  }
}
