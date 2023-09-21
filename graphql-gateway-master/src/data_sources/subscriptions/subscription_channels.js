import {API} from '../base/api';
import {getAuthToken, KEY_SPAN} from '../base/helpers';
import {reverseLookupTable} from '../../utils/misc';

const CHANNEL_MAPPER = {
  LIKE: 'likeChannel',
  FAVOURITE: 'favoriteChannel',
  UPCOMING: 'upcomingChannel',
  POPULAR: 'popularChannel',
  EDITORS_CHOICE: 'editorsChoiceChannel',
  CHAT: 'chatChannel',
  CHAT_MESSAGE: 'chatMessageChannel',
  COMMENT: 'commentChannel',
  COMMENT_MENTION: 'commentMentionChannel',
  CRITIQUE_REQUEST: 'critiqueRequestChannel',
  FOLLOW: 'followChannel',
  PHOTO_UPLOAD: 'photoUploadChannel',
  BUY_PHOTO: 'buyPhotoChannel',
  NEWSLETTER: 'newsletterChannel',
  ACCOUNT_UPDATES: 'accountUpdatesChannel',
  WEEKEND_DIGEST: 'weekendDigestChannel',
  GROUP_DISCUSSION: 'groupDiscussionChannel',
  GROUP_DISCUSSION_CREATED: 'groupDiscussionCreatedChannel',
  GROUP_COMMENT_REPLY: 'groupCommentReplyChannel',
  GROUP_JOINED: 'groupJoinedChannel',
  GROUP_INVITE: 'groupInviteChannel',
  GROUP_CONTENT_FLAGGED: 'groupContentFlaggedChannel',
  QUEST_UPDATES: 'questUpdatesChannel',
  GALLERY_YOUR_PHOTO_ADDED: 'galleryYourPhotoAddedChannel',
  GALLERY_EDITORS_CHOICE: 'galleryEditorsChoiceChannel',
  LICENSING_NEWS: 'licensingNewsChannel',
  LICENSING: 'licensingChannel',
  MARKETING_AND_PROMOTION: 'marketingAndPromotionChannel',
};

const REVERSE_CHANNEL_MAPPER = reverseLookupTable(CHANNEL_MAPPER);
/**
 * API representing user subscription channels from UserSetting
 */
export class SubscriptionChannels extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {String} The name of microservice in K8
   */
  get serviceName() {
    return 'notifications-settings';
  }

  /**
   * Hook to forward request headers to microservices
   * @return {String} The name of microservice in K8
   */
  get baseURL() {
    const url = process.env.SUBSCRIPTIONS_SERVICE_URL || 'notifications-settings.j79-dev.500px.net';
    return `https://${url}`;
  }

  /**
   * Headers
   * @param {String} token - signature
   * @return {Object} headers object
   */
  getHeaders(token) {
    return {
      'X-Service-Auth': token,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Date
   * @return {Integer} the current time in seconds
   */
  getDate() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Nonce
   * @param {Integer} now - time in seconds
   * @return {Integer} the nonce with 300 seconds or so added
   */
  getNonce(now) {
    return now - (now % KEY_SPAN) + KEY_SPAN;
  }

  /**
   * Auth token
   * @param {String} method - request method
   * @param {String} path - url path
   * @param {String} trimmedQuery - stringified query params
   * @param {String} body - stringified JSON body
   * @return {String} authentication token in url safe base64
   */
  generateAuthToken(method, path, trimmedQuery, body) {
    const secret = process.env.SUBSCRIPTIONS_SERVICE_SECRET || '';
    const now = this.getDate();
    const nonce = this.getNonce(now);
    const message = `${method}${path}${trimmedQuery}${body}${nonce}`;
    return getAuthToken(message, secret);
  }

  /**
   * Reducer
   * @param {Object} obj - channel object
   * @return {Object} modified channel object
   */
  reducer(obj) {
    return {
      name: REVERSE_CHANNEL_MAPPER[obj.name],
      pushEnabled: obj.push_enabled,
      emailEnabled: obj.email_enabled,
    };
  }

  /**
   * Serializer for BE request
   * @param {String} name - channel name
   * @param {Object} settings - channel enabled settings
   * @return {Object} modified channel object for MS consumption
   */
  serialize(name, settings) {
    return {
      channel: CHANNEL_MAPPER[name],
      push_enabled: settings.pushEnabled,
      email_enabled: settings.emailEnabled,
    };
  }

  /**
   * Body serializer
   * @param {Object} channelsObject - incoming channel objects
   * @return {String} JSON string for request consumption
   */
  serializeBody(channelsObject) {
    const bodyList = Object.entries(channelsObject).map(([name, settings]) => {
      return this.serialize(name, settings);
    });
    return JSON.stringify(bodyList);
  }

  /**
   * Fetch the subscription channels for this user
   * @param {String} userId id of a user
   * @return {Array} Array of formatted channels
   */
  async getSubscriptionChannels(userId) {
    const qs = {
      user_id: userId,
    };
    const query = this.tidyQuery(qs);
    const token = this.generateAuthToken('GET', '/v2/subscriptions', query.toString(), '');
    const headers = this.getHeaders(token);
    const response = await this.get('/v2/subscriptions', query, {headers});
    return response.channels.map((channel) => this.reducer(channel)).filter((channel) => !!channel.name);
  }

  /**
   * Fetch the subscription channels for this user
   * @param {String} userId - id of a user
   * @param {Array} channels - list of channels to be updated
   * @return {Array} Array of formatted channels
   */
  async updateSubscriptionChannels(userId, channels) {
    const qs = {
      user_id: userId,
    };
    const queryString = this.tidyQuery(qs).toString();
    const body = this.serializeBody(channels);
    const token = this.generateAuthToken('PUT', '/v2/subscriptions', queryString, body);
    const headers = this.getHeaders(token);

    // Note: Apollo RESTHttpClient doesn't have a way to pass both a body and query params to a PUT request, so have to append it to the url
    const response = await this.put(`/v2/subscriptions?${queryString}`, body, {headers});
    return response.channels.map((channel) => this.reducer(channel));
  }
}
