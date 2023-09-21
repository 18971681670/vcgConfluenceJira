import {BatchableAPI} from '../base/batchable_api';
import {logger} from '../../utils/logger';

/**
 * API representing PhotoUploadQuota from membership
 */
export class PhotoUploadQuota extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'photo';
  }

  /**
   * Aysnc bulk fetch information of PhotoLikeCounter resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    return await Promise.all(keys.map(async ({userId, maxPhotoUploadQuota, photoUploadQuotaWindowInDays}) => {
      if (userId != this.currentUserId) {
        return {
          photoUploadQuota: null,
          refreshPhotoUploadQuotaAt: null,
        };
      }

      const qs = {
        max_photo_upload_quota: maxPhotoUploadQuota,
        photo_upload_quota_window_in_days: photoUploadQuotaWindowInDays,
      };

      const response = await this.get(`internal/graphql/users/${userId}/photoUploadQuota`, qs);

      return {
        photoUploadQuota: response.photo_upload_quota,
        refreshPhotoUploadQuotaAt: response.refresh_photo_upload_quota_at,
      };
    }));
  }
}
