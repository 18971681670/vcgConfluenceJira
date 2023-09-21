import {Microservice} from '../base/microservice';

import {Explore} from './explore';

/**
 * Portfolios microservice.
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    explore: new Explore(),
  });
}
