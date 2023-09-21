import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Photo} from './photo';
import {WithShortlist} from './with_shortlist';
import {MyPhotos} from './my_photos';
import {PhotoUploadQuota} from './photo_upload_quota';
import {PhotoViewCount} from './photo_view';
import {PhotoKeyWordToken} from './photo_keyword_token';
import {UserPhotos} from './user_photos';
import {PhotosAggregateStats} from './photos_aggregate_stats';
import {WithQuest} from './with_quest';

/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from photo microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    withShortlist: new WithShortlist(),
    withQuest: new WithQuest(),
    /* == BEGIN OF AUTO DATASOURCE ==*/
    photo: new Photo(),
    myPhotos: new MyPhotos(),
    photoUploadQuota: new PhotoUploadQuota(),
    photoViewCount: new PhotoViewCount(),
    photoKeyWordToken: new PhotoKeyWordToken(),
    userPhotos: new UserPhotos(),
    photosAggregateStats: new PhotosAggregateStats(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
