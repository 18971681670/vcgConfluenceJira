import {merge} from 'lodash';


import {resolvers as photoEdgeResolvers} from './photo_edge';
/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as photoResolvers} from './photo';
import {resolvers as photosResolvers} from './photos';
import {resolvers as myPhotosResolvers} from './my_photos';
import {resolvers as photoKeywordToken} from './photo_keyword_token';
import {resolvers as likedByUsersOnPhotoResolvers} from './liked_by_users_on_photo';
import {resolvers as commentsOnPhotoResolvers} from './comments_on_photo';
import {resolvers as inGalleriesOnPhotoResolvers} from './in_galleries_on_photo';
import {resolvers as userPhotos} from './user_photos';
import {resolvers as editorsChoicePhotos} from './editors_choice_photos';
import {resolvers as bestGalleriesPhotos} from './best_galleries_photos';
import {resolvers as questsPhotos} from './quests_photos';
import {resolvers as resourcePhotos} from './resource_photos';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    {},
    photoEdgeResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    photoResolvers,
    photosResolvers,
    myPhotosResolvers,
    photoKeywordToken,
    likedByUsersOnPhotoResolvers,
    commentsOnPhotoResolvers,
    inGalleriesOnPhotoResolvers,
    userPhotos,
    editorsChoicePhotos,
    bestGalleriesPhotos,
    questsPhotos,
    resourcePhotos,
    /* == END OF AUTO RESOLVER ==*/
);
