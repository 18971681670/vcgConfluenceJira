import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as userFollowedByMeStateResolvers} from './user_followed_by_me_state';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    queryResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    userFollowedByMeStateResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
