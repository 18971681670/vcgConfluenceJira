import {AuthorizedFeature} from '../authorized_feature';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const authorizedFeature = new AuthorizedFeature();

describe('[AuthorizedFeature.constructor]', () => {
  it('inheriates from Node', () => {
    expect(authorizedFeature).toBeInstanceOf(Node);
  });
});

describe('[AuthorizedFeature.serviceName]', () => {
  it('returns "membership"', () => {
    expect(authorizedFeature.serviceName).toEqual('membership');
  });
});

describe('[AuthorizedFeature.resourceType]', () => {
  it('returns "AuthorizedFeature"', () => {
    expect(authorizedFeature.resourceType).toEqual('AuthorizedFeature');
  });
});

describe('[AuthorizedFeature.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleAuthorizedFeature = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    authorizedFeature.reducer(mockSingleAuthorizedFeature);

    expect(spy).toBeCalledWith(mockSingleAuthorizedFeature);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(authorizedFeature.reducer(mockSingleAuthorizedFeature)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(authorizedFeature.resourceType, mockSingleAuthorizedFeature.id),
      legacyId: mockSingleAuthorizedFeature.id,
      __internalId: mockSingleAuthorizedFeature.id,
      __raw: mockSingleAuthorizedFeature,

      // field mapping in AuthorizedFeature
      fieldName: mockSingleAuthorizedFeature.field_name,
    });
  });
});

describe('[AuthorizedFeature.bulkLoadData]', () => {
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
    authorizedFeature.context = loggedInMockContext;

    const spy = jest.spyOn(authorizedFeature, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await authorizedFeature.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    authorizedFeature.context = loggedInMockContext;

    const spy = jest.spyOn(authorizedFeature, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await authorizedFeature.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/authorizedFeatures/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    authorizedFeature.context = loggedOutMockContext;

    const spy = jest.spyOn(authorizedFeature, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await authorizedFeature.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/authorizedFeatures/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
