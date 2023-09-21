import {resolvers} from '../lens';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      'LensInfo',
      'LensOption',
      'UnverifiedLens',
      'Lens',
    ]);
  });
});
