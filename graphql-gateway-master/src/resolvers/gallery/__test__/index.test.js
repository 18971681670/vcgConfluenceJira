import {merge} from 'lodash';

import {resolvers} from '../index';

import {resolvers as queryResolvers} from '../query';
import {resolvers as galleryResolvers} from '../gallery';

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        queryResolvers,

        galleryResolvers,
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
