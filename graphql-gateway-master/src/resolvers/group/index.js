import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as groupResolvers} from './group';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    groupResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
