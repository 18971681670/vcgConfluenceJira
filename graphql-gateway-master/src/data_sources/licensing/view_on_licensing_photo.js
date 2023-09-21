import {BatchableAPI} from '../base/batchable_api';

/**
 * Paginated API representing view count on every status in licensing
 */
export class ViewOnLicensingPhoto extends BatchableAPI {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * Enable multiContext mode
   */
  constructor() {
    super(true);
  }


  /**
   * Aysnc bulk fetch unviewcount on every status in licensing
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys, {name}) {
    const qs = {
      statusList: keys.join(','),
    };

    const response = await this.get(`internal/graphql/me/photosAndCandidatesViewCount`, qs);

    if (name == 'markAsViewed') {
      this.post(`internal/graphql/me/licensingPhotoCandidates/viewed`, keys);
    }
    return keys.map((id) => {
      return (response[id] || 0);
    });
  }
}
