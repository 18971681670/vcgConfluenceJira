import {UserEquipment} from '../user_equipment';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const userEquipment = new UserEquipment();

describe('[UserEquipment.constructor]', () => {
  it('inheriates from Node', () => {
    expect(userEquipment).toBeInstanceOf(Node);
  });
});

describe('[UserEquipment.serviceName]', () => {
  it('returns "user_profile"', () => {
    expect(userEquipment.serviceName).toEqual('user_profile');
  });
});

describe('[UserEquipment.resourceType]', () => {
  it('returns "UserEquipment"', () => {
    expect(userEquipment.resourceType).toEqual('UserEquipment');
  });
});

describe('[UserEquipment.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleUserEquipment = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    userEquipment.reducer(mockSingleUserEquipment);

    expect(spy).toBeCalledWith(mockSingleUserEquipment);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(userEquipment.reducer(mockSingleUserEquipment)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(userEquipment.resourceType, mockSingleUserEquipment.id),
      legacyId: mockSingleUserEquipment.id,
      __internalId: mockSingleUserEquipment.id,
      __raw: mockSingleUserEquipment,

      // field mapping in UserEquipment
      fieldName: mockSingleUserEquipment.field_name,
    });
  });
});

describe('[UserEquipment.bulkLoadData]', () => {
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
    userEquipment.context = loggedInMockContext;

    const spy = jest.spyOn(userEquipment, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await userEquipment.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    userEquipment.context = loggedInMockContext;

    const spy = jest.spyOn(userEquipment, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userEquipment.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userEquipments/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    userEquipment.context = loggedOutMockContext;

    const spy = jest.spyOn(userEquipment, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userEquipment.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userEquipments/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
