import {resolvers} from '../photo_stats_aggregation';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      'PhotoStats',
      'PhotoStatsAggregation',
    ]);
  });
});
