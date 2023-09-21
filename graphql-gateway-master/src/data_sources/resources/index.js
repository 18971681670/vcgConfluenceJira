import {Microservice} from '../base/microservice';

import {Resource} from './resource';

/**
 * Resource microservice.
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    resource: new Resource(),
  });
}
