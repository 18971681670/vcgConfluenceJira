import {Microservice} from '../base/microservice';
import MeFollowingUser from './me_following_user';
import WorkshopSearch from './workshop_search';
import {PhotoSearch} from './photos';
import {GallerySearch} from './galleries';
import {UserSearch} from './users';
import {PhotoDiscoverSearch} from './photo_discover';
import {GearStatsAggregation} from './gear_stats_aggregation';
/* == BEGIN OF AUTO IMPORT ==*/
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from search microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    myFollowingUser: new MeFollowingUser(),
    workshopSearch: new WorkshopSearch(),
    photoSearch: new PhotoSearch(),
    gallerySearch: new GallerySearch(),
    userSearch: new UserSearch(),
    photoDiscoverSearch: new PhotoDiscoverSearch(),
    gearStatsAggregation: new GearStatsAggregation(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
