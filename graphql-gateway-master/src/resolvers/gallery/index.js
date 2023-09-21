import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as galleryResolvers} from './gallery';
import {resolvers as photosOnGalleryResolvers} from './photos_on_gallery';
import {resolvers as myGalleriesResolvers} from './my_galleries';
import {resolvers as coverphotosOnGalleryResolvers} from './coverphotos_on_gallery.js';
import {resolvers as featureGallery} from './feature_gallery';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    queryResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    galleryResolvers,
    photosOnGalleryResolvers,
    myGalleriesResolvers,
    coverphotosOnGalleryResolvers,
    featureGallery,
    /* == END OF AUTO RESOLVER ==*/
);
