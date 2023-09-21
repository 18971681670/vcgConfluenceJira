import {Microservice} from '../base/microservice';

import {CustomDomain} from './customDomain';

/**
 * Portfolios microservice.
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    customDomain: new CustomDomain(),
  });
}
