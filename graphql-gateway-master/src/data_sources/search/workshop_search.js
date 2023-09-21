import {API} from '../base/api';

/**
 * a full function for workshop search.
 */
export default class WorkshopSearch extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'search';
  }

  /**
   * Get workshop ids for discover section.
   * @param {*} LegecyPagiationInfo
   * @param {*} SearchCondition
   */
  async resourceHubDiscoverSearch() {
    return {
      __ids: [],
      currentPage: 0,
      totalPages: 0,
      totalCount: 0,
    };
  }

  /**
   * Get workshop ids for search condition.
   * @param {*} LegecyPagiationInfo
   * @param {*} SearchCondition
   */
  async resourceSearch() {
    return {
      __ids: [],
      currentPage: 0,
      totalPages: 0,
      totalCount: 0,
    };
  }

  /**
   * resource autocomplete.
   *
   * @param {*} size
   * @param {*} keywords
   */
  async autocompelete() {
    return [];
  }
}
