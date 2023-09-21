import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Quest} from './quest';
import {QuestFeed} from './quest_feed';
import {QuestPhotos} from './quest_photos';
import {QuestGeofences} from './quest_geofences';
import {QuestShortlist} from './quest_shortlist';
import {Questjudge} from './quest_judge';
import {QuestTopic} from './quest_topic';
import {CampaignSignup} from './campaign_signup';
import {QuestHeader} from './quest_header';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from quest microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    quest: new Quest(),
    questFeed: new QuestFeed(),
    questPhotos: new QuestPhotos(),
    questGeofences: new QuestGeofences(),
    questShortlist: new QuestShortlist(),
    questjudge: new Questjudge(),
    questTopic: new QuestTopic(),
    campaignSignup: new CampaignSignup(),
    questHeader: new QuestHeader(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
