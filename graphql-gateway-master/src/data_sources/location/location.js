import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing Comment from comment
 */
export class Location extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'locations';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Location';
  }

  /**
   * Map API response to Comment schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      placeId: obj.place_id,
      locality: obj.locality,
      administrativeArea1: obj.administrative_area1,
      administrativeArea2: obj.administrative_area2,
      administrativeArea3: obj.administrative_area3,
      administrativeArea4: obj.administrative_area4,
      country: obj.country,
      countryCode: obj.country_code,
      latitude: obj.latitude,
      longitude: obj.longitude,
      formattedAddress: obj.formatted_address,
    };
  }

  /**
   * Create resource.
   * @param {*} location
   */
  async create(location) {
    const mapped = this.inputToBody(location, {
      camelToSnakeMapping: [
        'placeId',
        'administrativeArea1',
        'administrativeArea2',
        'administrativeArea3',
        'administrativeArea4',
        'locality',
        'country',
        'countryCode',
        'formattedAddress',
      ],
    });

    try {
      const locationId = await this.get(`internal/graphql/location/placeId/${location.placeId}`);
      return locationId;
    } catch (e) {
      if (e.extensions.response.status === 404) {
        const locationId = await this.post(`internal/graphql/location`, {...mapped});
        return locationId;
      }
    }
  }

  /**
   * Aysnc bulk fetch information of Comment resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    const response = await this.get(`internal/graphql/location/findByIds`, qs);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }

  /**
   * get location by placeId. if does not exist return null.
   * @param {String} placeId
   * @return {Object} Location
   */
  async getLocation(placeId) {
    const response = await this.get(`/v3/locations/get`, placeId);
    return this.reducer(response);
  }
}
