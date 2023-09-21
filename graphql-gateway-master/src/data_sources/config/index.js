import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Config} from './config';

/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from resume microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    config: new Config(),
  });
}
