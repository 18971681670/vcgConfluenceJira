import {merge} from 'lodash';

import {resolvers} from '../index';


/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as groupedNotificationResolvers} from '../grouped_notification';
import {resolvers as myGroupedNotificationsResolvers} from '../my_grouped_notifications';
import {resolvers as myNotificationsResolvers} from '../notification';
import {resolvers as queryResolvers} from '../query';
/* == END OF AUTO IMPORT ==*/

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        {},

        /* == BEGIN OF AUTO RESOLVER ==*/
        groupedNotificationResolvers,
        myGroupedNotificationsResolvers,
        myNotificationsResolvers,
        queryResolvers,
        /* == END OF AUTO RESOLVER ==*/
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
