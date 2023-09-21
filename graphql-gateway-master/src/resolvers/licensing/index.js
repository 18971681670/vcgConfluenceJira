import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as licensingPhotoResolvers} from './licensing_photo';
import {resolvers as licensingContributorResolvers} from './licensing_contributor';
import {resolvers as myLicensingPhotosResolvers} from './my_licensing_photos';
import {resolvers as myLicensingReleasesResolvers} from './my_licensing_releases';
import {resolvers as licensingReleaseResolvers} from './licensing_release';
import {resolvers as modelReleaseResolvers} from './model_release';
import {resolvers as propertyReleaseResolvers} from './property_release';
import {resolvers as autoLicensingPhotoResolvers} from './auto_licensing_photo';
import {resolvers as suggestPhotoResolvers} from './suggest_photo';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    queryResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    licensingPhotoResolvers,
    licensingContributorResolvers,
    myLicensingPhotosResolvers,
    myLicensingReleasesResolvers,
    licensingReleaseResolvers,
    modelReleaseResolvers,
    propertyReleaseResolvers,
    autoLicensingPhotoResolvers,
    suggestPhotoResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
