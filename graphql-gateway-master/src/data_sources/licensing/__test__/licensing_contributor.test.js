import {LicensingContributor} from '../licensing_contributor';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const licensingContributor = new LicensingContributor();

describe('[LicensingContributor.constructor]', () => {
  it('inheriates from Node', () => {
    expect(licensingContributor).toBeInstanceOf(Node);
  });
});

describe('[LicensingContributor.serviceName]', () => {
  it('returns "licensing"', () => {
    expect(licensingContributor.serviceName).toEqual('licensing');
  });
});

describe('[LicensingContributor.resourceType]', () => {
  it('returns "LicensingContributor"', () => {
    expect(licensingContributor.resourceType).toEqual('LicensingContributor');
  });
});

describe('[LicensingContributor.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleLicensingContributor = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    licensingContributor.reducer(mockSingleLicensingContributor);

    expect(spy).toBeCalledWith(mockSingleLicensingContributor);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(licensingContributor.reducer(mockSingleLicensingContributor)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(licensingContributor.resourceType, mockSingleLicensingContributor.id),
      legacyId: mockSingleLicensingContributor.id,
      __internalId: mockSingleLicensingContributor.id,
      __raw: mockSingleLicensingContributor,

      // field mapping in LicensingContributor
      fieldName: mockSingleLicensingContributor.field_name,
    });
  });
});

describe('[LicensingContributor.bulkLoadData]', () => {
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
    licensingContributor.context = loggedInMockContext;

    const spy = jest.spyOn(licensingContributor, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await licensingContributor.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    licensingContributor.context = loggedInMockContext;

    const spy = jest.spyOn(licensingContributor, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await licensingContributor.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/licensingContributors/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    licensingContributor.context = loggedOutMockContext;

    const spy = jest.spyOn(licensingContributor, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await licensingContributor.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/licensingContributors/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
