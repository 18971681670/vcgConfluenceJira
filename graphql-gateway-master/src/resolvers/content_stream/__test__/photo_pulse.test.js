import {resolvers} from '../photo_pulse';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      'Pulse',
    ]);
  });
});
