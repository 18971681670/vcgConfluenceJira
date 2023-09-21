import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {GeoIp} from './geo_ip';
import {Location} from './location';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from location microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    geoIp: new GeoIp(),
    location: new Location(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
