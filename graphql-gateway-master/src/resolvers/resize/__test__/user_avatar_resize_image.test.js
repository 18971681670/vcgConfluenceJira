import {resolvers} from '../user_avatar_resize_image';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['UserAvatarResizeImage']);
  });
});
