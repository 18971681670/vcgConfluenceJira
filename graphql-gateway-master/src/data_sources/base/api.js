import {RESTDataSource} from 'apollo-datasource-rest';
import {snakeCase} from 'change-case';

import {logger} from '../../utils/logger';
import {URLSearchParams} from 'apollo-server-env';

/**
 * The prefix of headers added by API gateway after authentication
 */
const API_GATEWAY_HEADER_PREFIX = 'x-500px-';

const FORWARED_HEADERS = [
  'user-agent',
  'x-forwarded-for',
];

/**
 *
 * @typedef {Object} CacheHint
 * @property {number} maxAge - The max age
 * @property {string} scope - `PUBLIC` / `PRIVATE`
 */

/**
 * Base class for 500px Java-based microservice APIs
 * We will need to forward headers with `x-500px-` prefix from the API gateway.
 */
export class API extends RESTDataSource {
  /**
   * Get the internal service base url per microservice
   * @return {string} The base URL
   */
  get baseURL() {
    return `http://${this.serviceName}/`;
  }

  /**
   * Disable redis httpcache and use default in-memory httpcache
   * @param {DataSourceConfig} config Apollo DataSource config
   */
  initialize(config = {}) {
    const {
      microserviceDataSource,
      context,
    } = config;

    /**
     * @member {Object.<string, API>} siblingDataSources named sibling data sources.
     */
    this.siblingDataSources = (microserviceDataSource && microserviceDataSource.dataSources) || {};

    /**
     * @member {number} currentUserId The current user ID
     */
    this.currentUserId = (context && context.currentUserId) || null;

    this.currentUserType = (context && context.currentUserType) || null;

    const configWithoutCache = {
      ...config,
    };
    delete configWithoutCache.cache;
    super.initialize(configWithoutCache);
  }

  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    throw new Error('serviceName is not implemented');
    // istanbul ignore next
    return 'servier-name';
  }

  /**
   * Hook to forward request headers to microservices
   * @param {*} request The request to be sent to microservice
   */
  willSendRequest(request) {
    for (const [key, value] of Object.entries(this.context.requestHeaders)) {
      if (key.startsWith(API_GATEWAY_HEADER_PREFIX) || FORWARED_HEADERS.includes(key)) {
        request.headers.set(key, value);
      }
    }
  }

  /**
   * Convert input from mutation to HTTP body JSON
   * @param {Object} input The input defined in GraphQL mutation
   * @param {Object} mapping The conversion rules
   * @param {Array<String>} mapping.camelToSnakeMapping The simple conversion rules from camelCase to snake_case
   * @param {Object} mapping.convertedMapping The complex conversion rules
   * @param {String} mapping.convertedMapping.fieldName (Optional) The field name used in body
   * @param {Object} mapping.convertedMapping.conversion (Optional) The conversion mapping, or a conversion function
   * @return {Object} The body
   */
  inputToBody(input, {camelToSnakeMapping = [], convertedMapping = {}}) {
    logger.debug('Converting input to body', {input, camelToSnakeMapping, convertedMapping});

    const body = {};

    camelToSnakeMapping.map((key) => {
      const inputVal = input[key];
      if (inputVal == undefined) {
        return;
      }

      const fieldName = snakeCase(key);
      body[fieldName] = inputVal;
    });

    Object.keys(convertedMapping).map((key) => {
      const inputVal = input[key];
      if (inputVal == undefined) {
        return;
      }

      const {conversion} = convertedMapping[key];
      let convertedValue;
      if (conversion == undefined || conversion == null) {
        convertedValue = inputVal;
      } else if (conversion instanceof Function) {
        convertedValue = conversion(inputVal, input);
      } else if (conversion instanceof Object) {
        convertedValue = conversion[inputVal];
      }

      if (convertedValue == undefined) {
        throw new Error(`Failed to convert ${key} in the input`);
      }

      const fieldName = convertedMapping[key].fieldName || key;
      body[fieldName] = convertedValue;
    });

    logger.debug('Converted body', {input, body});
    return body;
  }

  /**
   * Remove empty query strings
   * @param {Object} qs A map of query strings
   * @return {Object} A map of cleaned-up query strings
   */
  tidyQuery(qs) {
    return Object.keys(qs).reduce(function(params, k) {
      const v = qs[k];
      if (v != null && v != undefined) {
        if (Array.isArray(v)) {
          v.forEach((item) => {
            params.append(`${k}`, item);
          });
        } else {
          params.append(k, v);
        }
      }
      return params;
    }, new URLSearchParams());
  }
}
