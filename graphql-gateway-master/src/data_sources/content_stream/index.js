import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {PhotoPulse} from './photo_pulse';
import {ContentStream} from './content_stream';
import {StoryPulse} from './story_pulse';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from content-stream microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    photoPulse: new PhotoPulse(),
    contentStream: new ContentStream(),
    storyPulse: new StoryPulse(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
