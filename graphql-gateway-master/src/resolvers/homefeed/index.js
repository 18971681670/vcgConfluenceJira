import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as homefeedResovers} from './homefeed';
import {resolvers as featuredPhotographerResovers} from './featured_photographer';
import {resolvers as activityfeedResovers} from './activityfeed';
import {resolvers as OnboardingCategoryResovers} from './onboarding_category';
import {resolvers as ForYouFeedResovers} from './for_you_feed';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    homefeedResovers,
    featuredPhotographerResovers,
    activityfeedResovers,
    OnboardingCategoryResovers,
    ForYouFeedResovers,
    /* == END OF AUTO RESOLVER ==*/
);

