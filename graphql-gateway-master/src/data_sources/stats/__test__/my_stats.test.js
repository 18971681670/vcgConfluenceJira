import {API} from '../../base/api';
import {MyStats} from '../my_stats';
import {Stat} from '../stat';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new MyStats();

describe('[MyStats.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[MyStats.serviceName]', () => {
  it('returns "stats"', () => {
    expect(dataSource.serviceName).toEqual('stats');
  });
});

describe('[MyStats.paginatedStatList]', () => {
  const mockApiResponse = {
    stats: [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ],
    total_items: 3,
  };

  it('returns a list of Stat resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedStatList({}, internalId);
    const __stats = mockApiResponse.stats.map((obj) => Stat.prototype.reducer(obj));
    expect(res).toEqual({
      __stats,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
