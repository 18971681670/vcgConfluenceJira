import {resolvers} from '../location';

describe('resolvers', () => {
  it('only contains Query', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['Query']);
  });
});
