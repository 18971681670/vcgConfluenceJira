import {resolvers} from '../photo_resize_image';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['PhotoResizeImage']);
  });
});
