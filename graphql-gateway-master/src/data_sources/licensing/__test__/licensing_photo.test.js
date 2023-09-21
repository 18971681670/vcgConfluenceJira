import {LicensingPhoto} from '../licensing_photo';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const licensingPhoto = new LicensingPhoto();

describe('[LicensingPhoto.constructor]', () => {
  it('inheriates from Node', () => {
    expect(licensingPhoto).toBeInstanceOf(Node);
  });
});

describe('[LicensingPhoto.serviceName]', () => {
  it('returns "licensing"', () => {
    expect(licensingPhoto.serviceName).toEqual('licensing');
  });
});

describe('[LicensingPhoto.resourceType]', () => {
  it('returns "LicensingPhoto"', () => {
    expect(licensingPhoto.resourceType).toEqual('LicensingPhoto');
  });
});

describe('[LicensingPhoto.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleLicensingPhoto = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    licensingPhoto.reducer(mockSingleLicensingPhoto);

    expect(spy).toBeCalledWith(mockSingleLicensingPhoto);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(licensingPhoto.reducer(mockSingleLicensingPhoto)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(licensingPhoto.resourceType, mockSingleLicensingPhoto.id),
      legacyId: mockSingleLicensingPhoto.id,
      __internalId: mockSingleLicensingPhoto.id,
      __raw: mockSingleLicensingPhoto,

      // field mapping in LicensingPhoto
      fieldName: mockSingleLicensingPhoto.field_name,
    });
  });
});

describe('[LicensingPhoto.bulkLoadData]', () => {
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
    licensingPhoto.context = loggedInMockContext;

    const spy = jest.spyOn(licensingPhoto, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await licensingPhoto.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    licensingPhoto.context = loggedInMockContext;

    const spy = jest.spyOn(licensingPhoto, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await licensingPhoto.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/licensingPhotos/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    licensingPhoto.context = loggedOutMockContext;

    const spy = jest.spyOn(licensingPhoto, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await licensingPhoto.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/licensingPhotos/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
