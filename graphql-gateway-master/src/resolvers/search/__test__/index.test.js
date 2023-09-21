import {merge} from 'lodash';

import {resolvers} from '../index.js';
import {resolvers as photoSearch} from '../photos';
import {resolvers as gallerySearch} from '../galleries';
import {resolvers as userSearch} from '../users';
import {resolvers as photoDiscoverSearch} from '../discover';
/* == BEGIN OF AUTO IMPORT ==*/
/* == END OF AUTO IMPORT ==*/

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        {},
        photoSearch,
        gallerySearch,
        userSearch,
        photoDiscoverSearch,
        /* == BEGIN OF AUTO RESOLVER ==*/
        /* == END OF AUTO RESOLVER ==*/
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
