import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as commentResolvers} from './comment';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    queryResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    commentResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
