import {merge} from 'lodash';
import {resolvers} from '../index.js';
import {resolvers as queryResolvers} from '../query';

/* == BEGIN OF AUTO IMPORT ==*/
/* == END OF AUTO IMPORT ==*/

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        /* == BEGIN OF AUTO RESOLVER ==*/
        queryResolvers,
        /* == END OF AUTO RESOLVER ==*/
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
