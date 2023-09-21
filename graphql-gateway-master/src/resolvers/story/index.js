import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as storyResolvers} from './story';
import {resolvers as photoStoryResolvers} from './photos_in_story';

/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    storyResolvers,
    photoStoryResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
