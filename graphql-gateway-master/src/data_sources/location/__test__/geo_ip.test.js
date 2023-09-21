import {GeoIp} from '../geo_ip';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const geoIp = new GeoIp();

describe('[GeoIp.constructor]', () => {
  it('inheriates from Node', () => {
    expect(geoIp).toBeInstanceOf(Node);
  });
});

describe('[GeoIp.serviceName]', () => {
  it('returns "Location"', () => {
    expect(geoIp.serviceName).toEqual('Location');
  });
});

describe('[GeoIp.resourceType]', () => {
  it('returns "GeoIp"', () => {
    expect(geoIp.resourceType).toEqual('GeoIp');
  });
});

describe('[GeoIp.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleGeoIp = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    geoIp.reducer(mockSingleGeoIp);

    expect(spy).toBeCalledWith(mockSingleGeoIp);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(geoIp.reducer(mockSingleGeoIp)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(geoIp.resourceType, mockSingleGeoIp.id),
      legacyId: mockSingleGeoIp.id,
      __internalId: mockSingleGeoIp.id,
      __raw: mockSingleGeoIp,

      // field mapping in GeoIp
      fieldName: mockSingleGeoIp.field_name,
    });
  });
});

describe('[GeoIp.bulkLoadData]', () => {
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
    geoIp.context = loggedInMockContext;

    const spy = jest.spyOn(geoIp, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await geoIp.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    geoIp.context = loggedInMockContext;

    const spy = jest.spyOn(geoIp, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await geoIp.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/geoIps/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    geoIp.context = loggedOutMockContext;

    const spy = jest.spyOn(geoIp, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await geoIp.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/geoIps/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
