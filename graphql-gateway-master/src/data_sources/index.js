/* == BEGIN OF AUTO IMPORT ==*/
import {dataSourceBuilder as resizeBuilder} from './resize';
import {dataSourceBuilder as mediaBuilder} from './media';
import {dataSourceBuilder as userCenterBuilder} from './user_center';
import {dataSourceBuilder as photoBuilder} from './photo';
import {dataSourceBuilder as questBuilder} from './quest';
import {dataSourceBuilder as membershipBuilder} from './membership';
import {dataSourceBuilder as notificationBuilder} from './notification';
import {dataSourceBuilder as galleryBuilder} from './gallery';
import {dataSourceBuilder as commentingBuilder} from './commenting';
import {dataSourceBuilder as licensingBuilder} from './licensing';
import {dataSourceBuilder as taggingBuilder} from './tagging';
import {dataSourceBuilder as locationBuilder} from './location';
import {dataSourceBuilder as followingBuilder} from './following';
import {dataSourceBuilder as likingBuilder} from './liking';
import {dataSourceBuilder as statsBuilder} from './stats';
import {dataSourceBuilder as gearBuilder} from './gear';
import {dataSourceBuilder as contentStreamBuilder} from './content_stream';
import {dataSourceBuilder as searchServiceBuilder} from './search_service';
import {dataSourceBuilder as searchBuilder} from './search';
import {dataSourceBuilder as userProfileBuilder} from './user_profile';
import {dataSourceBuilder as sitewideSettingsBuilder} from './sitewide_settings';
import {dataSourceBuilder as bossBuilder} from './boss';
import {dataSourceBuilder as flaggingBuilder} from './flagging';
import {dataSourceBuilder as workshopBuilder} from './workshop';
import {dataSourceBuilder as homefeedBuilder} from './homefeed';
import {dataSourceBuilder as monolithBuilder} from './monolith';
import {dataSourceBuilder as messengerBuilder} from './messenger';
import {dataSourceBuilder as resourceBuilder} from './resources';
import {dataSourceBuilder as portfolioBuilder} from './portfolios';
import {dataSourceBuilder as domainBuilder} from './domains';
import {dataSourceBuilder as aiDetectionBuilder} from './ai_detection';
import {dataSourceBuilder as resumeBuilder} from './resume';
import {dataSourceBuilder as exploreBuilder} from './explore';
import {dataSourceBuilder as subscriptionsBuilder} from './subscriptions';
import {dataSourceBuilder as configBuilder} from './config';
import {dataSourceBuilder as hireLocationBuilder} from './hire_location';
import {dataSourceBuilder as moodGalleryBuilder} from './mood_gallery';
import {dataSourceBuilder as storyBuilder} from './story';

/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data source object in the context of a request
 * @return {Object} A map of data sources
 */
export function dataSourceBuilder() {
  return {
    /* == BEGIN OF AUTO DATASOURCE ==*/
    UserCenter: userCenterBuilder(),
    Photo: photoBuilder(),
    Media: mediaBuilder(),
    Resize: resizeBuilder(),
    Quest: questBuilder(),
    Gallery: galleryBuilder(),
    Membership: membershipBuilder(),
    Notification: notificationBuilder(),
    Commenting: commentingBuilder(),
    Licensing: licensingBuilder(),
    Tagging: taggingBuilder(),
    Location: locationBuilder(),
    Following: followingBuilder(),
    Liking: likingBuilder(),
    Stats: statsBuilder(),
    Gear: gearBuilder(),
    ContentStream: contentStreamBuilder(),
    SearchService: searchServiceBuilder(),
    Search: searchBuilder(),
    UserProfile: userProfileBuilder(),
    SitewideSettings: sitewideSettingsBuilder(),
    Boss: bossBuilder(),
    Flagging: flaggingBuilder(),
    Workshop: workshopBuilder(),
    Homefeed: homefeedBuilder(),
    Monolith: monolithBuilder(),
    Messenger: messengerBuilder(),
    Resource: resourceBuilder(),
    Portfolio: portfolioBuilder(),
    AiDetection: aiDetectionBuilder(),
    Domain: domainBuilder(),
    Resume: resumeBuilder(),
    Explore: exploreBuilder(),
    Subscriptions: subscriptionsBuilder(),
    Config: configBuilder(),
    HireLocation: hireLocationBuilder(),
    MoodGallery: moodGalleryBuilder(),
    Story: storyBuilder(),
    /* == END OF AUTO DATASOURCE ==*/
  };
}
