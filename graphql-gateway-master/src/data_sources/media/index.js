import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {UserAvatar} from './user_avatar';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from media microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    userAvatar: new UserAvatar(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
