import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as photoLikedByMeResolvers} from './photo_liked_by_me_state';
import {resolvers as likedPhotosResolvers} from './liked_photos_by_user_id';
/* == END OF AUTO IMPORT ==*/

import {resolvers as userEdgeOnPhotoLikedByUsers} from './user_edge_on_photo_liked_by_users';

export const resolvers = merge(
    queryResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    likedPhotosResolvers,
    photoLikedByMeResolvers,
    /* == END OF AUTO RESOLVER ==*/
    userEdgeOnPhotoLikedByUsers,
);
