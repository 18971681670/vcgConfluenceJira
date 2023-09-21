import {resolvers} from '../user_followed_by_me_state';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['Mutation']);
  });
});
