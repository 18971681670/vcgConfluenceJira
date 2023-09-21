import {Node} from '../base/node';
import {ApolloError} from 'apollo-server-express';

/**
 * API representing Hire Location objects
 */
export class HireLocation extends Node {
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
    return 'HireLocation';
  }

  /**
   * Map API response
   * @param {object} obj An item from API response
   * @return {object} An object under GraphQL schema
   */
  reducer(obj) {
    obj.id = obj.user_id;
    return {
      ...super.reducer(obj),
      userId: obj.user_id,
      hireLocationId: obj.hire_location_id,
      latitude: obj.latitude,
      longitude: obj.longitude,
      city: obj.city,
      administrativeZone1: obj.administrative_zone1,
      country: obj.country,
      displayName: obj.display_name,
    };
  }

  /**
   * Create/Update a Hire location
   *
   * @param {String} userId
   * @param {object} input
   * @return {HireLocation} The created/updated hire locations for specific user Id
   */
  async update(userId, input) {
    const locationCoordinates = input.map((hireLocation) => ({
      latitude: hireLocation.latitude,
      longitude: hireLocation.longitude,
      city: hireLocation.city,
      administrative_zone1: hireLocation.administrativeZone1,
      country: hireLocation.country,
      display_name: hireLocation.displayName,
    }));

    const body = {
      userId,
      locationCoordinates,
    };

    const response = await this.put(`internal/hirelocations`, body);

    const hireLocations = response.hire_locations.map((item) => this.reducer(item));
    return {
      hireLocations,
    };
  }

  /**
   * get locations by user Id. if user not exist return null.
   * @param {String} userId
   * @return {Array} hire location
   */
  async getUserHireLocations(userId) {
    let hireLocations = [];

    // Note: userprofile can return a 404 in which case hireLocations should resolve to an empty array
    try {
      const response = await this.get(`internal/hirelocations/${userId}`);
      hireLocations = response.hire_locations.map((item) => this.reducer(item));
    } catch (error) {
      if (error instanceof ApolloError && (error.extensions.response.status === 404)) {
        // no-op
      } else {
        throw error;
      }
    }

    return {
      hireLocations,
    };
  };

  /**
   * get locations by coordinates. if user not exist return null.
   * @param {Float} latitude
   * @param {Float} longitude
   * @return {Array} hire locations
   */
  async getHireLocations(latitude, longitude) {
    const qs = this.tidyQuery({
      latitude,
      longitude,
    });

    let hireLocations = [];

    try {
      const response = await this.get(`internal/hirelocations/coordinate`, qs);
      hireLocations = response.hire_locations.map((item) => this.reducer(item));
    } catch (error) {
      if (error instanceof ApolloError && (error.extensions.response.status === 404)) {
        // no-op
      } else {
        throw error;
      }
    }

    return {
      hireLocations,
    };
  }
};
