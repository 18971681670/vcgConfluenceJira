import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {MyConversationList} from './my_conversation_list';
import {ConversationFeedMessage} from './conversation_feed_message';
import {Message} from './message';
import {Block} from './block';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from messenger microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    myConversationList: new MyConversationList(),
    conversationFeedMessage: new ConversationFeedMessage(),
    message: new Message(),
    block: new Block(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
