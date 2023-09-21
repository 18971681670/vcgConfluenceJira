import {UserFollowedByMeState} from '../user_followed_by_me_state';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const userFollowedByMeState = new UserFollowedByMeState();

describe('[UserFollowedByMeState.constructor]', () => {
  it('inheriates from Node', () => {
    expect(userFollowedByMeState).toBeInstanceOf(Node);
  });
});

describe('[UserFollowedByMeState.serviceName]', () => {
  it('returns "following"', () => {
    expect(userFollowedByMeState.serviceName).toEqual('following');
  });
});

describe('[UserFollowedByMeState.resourceType]', () => {
  it('returns "UserFollowedByMeState"', () => {
    expect(userFollowedByMeState.resourceType).toEqual('UserFollowedByMeState');
  });
});

describe('[UserFollowedByMeState.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleUserFollowedByMeState = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    userFollowedByMeState.reducer(mockSingleUserFollowedByMeState);

    expect(spy).toBeCalledWith(mockSingleUserFollowedByMeState);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(userFollowedByMeState.reducer(mockSingleUserFollowedByMeState)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(userFollowedByMeState.resourceType, mockSingleUserFollowedByMeState.id),
      legacyId: mockSingleUserFollowedByMeState.id,
      __internalId: mockSingleUserFollowedByMeState.id,
      __raw: mockSingleUserFollowedByMeState,

      // field mapping in UserFollowedByMeState
      fieldName: mockSingleUserFollowedByMeState.field_name,
    });
  });
});

describe('[UserFollowedByMeState.bulkLoadData]', () => {
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
    userFollowedByMeState.context = loggedInMockContext;

    const spy = jest.spyOn(userFollowedByMeState, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await userFollowedByMeState.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    userFollowedByMeState.context = loggedInMockContext;

    const spy = jest.spyOn(userFollowedByMeState, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userFollowedByMeState.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userFollowedByMeStates/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    userFollowedByMeState.context = loggedOutMockContext;

    const spy = jest.spyOn(userFollowedByMeState, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userFollowedByMeState.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userFollowedByMeStates/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
