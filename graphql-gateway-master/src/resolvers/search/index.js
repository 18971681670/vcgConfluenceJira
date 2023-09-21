import {merge} from 'lodash';
import {resolvers as photoSearch} from './photos';
import {resolvers as gallerySearch} from './galleries';
import {resolvers as userSearch} from './users';
import {resolvers as photoDiscoverSearch} from './discover';
/* == BEGIN OF AUTO IMPORT ==*/
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    {},
    photoSearch,
    gallerySearch,
    userSearch,
    photoDiscoverSearch,
    /* == BEGIN OF AUTO RESOLVER ==*/
    /* == END OF AUTO RESOLVER ==*/
);
