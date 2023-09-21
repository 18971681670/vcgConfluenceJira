import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as myStatsResolvers} from './my_stats';
import {resolvers as statsHighlightResolvers} from './stats_highlight';
import {resolvers as photoStatsAggregationResolvers} from './photo_stats_aggregation';
import {resolvers as photosOnPhotoStatsAggregationResolvers} from './photos_on_photo_stats_aggregation';
import {resolvers as userStatsAggregationResolvers} from './user_stats_aggregation';
import {
  resolvers as followedByUsersOnUserStatsAggregationResolvers,
} from './followed_by_users_on_user_stats_aggregation';
import {
  resolvers as unfollowedByUsersOnUserStatsAggregationResolvers,
} from './unfollowed_by_users_on_user_stats_aggregation';
import {resolvers as statsTrackingResolvers} from './stats_tracking';

import {resolvers as viewStatAdminResolvers} from './view_stat_admin';

/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    myStatsResolvers,
    statsHighlightResolvers,
    photoStatsAggregationResolvers,
    photosOnPhotoStatsAggregationResolvers,
    userStatsAggregationResolvers,
    followedByUsersOnUserStatsAggregationResolvers,
    unfollowedByUsersOnUserStatsAggregationResolvers,
    statsTrackingResolvers,
    viewStatAdminResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
