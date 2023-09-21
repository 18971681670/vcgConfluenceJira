import {merge} from 'lodash';

import {resolvers} from '../index';

import {resolvers as queryResolvers} from '../query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as userAvatarResolvers} from '../user_avatar';
/* == END OF AUTO IMPORT ==*/

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        {},
        queryResolvers,

        /* == BEGIN OF AUTO RESOLVER ==*/
        userAvatarResolvers,
        /* == END OF AUTO RESOLVER ==*/
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
