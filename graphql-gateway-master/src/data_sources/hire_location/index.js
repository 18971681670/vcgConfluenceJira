import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {HireLocation} from './hire_location';

/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from resume microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    hireLocation: new HireLocation(),
  });
}
