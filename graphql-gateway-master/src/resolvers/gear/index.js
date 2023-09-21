import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as gearBrandResolvers} from './gear_brand';
import {resolvers as lensResolvers} from './lens';
import {resolvers as cameraResolvers} from './camera';
import {resolvers as gearResolvers} from './gear';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    gearBrandResolvers,
    lensResolvers,
    cameraResolvers,
    gearResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
