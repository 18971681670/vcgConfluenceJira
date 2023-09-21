import {resolvers} from '../photo_keyword_token';

describe('resolvers', () => {
  it('contains Mutation', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['Mutation']);
  });
});
