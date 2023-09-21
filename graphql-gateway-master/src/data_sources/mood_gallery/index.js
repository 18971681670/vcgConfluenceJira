import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {MoodGallery} from './mood_gallery';
import {MoodGalleryItem} from './mood_gallery_item';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from gallery microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    moodGallery: new MoodGallery(),
    moodGalleryItem: new MoodGalleryItem(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
