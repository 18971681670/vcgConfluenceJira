import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Homefeed} from './homefeed';
import {HomefeedItems} from './homefeedItems';
import {FeaturedPhotographer} from './featured_photographer';
import {Activityfeed} from './activityfeed';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from content-stream microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    homefeed: new Homefeed(),
    homefeedItems: new HomefeedItems(),
    featuredPhotographer: new FeaturedPhotographer(),
    activityfeed: new Activityfeed(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
