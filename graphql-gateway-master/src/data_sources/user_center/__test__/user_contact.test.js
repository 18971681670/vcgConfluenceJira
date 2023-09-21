import {UserContact} from '../user_contact';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const userContact = new UserContact();

describe('[UserContact.constructor]', () => {
  it('inheriates from Node', () => {
    expect(userContact).toBeInstanceOf(Node);
  });
});

describe('[UserContact.serviceName]', () => {
  it('returns "user-center"', () => {
    expect(userContact.serviceName).toEqual('user-center');
  });
});

describe('[UserContact.resourceType]', () => {
  it('returns "UserContact"', () => {
    expect(userContact.resourceType).toEqual('UserContact');
  });
});

describe('[UserContact.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleUserContact = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    userContact.reducer(mockSingleUserContact);

    expect(spy).toBeCalledWith(mockSingleUserContact);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(userContact.reducer(mockSingleUserContact)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(userContact.resourceType, mockSingleUserContact.id),
      legacyId: mockSingleUserContact.id,
      __internalId: mockSingleUserContact.id,
      __raw: mockSingleUserContact,

      // field mapping in UserContact
      fieldName: mockSingleUserContact.field_name,
    });
  });
});

describe('[UserContact.bulkLoadData]', () => {
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
    userContact.context = loggedInMockContext;

    const spy = jest.spyOn(userContact, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await userContact.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    userContact.context = loggedInMockContext;

    const spy = jest.spyOn(userContact, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userContact.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userContacts/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    userContact.context = loggedOutMockContext;

    const spy = jest.spyOn(userContact, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userContact.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/userContacts/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
