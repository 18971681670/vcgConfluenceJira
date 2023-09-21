import {merge} from 'lodash';

// import {resolvers as queryResolvers} from './query';
/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as flaggingResolvers} from './flagging';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    // queryResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    flaggingResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
