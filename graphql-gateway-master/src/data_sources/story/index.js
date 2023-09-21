import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Story} from './story';
import {StoryItem} from './story_item';
import {StoryViewCount} from './story_view_count';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from gallery microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    story: new Story(),
    storyItem: new StoryItem(),
    storyViewCount: new StoryViewCount(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
