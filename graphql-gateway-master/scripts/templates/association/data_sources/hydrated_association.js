import {API} from '../base/api';
// import {logger} from '../../utils/logger';

/**
 * Paginated API representing one-to-many association from __RESOURCE_TYPE_PASCALCASE__ to __ASSOCIATED_RESOURCE_TYPE_PASCALCASE__ in __ASSOCIATION_MICROSERVICE__
 */
export class __CLASS_NAME__ extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return '__ASSOCIATION_MICROSERVICE__';
  }

  /**
   * Get a paginated list of __ASSOCIATED_RESOURCE_TYPE_PASCALCASE__ resources
   * @param {Object} pagination The legacy page-base pagination
   * @param {number} pagination.pageNum The page number, starting from 1.
   * @param {number} pagination.pageSize The number of items in a page.
   * @param {Number} __RESOURCE_TYPE_CAMELCASE__Id Internal ID of __RESOURCE_TYPE_PASCALCASE__
   * @param {String} filter Filter: a sample filter
   */
  async paginated__ASSOCIATED_RESOURCE_TYPE_PASCALCASE__List({pageNum, pageSize}, __RESOURCE_TYPE_CAMELCASE__Id, filter) {
    const qs = {
      page: pageNum,
      size: pageSize,
      // filter,
    };

    const response = await this.get(`internal/graphql/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__/${__RESOURCE_TYPE_CAMELCASE__Id}/__PREFIXED_ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__`, this.tidyQuery(qs));
    const ____ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__ = response.__ASSOCIATED_RESOURCE_TYPE_SNAKECASE_PLURALIZED__.map((obj) => {
      return this.siblingDataSources.__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__.reducer(obj);
    });

    return {
      ____ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__,
      totalCount: response.total_items,
    };
  }

  /**
   * Add a __ASSOCIATED_RESOURCE_TYPE_PASCALCASE__ resource to a __RESOURCE_TYPE_PASCALCASE__
   * @param {Object} input Input
   * @param {Number} input.__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId __ASSOCIATED_RESOURCE_TYPE_PASCALCASE__ ID
   * @param {Number} input.__RESOURCE_TYPE_CAMELCASE__LegacyId __RESOURCE_TYPE_PASCALCASE__ ID
   */
  async add({__RESOURCE_TYPE_CAMELCASE__LegacyId, __ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId}) {
    await this.post(`/internal/graphql/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__/${__RESOURCE_TYPE_CAMELCASE__LegacyId}/__PREFIXED_ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__/${__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId}`);
  }

  /**
   * Remove a __ASSOCIATED_RESOURCE_TYPE_PASCALCASE__ resource from a __RESOURCE_TYPE_PASCALCASE__
   * @param {Object} input Input
   * @param {Number} input.__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId __ASSOCIATED_RESOURCE_TYPE_PASCALCASE__ ID
   * @param {Number} input.__RESOURCE_TYPE_CAMELCASE__LegacyId __RESOURCE_TYPE_PASCALCASE__ ID
   */
  async remove({__RESOURCE_TYPE_CAMELCASE__LegacyId, __ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId}) {
    await this.delete(`/internal/graphql/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__/${__RESOURCE_TYPE_CAMELCASE__LegacyId}/__PREFIXED_ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__/${__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId}`);
  }
}
