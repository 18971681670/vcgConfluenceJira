import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {PhotoStatsAggregation} from './photo_stats_aggregation';
import {PhotoStatsLikeCountAggregationSum} from './photo_stats_like_count_aggregation_sum';
import {PhotoStatsLikeCountAggregationPhotoSum} from './photo_stats_like_count_aggregation_photo_sum';
import {PhotosOnPhotoStatsAggregation} from './photos_on_photo_stats_aggregation';
import {UserStatsAggregation} from './user_stats_aggregation';
import {UserStatsTotalFollowerCount} from './user_stats_total_follower_count';
import {FollowedByUsersOnUserStatsAggregation} from './followed_by_users_on_user_stats_aggregation';
import {UnfollowedByUsersOnUserStatsAggregation} from './unfollowed_by_users_on_user_stats_aggregation';
import {PhotoStatsCommentCountAggregationSum} from './photo_stats_comment_count_aggregation_sum';
import {PhotoStatsCommentCountAggregationPhotoSum} from './photo_stats_comment_count_aggregation_photo_sum';
import {PhotoStatsViewCountAggregationSum} from './photo_stats_view_count_aggregation_sum';
import {PhotoStatsViewSourceCountAggregationPhotoSum} from './photo_stats_view_source_count_aggregation_photo_sum';
import {PhotoStatsViewSourceCountAggregationSum} from './photo_stats_view_source_count_aggregation_sum';
import {PhotoStatsHighlightUserViewCountAggregationSum} from './photo_stats_highlight_user_view_count_aggregation_sum';
import {PhotoStatsHighlightUserFollowerCountAggregationSum} from './photo_stats_highlight_user_follower_count_aggregation_sum';
import {PhotoStatsHighlightPulseAggregationAverage} from './photo_stats_highlight_pulse_aggregation_average';
import {PhotoStatsHighlightUploadCountAggregationSum} from './photo_stats_highlight_upload_count_aggregation_sum';
import {UserStatsFollowerCountAggregationSum} from './user_stats_follower_count_aggregation_sum';
import {ServiceGlobalStatsData} from './service_stats_last_updated_at';
import {UserStatsUnFollowerCountAggregationSum} from './user_stats_unfollower_count_aggregation_sum';
import {UserPhotoStatsAggregation} from './user_on_photo_stats_aggregation';
import {StatsTracking} from './stats_tracking';
import {StatsTrackingV2} from './tracking_service_v2';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from stats microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    photoStatsAggregation: new PhotoStatsAggregation(),
    photoStatsLikeCountAggregationSum: new PhotoStatsLikeCountAggregationSum(),
    photoStatsCommentCountAggregationSum: new PhotoStatsCommentCountAggregationSum(),
    photoStatsLikeCountAggregationPhotoSum: new PhotoStatsLikeCountAggregationPhotoSum(),
    photoStatsCommentCountAggregationPhotoSum: new PhotoStatsCommentCountAggregationPhotoSum(),
    photosOnPhotoStatsAggregation: new PhotosOnPhotoStatsAggregation(),
    userStatsAggregation: new UserStatsAggregation(),
    userStatsTotalFollowerCount: new UserStatsTotalFollowerCount(),
    followedByUsersOnUserStatsAggregation: new FollowedByUsersOnUserStatsAggregation(),
    unfollowedByUsersOnUserStatsAggregation: new UnfollowedByUsersOnUserStatsAggregation(),
    photoStatsViewCountAggregationSum: new PhotoStatsViewCountAggregationSum(),
    photoStatsViewSourceCountAggregationPhotoSum: new PhotoStatsViewSourceCountAggregationPhotoSum(),
    photoStatsViewSourceCountAggregationSum: new PhotoStatsViewSourceCountAggregationSum(),
    photoStatsHighlightPulseAggregationAverage: new PhotoStatsHighlightPulseAggregationAverage(),
    photoStatsHighlightUserViewCountAggregationSum: new PhotoStatsHighlightUserViewCountAggregationSum(),
    photoStatsHighlightUserFollowerCountAggregationSum: new PhotoStatsHighlightUserFollowerCountAggregationSum(),
    photoStatsHighlightUploadCountAggregationSum: new PhotoStatsHighlightUploadCountAggregationSum(),
    userStatsFollowerCountAggregationSum: new UserStatsFollowerCountAggregationSum(),
    serviceGlobalStatsData: new ServiceGlobalStatsData(),
    userStatsUnFollowerCountAggregationSum: new UserStatsUnFollowerCountAggregationSum(),
    userPhotoStatsAggregation: new UserPhotoStatsAggregation(),
    statsTracking: new StatsTracking(),
    statsTrackingV2: new StatsTrackingV2(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
