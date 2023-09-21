import {Node} from '../base/node';
import {logger} from '../../utils/logger';


/**
 * API representing Workshop from workshop
 */
export class Workshop extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'workshops';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Workshop';
  }

  /**
   * Map API response to Gallery schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      title: obj.title,
      startTime: obj.startTime,
      timeZone: obj.timeZone,
      currency: obj.currency,
      price: obj.price,
      url: obj.url,
      state: obj.state,

      __creatorUserId: obj.userId,
      __coverPhotoId: obj.coverPhotoId,
      __locationId: obj.locationId,
    };
  }

  /**
   * Get a paginated list of Gallery resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {String} sort Sorting option.
   * @param {ID} ownerUserLegacyId the id of user who own those workshops.
   */
  // eslint-disable-next-line no-unused-vars,require-jsdoc
  async upcomingPage({pageNum, pageSize}, sort, ownerUserLegacyId) {
    const __workshops =[];

    return {
      __workshops,
      totalCount: 0,
    };
  }

  /**
   * Aysnc bulk fetch information of Gallery resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    // eslint-disable-next-line max-len
    const response = [];

    const lookupById = response.reduce(function(map, obj) {
      map[obj.id] = obj;
      return map;
    }, {});

    return keys.map((id) => {
      return (lookupById[id] || null);
    });
  }
}
