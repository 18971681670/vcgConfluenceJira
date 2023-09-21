import {merge} from 'lodash';


/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as groupedNotificationResolvers} from './grouped_notification';
import {resolvers as myGroupedNotificationsResolvers} from './my_grouped_notifications';
import {resolvers as myNotificationsResolvers} from './notification';
import {resolvers as queryResolvers} from './query';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    {},
    /* == BEGIN OF AUTO RESOLVER ==*/
    groupedNotificationResolvers,
    myGroupedNotificationsResolvers,
    myNotificationsResolvers,
    queryResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
