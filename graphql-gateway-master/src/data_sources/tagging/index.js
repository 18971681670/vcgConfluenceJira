import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {PhotoTags} from './photo_tags';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from photo microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    photoTags: new PhotoTags(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
