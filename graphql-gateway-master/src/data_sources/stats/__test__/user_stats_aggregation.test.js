import {UserStatsAggregation} from '../user_stats_aggregation';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const userStatsAggregation = new UserStatsAggregation();

describe('[UserStatsAggregation.constructor]', () => {
  it('inheriates from Node', () => {
    expect(userStatsAggregation).toBeInstanceOf(Node);
  });
});

describe('[UserStatsAggregation.serviceName]', () => {
  it('returns "stats"', () => {
    expect(userStatsAggregation.serviceName).toEqual('stats');
  });
});

describe('[UserStatsAggregation.resourceType]', () => {
  it('returns "UserStatsAggregation"', () => {
    expect(userStatsAggregation.resourceType).toEqual('UserStatsAggregation');
  });
});

describe('[UserStatsAggregation.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleUserStatsAggregation = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    userStatsAggregation.reducer(mockSingleUserStatsAggregation);

    expect(spy).toBeCalledWith(mockSingleUserStatsAggregation);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(userStatsAggregation.reducer(mockSingleUserStatsAggregation)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(userStatsAggregation.resourceType, mockSingleUserStatsAggregation.id),
      legacyId: mockSingleUserStatsAggregation.id,
      __internalId: mockSingleUserStatsAggregation.id,
      __raw: mockSingleUserStatsAggregation,

      // field mapping in UserStatsAggregation
      fieldName: mockSingleUserStatsAggregation.field_name,
    });
  });
});

describe('[UserStatsAggregation.bulkLoadData]', () => {
  const mockApiResponse = {
    '1': {
      id: 1,
      field_name: 'value_1',
    },
    '5': {
      id: 5,
      field_name: 'value_5',
    },
  };
  const keys = [5, 2, 1];

  it('returns the results in the expected order', async () => {
    userStatsAggregation.context = loggedInMockContext;

    const spy = jest.spyOn(userStatsAggregation, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await userStatsAggregation.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    userStatsAggregation.context = loggedInMockContext;

    const spy = jest.spyOn(userStatsAggregation, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userStatsAggregation.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userStatsAggregations/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    userStatsAggregation.context = loggedOutMockContext;

    const spy = jest.spyOn(userStatsAggregation, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userStatsAggregation.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userStatsAggregations/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
