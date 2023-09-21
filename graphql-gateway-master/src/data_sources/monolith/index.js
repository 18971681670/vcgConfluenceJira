import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {ProfileGroups} from './profile_groups';
import {Group} from './group';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from monolith service
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    profileGroups: new ProfileGroups(),
    group: new Group(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
