import {Node} from '../base/node';
import {reverseLookupTable} from '../../utils/misc';


export const SAMPLE_MAPPING = {
  0: 'ENUM_ZERO',
  1: 'ENUM_ONE',
  2: 'ENUM_TWO',
};

export const SAMPLE_REVERSE_MAPPING = reverseLookupTable(SAMPLE_MAPPING);

/**
 * API representing __RESOURCE_TYPE_PASCALCASE__ from __MICROSERVICE__
 */
export class __CLASS_NAME__ extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return '__MICROSERVICE__';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return '__RESOURCE_TYPE_PASCALCASE__';
  }

  /**
   * Whether this resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether __CLASS_NAME__ resource is queryable. `false` by default.
   */
  // Uncomment if needed
  // get queryable() {
  //   return true;
  // }

  /**
   * Compute the caching hint for a __CLASS_NAME__ resource.
   *
   * For resources owned by *individual community users*, make sure three different kinds traffic are differentiated:
   * 1) Anonymous visitors: make use `scope: PUBLIC` is used;
   * 2) Logged-in visitors who are not the resource owner: make use `scope: PRIVATE` is used;
   * 3) Logged-in resource owner: make use `scope: PRIVATE` is used.
   *
   * For resources not owned by individual users (i.e., *created by 500px operational team*), such as Quests,
   * Membership Subscriptions, and etc, we can set `scope: PUBLIC`. For some draft resources, you may want to set
   * `scope: PRIVATE`.
   *
   * @param {*} obj The object
   * @return {*} Caching hint
   */
  // Uncomment if needed
  // cacheHint(obj) {
  //   if (!this.currentUserId) {
  //     // anonymous
  //     return {
  //       maxAge: 600,
  //       scope: 'PUBLIC',
  //     };
  //   } else if (this.currentUserId != obj.user_id) {
  //     // logged-in but not the owner
  //     return {
  //       maxAge: 600,
  //       scope: 'PRIVATE',
  //     };
  //   } else {
  //     // logged-in and the owner
  //     return {
  //       maxAge: 0,
  //       scope: 'PRIVATE',
  //     };
  //   }
  // }

  /**
   * Map API response to __RESOURCE_TYPE_PASCALCASE__ schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      // TODO Please add field mapping here
      // from JSON fields to GraphQL schema fields
      fieldName: obj.field_name,
      anotherField: SAMPLE_MAPPING[obj.another_field],
    };
  }

  /**
   * Aysnc bulk fetch information of __RESOURCE_TYPE_PASCALCASE__ resources
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
    const response = await this.get(`internal/graphql/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__/findByIds`, qs);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }

  /**
   * Create __RESOURCE_TYPE_PASCALCASE__ resource
   * @param {Object} input Creation params
   * @param {String} input.sampleFieldFromInput Sample input 1
   * @param {Boolean} input.anotherField Sample input 2
   * @param {String} input.thirdField Sample input 3
   * @return {Object} A newly created __RESOURCE_TYPE_PASCALCASE__ resource
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
    const response = await this.post('internal/graphql/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__', body);
    return this.reducer(response);
  }

  /**
   * Update __RESOURCE_TYPE_PASCALCASE__ resource
   * @param {Number} internalId Internal __RESOURCE_TYPE_PASCALCASE__ ID
   * @param {Object} input Update params
   * @param {String} input.sampleFieldFromInput Sample input 1
   * @param {Boolean} input.anotherField Sample input 2
   * @param {String} input.thirdField Sample input 3
   * @return {Object} A newly updated __RESOURCE_TYPE_PASCALCASE__ resource
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
    const response = await this.patch(`internal/graphql/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__/${internalId}`, body);
    return this.reducer(response);
  }

  /**
   * Delete __RESOURCE_TYPE_PASCALCASE__ resource
   * @param {Number} internalId Internal __RESOURCE_TYPE_PASCALCASE__ ID
   */
  async destroy(internalId) {
    // eslint-disable-next-line max-len
    await this.delete(`internal/graphql/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__/${internalId}`);
  }
}
