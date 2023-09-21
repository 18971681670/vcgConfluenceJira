import {merge} from 'lodash';

import {resolvers} from '../index';

import {resolvers as queryResolvers} from '../query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as userAvatarResizeImage} from '../user_avatar_resize_image';
import {resolvers as photoResizeImage} from '../photo_resize_image';
import {resolvers as licensingPhotoResizeImage} from '../licensing_photo_resize_image';
/* == END OF AUTO IMPORT ==*/

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        {},
        queryResolvers,

        /* == BEGIN OF AUTO RESOLVER ==*/
        userAvatarResizeImage,
        photoResizeImage,
        licensingPhotoResizeImage,
        /* == END OF AUTO RESOLVER ==*/
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
