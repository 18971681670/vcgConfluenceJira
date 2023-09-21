import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';
import {TIER_REVERSE_MAPPING} from './membership';

/**
 * API representing PhotoUploadQuotaPolicy from memberhsip
 */
export class PhotoUploadQuotaPolicy extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'membership';
  }

  /**
   * Aysnc bulk fetch information of PhotoLikeCounter resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    return await Promise.all(keys.map(async ({tier, isPaid, email}) => {
      const qs = {
        tier: TIER_REVERSE_MAPPING[tier],
        is_paid: isPaid ? 1 : 0,
        email,
      };

      const response = await this.get(`internal/graphql/photoUploadQuotaPolicy`, qs);

      return {
        maxPhotoUploadQuota: response.max_photo_upload_quota,
        photoUploadQuotaWindowInDays: response.photo_upload_quota_window_in_days,
      };
    }));
  }
}
