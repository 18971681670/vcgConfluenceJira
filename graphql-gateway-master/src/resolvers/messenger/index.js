import {merge} from 'lodash';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as userInboxConversation} from './user_inbox_conversation';
import {resolvers as conversationMessage} from './conversation_message';
import {resolvers as textMessage} from './text_message';
import {resolvers as photoMessage} from './photo_message';
import {resolvers as galleryMessage} from './gallery_message';
import {resolvers as profileMessage} from './profile_message';
import {resolvers as questMessage} from './quest_message';
import {resolvers as resourceMessage} from './resource_message';
import {resolvers as message} from './message';
import {resolvers as block} from './block';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    /* == BEGIN OF AUTO RESOLVER ==*/
    userInboxConversation,
    conversationMessage,
    textMessage,
    photoMessage,
    galleryMessage,
    profileMessage,
    questMessage,
    resourceMessage,
    message,
    block,
    /* == END OF AUTO RESOLVER ==*/
);
