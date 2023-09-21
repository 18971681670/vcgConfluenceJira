import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Workshop} from './workshop';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from gallery microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    workshop: new Workshop(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
