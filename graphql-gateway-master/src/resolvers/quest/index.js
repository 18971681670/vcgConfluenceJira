import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';
import {resolvers as mutationResolvers} from './mutation';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as questResolvers} from './quest';
import {resolvers as questShortlistResolvers} from './quest_shortlist';
import {resolvers as questHeader} from './quest_header';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    {},
    queryResolvers,
    mutationResolvers,

    /* == BEGIN OF AUTO RESOLVER ==*/
    questResolvers,
    questShortlistResolvers,
    questHeader,
    /* == END OF AUTO RESOLVER ==*/
);
