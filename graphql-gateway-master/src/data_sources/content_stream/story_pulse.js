import {Node} from '../base/node';
import moment from 'moment';

/**
 * API representing StoryPulse from content-stream
 */
export class StoryPulse extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'content-stream';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'StoryPulse';
  }

  /**
   * Compute the caching hint for a licensing photo
   * @param {*} obj The object
   * @return {*} Caching hint
   */
  cacheHint(obj) {
    const firstActionTime = obj.first_action_time && moment(obj.first_action_time);
    if (!firstActionTime || firstActionTime >= moment().subtract(2, 'days')) {
      return {
        maxAge: 60,
      };
    } else if (firstActionTime >= moment().subtract(4, 'days')) {
      return {
        maxAge: 120,
      };
    } else {
      return {
        maxAge: 600,
      };
    }
  }

  /**
   * Map API response to PhotoPulse schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      current: this.roundToSingleDecimal(obj.rating),
      highest: this.roundToSingleDecimal(obj.highest_rating),
      highestAchievedAt: obj.highest_rating_time,
    };
  }
  /**
   * Round the number to a single decimal place
   * @param {Number} value The value to round, default is 0
   * @return {Number} The rounded value to 1 decimal place
   */
  roundToSingleDecimal(value = 0) {
    return Math.round(value * 10) / 10;
  }

  /**
   * Aysnc bulk fetch information of PhotoPulse resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };
    const response = await this.get(`internal/graphql/storyPulses/listByIds`, qs);

    const lookupById = response.reduce(function(map, obj) {
      map[obj.id] = obj;
      return map;
    }, {});

    return keys.map((id) => {
      // return an empty object to generate default values
      return (lookupById[id] || {id});
    });
  }
}
