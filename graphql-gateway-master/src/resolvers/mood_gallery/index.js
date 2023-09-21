import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as moodResolvers} from './mood_gallery';
import {resolvers as moodItemResolvers} from './mood_gallery_item';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    moodResolvers,
    moodItemResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
