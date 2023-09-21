import {API} from '../base/api';

/**
 * Following User Ids API for search username, firstname and lastname of current user
 */
export default class MeFollowingUser extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'search';
  }

  /**
   * Get a list of following IDs belonging to current user
   * @param {LegacyPaginationInfo} legacyPaginationInfo when text is not blank, this object will have value
   * @param {Number} legacyPaginationInfo.pageNum number of page
   * @param {Number}  legacyPaginationInfo.pageSize size of page
   * @param {DdbPaginationInfo} ddbPaginationInfo when text is blank, this object will have value
   * @param {String}  ddbPaginationInfo.exclusiveStartKey start cursor of record
   * @param {Number}  ddbPaginationInfo.size size of record
   * @param {String} text search content
   */
  async followingUserAutocomplete({pageNum, pageSize}, {exclusiveStartKey, size}, text) {
    let qs;
    if (text) {
      qs = {
        'page': pageNum,
        'rpp': pageSize,
        'text': text,
      };
    } else {
      qs = {
        'cursor': exclusiveStartKey,
        'rpp': size,
      };
    }

    const response = await this.get(`/v3/search/myfollowing/autocomplete`, this.tidyQuery(qs));

    return {
      __userIds: response.user_ids,
      cursor: response.cursor,
      currentPage: response.current_page,
      totalPages: response.total_pages,
      totalCount: response.total_items,
    };
  }

  /**
   * Get a list of following IDs belonging to current user
   * @param {LegacyPaginationInfo} legacyPaginationInfo when text is not blank, this object will have value
   * @param {Number} legacyPaginationInfo.pageNum number of page
   * @param {Number}  legacyPaginationInfo.pageSize size of page
   * @param {DdbPaginationInfo} ddbPaginationInfo when text is blank, this object will have value
   * @param {String}  ddbPaginationInfo.exclusiveStartKey start cursor of record
   * @param {Number}  ddbPaginationInfo.size size of record
   * @param {String} text search content
   */
  async myMessengerFriends({pageNum, pageSize}, {exclusiveStartKey, size}, text) {
    let qs;
    if (text) {
      qs = {
        'page': pageNum,
        'rpp': pageSize,
        'text': text,
      };
    } else {
      qs = {
        'cursor': exclusiveStartKey,
        'rpp': size,
      };
    }

    const response = await this.get(`/v3/search/myfollowing/messenger/friends`, this.tidyQuery(qs));

    return {
      __userIds: response.user_ids,
      cursor: response.cursor,
      currentPage: response.current_page,
      totalPages: response.total_pages,
      totalCount: response.total_items,
    };
  }
}
