import {Node} from '../base/node';
const crypto = require('crypto');
import moment from 'moment';
import {logger} from '../../utils/logger';
import {ApolloError} from 'apollo-server-express';

/**
 * API representing ContentStream from content-stream
 */
export class Homefeed extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'homefeed-query-service';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Homefeed';
  }
  /**
   * Map API response to PhotoPulse schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      eventId: obj.event_id,
      eventType: obj.event_type,
      createdAt: obj.created_at,
      objectType: obj.object_type,

      __objectType: obj.object_type,
      __objectIds: obj.object_ids,
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
   * get headers for request
   * @param {String} date - rfc3339 formatted date
   * @param {String} token
   * @return {Object} headers object
   */
  getHeaders(date, token) {
    return {
      'Date': date,
      'Authorization': token,
    };
  }

  /**
   * get rfc3339 format date
   * @return {String} rfc3339 formatted date
   */
  getFormattedDate() {
    return moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
  }

  /**
   * get auth token
   * @param {String} userId - legacy id
   * @param {String} date - rfc3339 formatted date
   * @return {String} encoded token
   */
  getAuthToken(userId, date) {
    const message = `UserId: ${userId}\nDate: ${date}`;
    const secret = process.env.HOMEFEED_QUERY_SERVICE_SECRET;
    const mac = crypto.createHmac('sha256', secret)
        .update(message)
        .digest();
    return this.base64Encode(mac);
  }

  /**
   * Get a paginated list of Photo ids and cursors
   * @param {String} cursor - The cursor
   * @param {number} size - The size
   * @param {number} legacyId - legacy id of user
   * @param {boolean} before - 'before' this cursor.
   * @param {boolean} inclusive - whether the first load should include the cursor being requested
   */
  async cursorPaginatedPhotoIdList({size, previous, cursor, legacyId, inclusive}) {
    const userId = legacyId;
    const date = this.getFormattedDate();
    const token = this.getAuthToken(userId, date);
    const headers = this.getHeaders(date, token);

    const qs = {
      filter: 'photo_upload_only',
      cursor,
      previous,
      limit: size,
    };

    /* eslint-disable-next-line camelcase */
    const {events, page_info, total} = await this.get(
        `/homefeed/${userId}`,
        this.tidyQuery(qs),
        {headers},
    );

    const photoIds = [];
    const cursors = [];
    events.forEach((event) => {
      photoIds.push(event.object_ids[0]);
      cursors.push(page_info.cursors[event.event_id]);
    });

    /*
     * FIXME: on initial after calls, we need to load the current item until we
     * figure out how to get inclusive first calls
     * If the next page doesn't exist or is empty, will not return the current item
     */
    if (!previous && inclusive && cursors.length > 0) {
      const newQs = {
        filter: 'photo_upload_only',
        cursor: cursors[0],
        previous: true,
        limit: size,
      };
      /* eslint-disable-next-line camelcase */
      const {events, page_info} = await this.get(
          `/homefeed/${userId}`,
          this.tidyQuery(newQs),
          {headers},
      );

      if (events.length > 0) {
        const returnedFirstCursor = page_info.cursors[events[0].event_id];
        if (returnedFirstCursor === cursor) {
          photoIds.unshift(events[0].object_ids[0]);
          cursors.unshift(returnedFirstCursor);
        }
      }
    }

    let startCursor = null;
    let endCursor = null;
    if (cursors.length > 0) {
      startCursor = cursors[0];
      endCursor = cursors[cursors.length - 1];
    }

    const pageInfo = {
      startCursor,
      endCursor,
      hasNextPage: page_info.hasNextPage,
      hasPreviousPage: page_info.hasPreviousPage,
    };

    // Note: couldn't reverse in MS
    const orderedCursors = previous ? cursors.reverse() : cursors;
    const orderedPhotoIds = previous ? photoIds.reverse() : photoIds;

    return {
      photoIds: orderedPhotoIds,
      cursors: orderedCursors,
      totalCount: total,
      pageInfo,
    };
  }

  /**
   * Get a paginated list of homefeed resources belonging to current user
   * @param {number} limit The page number, starting from 1.
   * @param {String} cursor .
   */
  async homefeedPaginated(limit, cursor) {
    const userId = this.currentUserId;
    if (!userId) {
      throw new ApolloError('Unauthorised', '401', {status: 401});
    }
    const rfc3339Date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
    const message = `UserId: ${userId}\nDate: ${rfc3339Date}`;
    /*
     * logger.debug('======HOMEFEED_QUERY_SERVICE_SECRET====='+process.env.HOMEFEED_QUERY_SERVICE_SECRET);
     * This doesn't work local because the secret was not included in the development env.
     */
    const mac = crypto.createHmac('sha256', process.env.HOMEFEED_QUERY_SERVICE_SECRET)
        .update(message)
        .digest();
    const token = this.base64Encode(mac);

    const qs = {
      limit,
      cursor,
    };
    const path = `homefeed/${userId}`;
    const res = await this.get(path, this.tidyQuery(qs), {
      headers: {
        'Date': rfc3339Date,
        'Authorization': token,
      },
    });

    logger.debug(`__homefeeds`, {homefeeds: res});

    const self = this;
    const __events = res.events.map((obj) => {
      obj.id = obj.event_id;
      return self.reducer(obj);
    });
    return {
      __events,
      next: res.next,
      cursors: res.page_info.cursors,
    };
    /*
     * post请求
     * request({
     *   url: this.baseURL+'homefeed/'+userId+'?page='+pageNum+'&size='+pageSize,
     *   method: 'get',
     *   json: true,
     *   headers: {
     *     'content-type': 'application/json',
     *     'Date': rfc3339Date,
     *     'Authorization': token,
     *   },
     * }, function(error, response, body) {
     */

    /*
     *   if (!error && response.statusCode == 200) {
     *     const __homefeeds = body.events.map((obj) => {
     *       obj.id = obj.event_id;
     *       return that.reducer(obj);
     *     });
     *     logger.debug(`__homefeeds`, {homefeeds: __homefeeds});
     *     return {
     *       __homefeeds,
     *       totalCount: body.total,
     *     };
     *   } else {
     *     return null;
     *   }
     * });
     */
  }
}
