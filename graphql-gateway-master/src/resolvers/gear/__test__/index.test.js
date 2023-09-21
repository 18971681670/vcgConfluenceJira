import {merge} from 'lodash';

import {resolvers} from '../index.js';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as gearBrandResolvers} from '../gear_brand';
import {resolvers as lensResolvers} from '../lens';
import {resolvers as cameraResolvers} from '../camera';
import {resolvers as gearResolvers} from '../gear';
/* == END OF AUTO IMPORT ==*/

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        /* == BEGIN OF AUTO RESOLVER ==*/
        gearBrandResolvers,
        lensResolvers,
        cameraResolvers,
        gearResolvers,
        /* == END OF AUTO RESOLVER ==*/
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
