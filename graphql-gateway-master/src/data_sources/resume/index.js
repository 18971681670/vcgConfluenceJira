import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Resume} from './resume';
import {Specialties} from './specialties';

/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from resume microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    resume: new Resume(),
    specialties: new Specialties(),
  });
}
