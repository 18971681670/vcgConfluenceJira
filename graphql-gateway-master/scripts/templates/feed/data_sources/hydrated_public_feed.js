import {API} from '../base/api';
import {__RESOURCE_TYPE_PASCALCASE__} from './__RESOURCE_TYPE_SNAKECASE__';
import {logger} from '../../utils/logger';

/**
 * Paginated API for __RESOURCE_TYPE_PASCALCASE__ feed accessable by everyone
 */
export class __CLASS_NAME__ extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return '__FEED_MICROSERVICE__';
  }

  /**
   * Get a paginated list of __RESOURCE_TYPE_PASCALCASE__ resources for everyone
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {String} filter Filter: a sample filter
   */
  async paginated__RESOURCE_TYPE_PASCALCASE__List({pageNum, pageSize}, filter) {
    const qs = {
      page: pageNum,
      size: pageSize,
      filter,
    };

    const response = await this.get(`internal/graphql/__PREFIXED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__`, this.tidyQuery(qs));
    const ____RESOURCE_TYPE_CAMELCASE_PLURALIZED__ = response.__RESOURCE_TYPE_SNAKECASE_PLURALIZED__.map((obj) => {
      return this.siblingDataSources.__RESOURCE_TYPE_CAMELCASE__.reducer(obj);
    });

    return {
      ____RESOURCE_TYPE_CAMELCASE_PLURALIZED__,
      totalCount: response.total_items,
    };
  }
}
