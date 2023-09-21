import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {GearBrand} from './gear_brand';
import {Lens} from './lens';
import {Camera} from './camera';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from gear microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    gearBrand: new GearBrand(),
    lens: new Lens(),
    camera: new Camera(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}

export const GEAR_TYPE = {
  CAMERA: 'CAMERA',
  LENS: 'LENS',
};
