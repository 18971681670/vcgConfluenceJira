import {merge} from 'lodash';

import {resolvers as scalarsResolvers} from './scalars';

import {resolvers as nodeResolvers} from './node';

import {resolvers as mediaResolvers} from './media';
import {resolvers as resizeResolvers} from './resize';
import {resolvers as userCenterResolvers} from './user_center';
import {resolvers as photoResolvers} from './photo';
import {resolvers as questResolvers} from './quest';
import {resolvers as membershipResolvers} from './membership';
import {resolvers as notificationResolvers} from './notification';
import {resolvers as galleryResolvers} from './gallery';
import {resolvers as commentingResolvers} from './commenting';
import {resolvers as licensingResolvers} from './licensing';
import {resolvers as followingResolvers} from './following';
import {resolvers as likingResolvers} from './liking';
import {resolvers as statsResolvers} from './stats';
import {resolvers as gearResolvers} from './gear';
import {resolvers as contentStreamResolvers} from './content_stream';
import {resolvers as bossResolvers} from './boss';
import {resolvers as flaggingResolvers} from './flagging';
import {resolvers as workshopResolvers} from './workshop';
import {resolvers as homefeedResolvers} from './homefeed';
import {resolvers as groupResolvers} from './group';
import {resolvers as resourceResolvers} from './resources';
import {resolvers as messengerResolvers} from './messenger';
import {resolvers as portfolioResolvers} from './portfolios';
import {resolvers as domainResolvers} from './domains';
import {resolvers as aiDetectionResolvers} from './ai_detection';
import {resolvers as resumeResolvers} from './resume';
import {resolvers as exploreResolvers} from './explore';
import {resolvers as searchResolvers} from './search';
import {resolvers as configResolvers} from './config';
import {resolvers as hireLocationResolvers} from './hire_location';
import {resolvers as locationResolvers} from './location';
import {resolvers as storyResolvers} from './story';
import {resolvers as moodResolvers} from './mood_gallery';

// A map of functions which return data for the schema.
export const resolvers = merge(
    {},
    scalarsResolvers,
    nodeResolvers,
    mediaResolvers,
    resizeResolvers,
    userCenterResolvers,
    photoResolvers,
    questResolvers,
    membershipResolvers,
    notificationResolvers,
    galleryResolvers,
    commentingResolvers,
    licensingResolvers,
    followingResolvers,
    likingResolvers,
    statsResolvers,
    gearResolvers,
    contentStreamResolvers,
    bossResolvers,
    flaggingResolvers,
    workshopResolvers,
    homefeedResolvers,
    groupResolvers,
    resourceResolvers,
    messengerResolvers,
    portfolioResolvers,
    aiDetectionResolvers,
    domainResolvers,
    resumeResolvers,
    exploreResolvers,
    searchResolvers,
    configResolvers,
    hireLocationResolvers,
    locationResolvers,
    storyResolvers,
    moodResolvers,
);
