// import {Node} from '../base/node';
import {API} from '../base/api';
const crypto = require('crypto');
import moment from 'moment';
import {logger} from '../../utils/logger';
import {ApolloError} from 'apollo-server-express';

/**
 * API representing ContentStream from content-stream
 */
export class HomefeedItems extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'homefeed-query-service';
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
    const mac = crypto.createHmac('sha256', 'zxQfqx4iiMa4eynqgkfkyvYPhxjy9Z63')
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

    const ordering = {};
    const photoIds = [];
    const galleryIds = [];

    res.events.forEach((event) => {
      if (event.event_type === 'photo_upload') {
        const key = `photo-${event.object_ids[0]}`;
        ordering[key] = {
          cursor: res.page_info.cursors[event.event_id],
          node: null,
        };
        photoIds.push(event.object_ids[0]);
      } else if (event.event_type === 'gallery_published') {
        const key = `gallery-${event.object_ids[0]}`;
        ordering[key] = {
          cursor: res.page_info.cursors[event.event_id],
          node: null,
        };
        galleryIds.push(event.object_ids[0]);
      }
    });

    return {
      ordering,
      photoIds,
      galleryIds,
      pageInfo: res.page_info,
      total: res.total,
    };
  }
}
