import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing PhotoPulse from featured-photographer
 */
export class FeaturedPhotographer extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'featured-photographer';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'FeaturedPhotographer';
  }


  /**
   * Map API response to PhotoPulse schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      __photographerUserId: obj.userId,
    };
  }

  /**
   * Get a paginated list of Photo resources belonging to current user
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {boolean} ignoreDismissal ignoreDismissal.
   */
  async featuredPhotographerPaginated({pageNum, pageSize}, ignoreDismissal) {
    const that = this;
    const userId = this.currentUserId;
    const qs = {
      page: pageNum,
      rpp: pageSize,
      ignoreDismissal,
    };
    const url = this.baseURL+'v1/featured-photographer/user/'+userId;
    const response = await this.get(url, this.tidyQuery(qs), {headers: {
      'x-500px-user-id': userId,
      'featured_photographer': 'admin',
    }});
    // logger.debug(`======`, {featured_photographers: response});
    const __photographers= response.featured_photographers.map((userId) => {
      return that.reducer({id: userId, userId});
    });

    return {
      __photographers,
      totalCount: response.total_items,
      enabled: response.enabled==undefined? true : response.enabled,
    };


    /*
     * const res = request('get', url, {
     *   headers: {
     *     'x-500px-user-id': userId,
     *     'featured_photographer': 'admin',
     *   },
     * });
     */

    /*
     * const response = JSON.parse(res.getBody('utf8'));
     * logger.debug(`=========`, {__photographers: response});
     */

    /*
     * const __photographers = response.featured_photographers.map((obj) => {
     *   obj['id'] = obj.event_id;
     *   return that.reducer(obj);
     * });
     * return {
     *   __photographers,
     *   totalCount: response.total_items,
     * };
     */
  }


  /**
   * disable featured photographer
   * @return {String} just return OK
   */
  async disable() {
    const userId = this.currentUserId;
    // post请求
    const response = await this.post(this.baseURL+'v1/featured-photographer/user/'+userId, {enabled: false}, {headers: {
      'x-500px-user-id': userId,
      'featured_photographer': 'admin',
    }});
    // logger.debug(`=========`, {disable_photographers: response});
    return response.message;
  }


  /**
   * enabled featured photographer
   * @return {String} just return OK
   */
  async enabled() {
    const userId = this.currentUserId;
    // post请求
    const response = await this.post(this.baseURL+'v1/featured-photographer/user/'+userId, {enabled: true}, {headers: {
      'x-500px-user-id': userId,
      'featured_photographer': 'admin',
    }});
    // logger.debug(`=========`, {enabled_photographers: response});
    return response.message;
  }

  /**
   * enabled featured photographer
   * @param {Long} userId user id
   * @return {String} just return OK
   */
  async enabledByUserId(userId) {
    // post请求
    const response = await this.post(this.baseURL + 'v1/featured-photographer/user/' + userId, {enabled: true}, {
      headers: {
        'x-500px-user-id': userId,
        'featured_photographer': 'admin',
      },
    });
    // logger.debug(`=========`, {enabled_photographers: response});
    return response.message;
  }


  /**
   * remove featured photographer
   * @param {Object} input privacy level params
   * @return {String} just return OK
   */
  async removePhotographer(input) {
    const userId = this.currentUserId;

    logger.debug(`removePhotographer====currentUserId=====`, {userId: userId});
    logger.debug(`removePhotographer====currentUserType=====`, {userType: this.currentUserType});

    /*
     * if (null == userId || null == this.currentUserType || this.currentUserType != 9) {
     *   return {
     *     code: 401,
     *     message: 'Unauthorised',
     *   };
     * }
     */
    const {
      clientMutationId,
      userLegacyId,
    } = input;
    // post请求
    const response = await this.delete(this.baseURL+'v1/featured-photographer/admin/' + userLegacyId, {}, {headers: {
      'x-500px-user-type': 9,
    }});
    response.clientMutationId = clientMutationId;
    return response;
  }


  /**
   * add featured photographer
   * @param {Object} input privacy level params
   * @return {String} just return OK
   */
  async addPhotographer(input) {
    const userId = this.currentUserId;

    logger.debug(`addPhotographer====currentUserId=====`, {userId: userId});
    logger.debug(`addPhotographer====currentUserType=====`, {userType: this.currentUserType});

    /*
     * if (null == userId || null == this.currentUserType || this.currentUserType != 9) {
     *   return {
     *     code: 401,
     *     message: 'Unauthorised',
     *   };
     * }
     */
    const {
      clientMutationId,
      userLegacyId,
    } = input;
    const mappingConfig = {
      camelToSnakeMapping: [
        'followersCount',
        'lastUploadDate',
        'photosCount',
        'username',
      ],
    };
    const body = this.inputToBody(input, mappingConfig);
    // post请求
    const response = await this.post(this.baseURL+'v1/featured-photographer/admin/' + userLegacyId, body, {headers: {
      'x-500px-user-type': 9,
    }});
    response.clientMutationId = clientMutationId;
    return response;
  }
}
