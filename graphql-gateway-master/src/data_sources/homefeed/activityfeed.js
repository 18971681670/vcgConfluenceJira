import {API} from '../base/api';
const crypto = require('crypto');

import {logger} from '../../utils/logger';


/**
 * API representing ContentStream from content-stream
 */
export class Activityfeed extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return process.env.PX_TIMELINES_SERVICE_URL || 'timelines.j79-stage.500px.net';
    // return 'homefeed.j79-dev.500px.net';
  }

  /**
   * Hook to forward request headers to microservices
   * @return {string} The name of microservice in K8
   */
  get baseURL() {
    return `https://${this.serviceName}/`;
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Activityfeed';
  }
  /**
   * Map API response to PhotoPulse schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      // ...super.reducer(obj),

      action: obj.action,
      published: obj.published,
      objectType: obj.object_type,
      objectItemId: obj.object_item_id,
      targetType: obj.target_type,
      targetItemId: obj.target_item_id,
      userId: obj.user,
    };
  }


  /**
   * base64Encode
   * @param {*}  buffer
   * @return {string} base64Encode string
   */
  base64Encode(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_'); // Convert '/' to '_'
  };

  /**
   * Get a paginated list of homefeed resources belonging to current user
   * @param {number} limit The page number, starting from 1.
   * @param {String} cursor .
   * @param {number} userIds .
   */
  async activityfeedPaginated(limit, cursor, userIds) {
    const t = Math.round(Date.now()/1000);
    const t1 = 300;

    const nonce = (t - (t % t1)) + t1;
    const body = {
      stream: 'likes',
      users: userIds,
    };

    const query = {limit: limit};
    if (cursor) {
      query.next = cursor;
    } else {
      query.offset = 0;
    }
    const message = 'POST/'+ this.tidyQuery(query)+ JSON.stringify(body) + nonce;

    const mac = crypto.createHmac('sha256', process.env.PX_TIMELINES_SECRET||'188996c13fd1410347a555c3dfb47cdc')
        .update(message)
        .digest();
    const token = this.base64Encode(mac);
    const headers = {'X-Service-Auth': token};

    const res = await this.post(`${this.baseURL}?${this.tidyQuery(query)}`, body,
        {
          headers: headers,
        },
    );
    const self = this;
    const __activities = res.activities.map((obj) => {
      return self.reducer(obj);
    });

    return {
      __activities,
      next: res.next,
    };
  }

  /**
   * Fetch first n activities for a user that match action, objectType, and targetType
   *
   * @param {number} userId
   * @param {number} action
   * @param {number} objectType
   * @param {number} targetType
   * @param {number} first
   * @param {string} after
   * @return {*} filtered activities
   */
  async recentActions(userId, action, objectType, targetType, first, after) {
    const actions = [];
    let cursor = after;
    let done = false;
    setTimeout(() => {
      done = true;
    }, 5000);

    while (!done && actions.length !== first && cursor !== '0A') {
      const activities = await this.activityfeedPaginated(first, cursor, [userId.toString()]);
      cursor = activities.next;

      activities.__activities.forEach((activity) => {
        if (activity.action === action && activity.objectType === objectType && activity.targetType === targetType) {
          actions.push(activity);
        }
      });
    }

    return actions;
  }
}
