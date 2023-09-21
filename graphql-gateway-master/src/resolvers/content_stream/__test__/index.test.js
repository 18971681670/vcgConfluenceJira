import {merge} from 'lodash';

import {resolvers} from '../index.js';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as photoPulseResolvers} from '../photo_pulse';
import {resolvers as contentStreamResolvers} from '../content_stream';
/* == END OF AUTO IMPORT ==*/

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        /* == BEGIN OF AUTO RESOLVER ==*/
        photoPulseResolvers,
        contentStreamResolvers,
        /* == END OF AUTO RESOLVER ==*/
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
