import {ExtendedUser} from '../extended_user';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const extendedUser = new ExtendedUser();

describe('[ExtendedUser.constructor]', () => {
  it('inheriates from Node', () => {
    expect(extendedUser).toBeInstanceOf(Node);
  });
});

describe('[ExtendedUser.serviceName]', () => {
  it('returns "user-center"', () => {
    expect(extendedUser.serviceName).toEqual('user-center');
  });
});

describe('[ExtendedUser.resourceType]', () => {
  it('returns "ExtendedUser"', () => {
    expect(extendedUser.resourceType).toEqual('ExtendedUser');
  });
});

describe('[ExtendedUser.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleExtendedUser = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    extendedUser.reducer(mockSingleExtendedUser);

    expect(spy).toBeCalledWith(mockSingleExtendedUser);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(extendedUser.reducer(mockSingleExtendedUser)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(extendedUser.resourceType, mockSingleExtendedUser.id),
      legacyId: mockSingleExtendedUser.id,
      __internalId: mockSingleExtendedUser.id,
      __raw: mockSingleExtendedUser,

      // field mapping in ExtendedUser
      fieldName: mockSingleExtendedUser.field_name,
    });
  });
});

describe('[ExtendedUser.bulkLoadData]', () => {
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
    extendedUser.context = loggedInMockContext;

    const spy = jest.spyOn(extendedUser, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await extendedUser.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    extendedUser.context = loggedInMockContext;

    const spy = jest.spyOn(extendedUser, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await extendedUser.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/extendedUsers/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    extendedUser.context = loggedOutMockContext;

    const spy = jest.spyOn(extendedUser, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await extendedUser.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/extendedUsers/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
