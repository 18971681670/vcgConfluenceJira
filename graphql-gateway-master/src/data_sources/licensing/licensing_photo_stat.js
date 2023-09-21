import {BatchableAPI} from '../base/batchable_api';

/**
 * Paginated API representing one-to-many association from LicensingPhoto to ModelRelease in licensing
 */
export class LicensingPhotoStat extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * Map API response to ModelReleasesOnLicensingPhoto schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      totalUnderReview: obj.underreview,
      totalChangesRequired: obj.changesrequired,
      totalAccepted: obj.accepted,
      totalRemoved: obj.removed,
      totalReleaseRequired: obj.releaserequired,
      totalDeleted: obj.deleted,
      totalDeclined: obj.declined,
    };
  }


  /**
   * Aysnc bulk fetch information of ModelRelease resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };
    const response = await this.get(`internal/graphql/licensingPhotos/userStats`, qs);
    return keys.map((id) => {
      return this.reducer(response[id]);
    });
  }
}
