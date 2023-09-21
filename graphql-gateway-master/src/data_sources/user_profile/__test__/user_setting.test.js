import {UserSetting} from '../user_setting';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const userSetting = new UserSetting();

describe('[UserSetting.constructor]', () => {
  it('inheriates from Node', () => {
    expect(userSetting).toBeInstanceOf(Node);
  });
});

describe('[UserSetting.serviceName]', () => {
  it('returns "user_profile"', () => {
    expect(userSetting.serviceName).toEqual('user_profile');
  });
});

describe('[UserSetting.resourceType]', () => {
  it('returns "UserSetting"', () => {
    expect(userSetting.resourceType).toEqual('UserSetting');
  });
});

describe('[UserSetting.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleUserSetting = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    userSetting.reducer(mockSingleUserSetting);

    expect(spy).toBeCalledWith(mockSingleUserSetting);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(userSetting.reducer(mockSingleUserSetting)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(userSetting.resourceType, mockSingleUserSetting.id),
      legacyId: mockSingleUserSetting.id,
      __internalId: mockSingleUserSetting.id,
      __raw: mockSingleUserSetting,

      // field mapping in UserSetting
      fieldName: mockSingleUserSetting.field_name,
    });
  });
});

describe('[UserSetting.bulkLoadData]', () => {
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
    userSetting.context = loggedInMockContext;

    const spy = jest.spyOn(userSetting, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await userSetting.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    userSetting.context = loggedInMockContext;

    const spy = jest.spyOn(userSetting, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userSetting.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userSettings/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    userSetting.context = loggedOutMockContext;

    const spy = jest.spyOn(userSetting, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userSetting.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userSettings/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
