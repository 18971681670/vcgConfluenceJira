import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {MyTopGear} from './my_top_gear';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from search-service microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    myTopGear: new MyTopGear(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
