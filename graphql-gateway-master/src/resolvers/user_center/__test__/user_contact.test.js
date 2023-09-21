import {resolvers} from '../user_contact';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['UserContact', 'Mutation']);
  });
});
