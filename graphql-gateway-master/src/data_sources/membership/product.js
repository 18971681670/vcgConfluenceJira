import {Node} from '../base/node';
import {logger} from '../../utils/logger';
import {reverseLookupTable} from '../../utils/misc';


export const SAMPLE_MAPPING = {
  0: 'ENUM_ZERO',
  1: 'ENUM_ONE',
  2: 'ENUM_TWO',
};

export const SAMPLE_REVERSE_MAPPING = reverseLookupTable(SAMPLE_MAPPING);

/**
 * API representing Product from membership
 */
export class Product extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'membership';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Product';
  }

  /**
   * Map API response to Product schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      /*
       * TODO Please add field mapping here
       * from JSON fields to GraphQL schema fields
       */
      name: obj.name,
      subscriptionPeriod: obj.period == 'Y' ? 'ANNUAL' : 'MONTHLY',
      priceInCents: obj.base_price,
      tier: obj.membership.toUpperCase(),
      region: obj.region,
      __bundledMembershipId: obj.bundle_id,
    };
  }

  /**
   * Aysnc bulk fetch information of Product resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    // TODO Please add your code to call the microservice
    const qs = {
      ids: keys.join(','),
      queryOne: true,
    };

    // eslint-disable-next-line max-len
    const response = await this.get(`internal/graphql/products/findByIds`, qs);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }

  /**
   * Create Product resource
   * @param {Object} input Creation params
   * @param {String} input.sampleFieldFromInput Sample input 1
   * @param {Boolean} input.anotherField Sample input 2
   * @param {String} input.thirdField Sample input 3
   * @return {Object} A newly created Product resource
   */
  async create(input) {
    const body = this.inputToBody(input, {
      camelToSnakeMapping: [
        'sampleFieldFromInput',
      ],
      convertedMapping: {
        anotherField: {
          fieldName: 'example_one',
        },
        thirdField: {
          conversion: SAMPLE_REVERSE_MAPPING,
        },
      },
    });

    // eslint-disable-next-line max-len
    const response = await this.post('internal/graphql/products', body);
    return this.reducer(response);
  }

  /**
   * Update Product resource
   * @param {Number} internalId Internal Product ID
   * @param {Object} input Update params
   * @param {String} input.sampleFieldFromInput Sample input 1
   * @param {Boolean} input.anotherField Sample input 2
   * @param {String} input.thirdField Sample input 3
   * @return {Object} A newly updated Product resource
   */
  async update(internalId, input) {
    const body = this.inputToBody(input, {
      camelToSnakeMapping: [
        'sampleFieldFromInput',
      ],
      convertedMapping: {
        anotherField: {
          fieldName: 'example_one',
        },
        thirdField: {
          conversion: SAMPLE_REVERSE_MAPPING,
        },
      },
    });

    // eslint-disable-next-line max-len
    const response = await this.patch(`internal/graphql/products/${internalId}`, body);
    return this.reducer(response);
  }

  /**
   * Delete Product resource
   * @param {Number} internalId Internal Product ID
   */
  async destroy(internalId) {
    // eslint-disable-next-line max-len
    await this.delete(`internal/graphql/products/${internalId}`);
  }
}
