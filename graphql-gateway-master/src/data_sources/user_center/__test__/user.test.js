import {User} from '../user';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const user = new User();

describe('[User.constructor]', () => {
  it('inheriates from Node', () => {
    expect(user).toBeInstanceOf(Node);
  });
});

describe('[User.serviceName]', () => {
  it('returns "usercenter"', () => {
    expect(user.serviceName).toEqual('usercenter');
  });
});

describe('[User.resourceType]', () => {
  it('returns "User"', () => {
    expect(user.resourceType).toEqual('User');
  });
});

describe('[User.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleUser = {
    id: 1,
    username: 'john_smith',
    firstname: 'John',
    lastname: 'Smith',
    fullname: 'John Smith',
    usertype: 1,
    registration_date: 'date',
    avatars: {
      large: {},
    },
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    user.reducer(mockSingleUser);

    expect(spy).toBeCalledWith(mockSingleUser);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(user.reducer(mockSingleUser)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(user.resourceType, mockSingleUser.id),
      legacyId: mockSingleUser.id,
      __internalId: mockSingleUser.id,
      __raw: mockSingleUser,

      canonicalPath: `/${mockSingleUser.username}`,
      username: mockSingleUser.username,
      firstName: mockSingleUser.firstname,
      lastName: mockSingleUser.lastname,
      displayName: mockSingleUser.fullname,
    });
  });
});

describe('[User.bulkLoadData]', () => {
  const mockApiResponse = [
    {
      id: 5,
      field_name: 'value_5',
    },
    {
      id: 1,
      field_name: 'value_1',
    },
  ];
  const keys = [5, 2, 1];

  const lookupById = mockApiResponse.reduce(function(map, obj) {
    map[obj.id] = obj;
    return map;
  }, {});

  it('returns the results in the expected order', async () => {
    user.context = loggedInMockContext;

    const spy = jest.spyOn(user, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await user.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    user.context = loggedInMockContext;

    const spy = jest.spyOn(user, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await user.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };

    expect(spy).toBeCalledWith('internal/graphql/users/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    user.context = loggedOutMockContext;

    const spy = jest.spyOn(user, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await user.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };

    expect(spy).toBeCalledWith('internal/graphql/users/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
