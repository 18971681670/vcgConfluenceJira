import {resolvers} from '../camera';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      'CameraInfo',
      'CameraOption',
      'UnverifiedCamera',
      'Camera',
    ]);
  });
});
