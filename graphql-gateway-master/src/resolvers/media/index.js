import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as userAvatarResolvers} from './user_avatar';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    {},
    queryResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    userAvatarResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
