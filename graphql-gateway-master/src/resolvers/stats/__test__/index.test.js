import {merge} from 'lodash';

import {resolvers} from '../index.js';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as photoStatsAggregationResolvers} from '../photo_stats_aggregation';
import {resolvers as myStatsResolvers} from '../my_stats';
import {resolvers as userStatsAggregationResolvers} from '../user_stats_aggregation';
/* == END OF AUTO IMPORT ==*/

describe('resolvers', () => {
  it('combines query/mutation/resource resolvers', async () => {
    const combinedResolvers = merge(
        /* == BEGIN OF AUTO RESOLVER ==*/
        photoStatsAggregationResolvers,
        myStatsResolvers,
        userStatsAggregationResolvers,
        /* == END OF AUTO RESOLVER ==*/
    );

    expect(resolvers).toEqual(combinedResolvers);
  });
});
