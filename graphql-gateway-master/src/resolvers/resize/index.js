import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as userAvatarResizeImageResolvers} from './user_avatar_resize_image';
import {resolvers as photoResizeImageResolvers} from './photo_resize_image';
import {resolvers as licensingPhotoResizeImageResolvers} from './licensing_photo_resize_image';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    {},
    queryResolvers,

    /* == BEGIN OF AUTO RESOLVER ==*/
    userAvatarResizeImageResolvers,
    photoResizeImageResolvers,
    licensingPhotoResizeImageResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
