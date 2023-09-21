import {UserFollowerCounter} from '../user_follower_counter';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const followerCounter = new UserFollowerCounter();

describe('[UserFollowerCounter.constructor]', () => {
  it('inheriates from Node', () => {
    expect(followerCounter).toBeInstanceOf(Node);
  });
});

describe('[UserFollowerCounter.serviceName]', () => {
  it('returns "following"', () => {
    expect(followerCounter.serviceName).toEqual('following');
  });
});

describe('[UserFollowerCounter.resourceType]', () => {
  it('returns "UserFollowerCounter"', () => {
    expect(followerCounter.resourceType).toEqual('UserFollowerCounter');
  });
});

describe('[UserFollowerCounter.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleUserFollowerCounter = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    followerCounter.reducer(mockSingleUserFollowerCounter);

    expect(spy).toBeCalledWith(mockSingleUserFollowerCounter);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(followerCounter.reducer(mockSingleUserFollowerCounter)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(followerCounter.resourceType, mockSingleUserFollowerCounter.id),
      legacyId: mockSingleUserFollowerCounter.id,
      __internalId: mockSingleUserFollowerCounter.id,
      __raw: mockSingleUserFollowerCounter,

      // field mapping in UserFollowerCounter
      fieldName: mockSingleUserFollowerCounter.field_name,
    });
  });
});

describe('[UserFollowerCounter.bulkLoadData]', () => {
  const mockApiResponse = [
    {
      id: 1,
      field_name: 'value_1',
    },
    {
      id: 5,
      field_name: 'value_5',
    },
  ];
  const keys = [5, 2, 1];

  const lookupById = mockApiResponse.reduce(function(map, obj) {
    map[obj.id] = obj;
    return map;
  }, {});

  it('returns the results in the expected order', async () => {
    followerCounter.context = loggedInMockContext;

    const spy = jest.spyOn(followerCounter, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await followerCounter.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    followerCounter.context = loggedInMockContext;

    const spy = jest.spyOn(followerCounter, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await followerCounter.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/followerCounters/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    followerCounter.context = loggedOutMockContext;

    const spy = jest.spyOn(followerCounter, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await followerCounter.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/followerCounters/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
