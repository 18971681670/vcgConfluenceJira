import {API} from './api';
import DataLoader from 'dataloader';
import {logger} from '../../utils/logger';

/**
 * Base class for 500px Java-based microservice APIs
 * We will need to forward headers with `x-500px-` prefix from the API gateway.
 */
export class BatchableAPI extends API {
  /**
   * Instantiate a data loader instance for the API to batch queries in the same event loop
   * @param {Boolean} multiContextMode If the batchable API needs to run a different context
   */
  constructor(multiContextMode = false) {
    super();

    this.multiContextMode = multiContextMode;
    this.dataLoaders = {};
  }

  /**
   * Aysnc bulk fetch information from a given microservice
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
   * Find data loader for a given context
   * @param {*} context
   * @return {Object} The data loader to be used for a given context
   */
  findDataLoaderByContext(context = {name: 'default'}) {
    const {name} = context;
    if (!name) {
      throw new Error('Context name is missing on batchable API.');
    }

    if (!this.dataLoaders[name]) {
      const that = this;
      this.dataLoaders[name] = new DataLoader((keys) => {
        return that.bulkLoadData(keys, context);
      });
    }

    return this.dataLoaders[name];
  }

  /**
   * Fetch info by a key
   * @param {Any} key The key for this API call
   * @param {Object} context The context for this API call, if multiContextMode is enabled.
   * @param {Object} context.name The name of the context for this API call
   * @return {Object} The API response for this GraphQL node
   */
  async findByKey(key, context) {
    if (this.multiContextMode) {
      return await this.findDataLoaderByContext(context).load(key);
    } else {
      return await this.findDataLoaderByContext().load(key);
    }
  }

  /**
   * Fetch info by an array of keys
   * @param {Array} keys A list of keys to query
   * @param {Object} context The context for this API call, if multiContextMode is enabled.
   * @param {String} context.name The name of the context for this API call
   * @return {Array} An array of API response
   */
  async findByKeys(keys, context) {
    if (this.multiContextMode) {
      return await this.findDataLoaderByContext(context).loadMany(keys);
    } else {
      return await this.findDataLoaderByContext().loadMany(keys);
    }
  }
}
