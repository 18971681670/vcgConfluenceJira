import {API} from './api';
import DataLoader from 'dataloader';
import {internalToGlobalId, globalToInternalId} from '../../utils/global_id';
import {logger} from '../../utils/logger';

/**
 * Base class for 500px Java-based microservice APIs
 * We will need to forward headers with `x-500px-` prefix from the API gateway.
 */
export class Node extends API {
  /**
   * Instantiate a data loader instance for the API to batch queries in the same event loop
   */
  constructor() {
    super();
    const that = this;
    this.dataLoader = new DataLoader(async (keys) => {
      const items = await that.bulkLoadData(keys);
      return items.map((item) => (item ? that.reducer(item) : null));
    });
  }

  /**
   * Aysnc bulk fetch information of the data nodes managed by the given microservice
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    throw new Error('bulkLoadData is not implemented');
    // istanbul ignore next
    // eslint-disable-next-line no-unused-vars
    return keys.map((key) => Promise.resolve(null));
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of resource
   */
  get resourceType() {
    throw new Error('resourceType is not implemented');
    // istanbul ignore next
    return 'ResourceType';
  }

  /**
   * Whether a resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether the resource is queryable. `false` by default.
   */
  get queryable() {
    return false;
  }

  /**
   * Map item id to GraphQL schema
   * @param {*} internalId The internal resource id
   * @return {Object} An object under GraphQL schema
   */
  idReducer(internalId) {
    return {
      id: internalToGlobalId(this.resourceType, internalId),
      legacyId: Array.isArray(internalId) ? internalId.join('--') : internalId,
      __internalId: internalId,
      __resolveType: this.resourceType,
    };
  }

  /**
   * Compute the caching hint for a given resource.
   *
   * For resources owned by *individual community users*, make sure three different kinds traffic are differentiated:
   * 1) Anonymous visitors: make use `scope: PUBLIC` is used;
   * 2) Logged-in visitors who are not the resource owner: make use `scope: PRIVATE` is used;
   * 3) Logged-in resource owner: make use `scope: PRIVATE` is used.
   *
   * For resources not owned by individual users (i.e., *created by 500px operational team*), such as Quests,
   * Membership Subscriptions, and etc, we can set `scope: PUBLIC`.
   *
   * @param {Object} obj The object
   * @return {CacheHint} Caching hint
   */
  cacheHint(obj) {
    return {
      maxAge: 0,
      scope: 'PRIVATE',
    };
    return obj;
  }

  /**
   * Map API item response to GraphQL schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    logger.debug(`${this.resourceType}.reducer is called`, {payload: obj});

    return {
      ...this.idReducer(obj.id),
      __raw: obj,
      __cacheHint: this.cacheHint(obj),
    };
  }

  /**
   * Find a node by ID
   * @param {Any} internalId The id of a GraphQL node
   * @return {Object} The API response for this GraphQL node
   */
  async findByInternalId(internalId) {
    logger.debug(`${this.resourceType}.findByInternalId is called`, {internalId});
    return await this.dataLoader.load(internalId);
  }

  /**
   * Find a set of nodes by a list of IDs
   * @param {Array} internalIds A list of IDs to query
   * @return {Array} An array of API response
   */
  async findByInternalIds(internalIds) {
    logger.debug(`${this.resourceType}.findByInternalIds is called`, {internalIds});
    return await this.dataLoader.loadMany(internalIds);
  }

  /**
   * Find a node by Global ID
   * @param {Any} id The id of a GraphQL node
   * @return {Object} The API response for this GraphQL node
   */
  async findByGlobalId(id) {
    logger.debug(`${this.resourceType}.findByGlobalId is called`, {id});
    const internalId = globalToInternalId(this.resourceType, id);
    return this.findByInternalId(internalId);
  }

  /**
   * Find a set of nodes by a list of IDs
   * @param {Array} ids A list of IDs to query
   * @return {Array} An array of API response
   */
  async findByGlobalIds(ids) {
    logger.debug(`${this.resourceType}.findByGlobalIds is called`, {ids});
    const internalIds = ids.map((id) => globalToInternalId(this.resourceType, id));
    return this.findByInternalIds(internalIds);
  }
}
