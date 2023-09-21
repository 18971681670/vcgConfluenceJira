import {resolvers} from '../query';

describe('resolvers', () => {
  it('only contains Query', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['Query']);
  });
});
