import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {GroupedNotification} from './grouped_notification';
import {MyGroupedNotifications} from './my_grouped_notifications';
import {Notification} from './notification';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from Notification microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    groupedNotification: new GroupedNotification(),
    myGroupedNotifications: new MyGroupedNotifications(),
    notification: new Notification(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
