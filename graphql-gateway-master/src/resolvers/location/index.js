import {merge} from 'lodash';

import {resolvers as locationResolvers} from './location';

/* == BEGIN OF AUTO IMPORT ==*/
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    {},
    locationResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    /* == END OF AUTO RESOLVER ==*/
);
