import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as userResolvers} from './user';
import {resolvers as userContactResolvers} from './user_contact';
import {resolvers as oauth2Resolvers} from './oauth2';
import {resolvers as personalAndProfileResolvers} from './personal_and_profile';
import {resolvers as photosOnUserResolvers} from './photos_on_user';
import {resolvers as userFollowedBy} from './user_followedBy';
import {resolvers as userFollowing} from './user_following';
import {resolvers as userPhotoStats} from './photo_stats_on_user';
import {resolvers as userAccountDeletion} from './user_account';
import {resolvers as userSecurity} from './security';
import {resolvers as userSetting} from './user_setting';
import {resolvers as userExtended} from './user_extended';
import {resolvers as userBlock} from './user_block';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    {},
    queryResolvers,

    /* == BEGIN OF AUTO RESOLVER ==*/
    userResolvers,
    userContactResolvers,
    oauth2Resolvers,
    personalAndProfileResolvers,
    photosOnUserResolvers,
    userFollowedBy,
    userFollowing,
    userPhotoStats,
    userAccountDeletion,
    userSecurity,
    userSetting,
    userExtended,
    userBlock,
    /* == END OF AUTO RESOLVER ==*/
);
