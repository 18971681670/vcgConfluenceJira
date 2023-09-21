import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Flagging} from './flagging';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from comment microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    flagging: new Flagging(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
