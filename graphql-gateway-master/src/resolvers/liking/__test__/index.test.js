import {merge} from 'lodash';

import {resolvers} from '../index';

import {resolvers as queryResolvers} from '../query';

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        queryResolvers,
        // TODO Add any additional resource resolvers
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
