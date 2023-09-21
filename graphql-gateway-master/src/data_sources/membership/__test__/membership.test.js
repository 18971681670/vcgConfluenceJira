import {Membership} from '../membership';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const membership = new Membership();

describe('[Membership.constructor]', () => {
  it('inheriates from Node', () => {
    expect(membership).toBeInstanceOf(Node);
  });
});

describe('[Membership.serviceName]', () => {
  it('returns "membership"', () => {
    expect(membership.serviceName).toEqual('membership');
  });
});

describe('[Membership.resourceType]', () => {
  it('returns "Membership"', () => {
    expect(membership.resourceType).toEqual('Membership');
  });
});

describe('[Membership.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleMembership = {
    id: 1,
    member_status: 2,
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    membership.reducer(mockSingleMembership);

    expect(spy).toBeCalledWith(mockSingleMembership);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(membership.reducer(mockSingleMembership)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(membership.resourceType, mockSingleMembership.id),
      legacyId: mockSingleMembership.id,
      __internalId: mockSingleMembership.id,
      __raw: mockSingleMembership,

      tier: 'PRO',
    });
  });
});

describe('[Membership.bulkLoadData]', () => {
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
    membership.context = loggedInMockContext;

    const spy = jest.spyOn(membership, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await membership.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    membership.context = loggedInMockContext;

    const spy = jest.spyOn(membership, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await membership.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/memberships/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    membership.context = loggedOutMockContext;

    const spy = jest.spyOn(membership, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await membership.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/memberships/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
