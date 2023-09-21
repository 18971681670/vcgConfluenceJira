import {GroupedNotification} from '../grouped_notification';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const groupedNotification = new GroupedNotification();

describe('[GroupedNotification.constructor]', () => {
  it('inheriates from Node', () => {
    expect(groupedNotification).toBeInstanceOf(Node);
  });
});

describe('[GroupedNotification.serviceName]', () => {
  it('returns "notification"', () => {
    expect(groupedNotification.serviceName).toEqual('notification');
  });
});

describe('[GroupedNotification.resourceType]', () => {
  it('returns "GroupedNotification"', () => {
    expect(groupedNotification.resourceType).toEqual('GroupedNotification');
  });
});

describe('[GroupedNotification.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleGroupedNotification = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    groupedNotification.reducer(mockSingleGroupedNotification);

    expect(spy).toBeCalledWith(mockSingleGroupedNotification);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(groupedNotification.reducer(mockSingleGroupedNotification)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(groupedNotification.resourceType, mockSingleGroupedNotification.id),
      legacyId: mockSingleGroupedNotification.id,
      __internalId: mockSingleGroupedNotification.id,
      __raw: mockSingleGroupedNotification,

      // field mapping in GroupedNotification
      fieldName: mockSingleGroupedNotification.field_name,
    });
  });
});

describe('[GroupedNotification.bulkLoadData]', () => {
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
    groupedNotification.context = loggedInMockContext;

    const spy = jest.spyOn(groupedNotification, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await groupedNotification.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    groupedNotification.context = loggedInMockContext;

    const spy = jest.spyOn(groupedNotification, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await groupedNotification.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/groupedNotifications/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    groupedNotification.context = loggedOutMockContext;

    const spy = jest.spyOn(groupedNotification, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await groupedNotification.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/groupedNotifications/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
