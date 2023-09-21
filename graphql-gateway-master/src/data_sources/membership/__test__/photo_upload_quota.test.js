import {PhotoUploadQuota} from '../photo_upload_quota';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const photoUploadQuota = new PhotoUploadQuota();

describe('[PhotoUploadQuota.constructor]', () => {
  it('inheriates from Node', () => {
    expect(photoUploadQuota).toBeInstanceOf(Node);
  });
});

describe('[PhotoUploadQuota.serviceName]', () => {
  it('returns "membership"', () => {
    expect(photoUploadQuota.serviceName).toEqual('membership');
  });
});

describe('[PhotoUploadQuota.resourceType]', () => {
  it('returns "PhotoUploadQuota"', () => {
    expect(photoUploadQuota.resourceType).toEqual('PhotoUploadQuota');
  });
});

describe('[PhotoUploadQuota.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePhotoUploadQuota = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    photoUploadQuota.reducer(mockSinglePhotoUploadQuota);

    expect(spy).toBeCalledWith(mockSinglePhotoUploadQuota);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(photoUploadQuota.reducer(mockSinglePhotoUploadQuota)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(photoUploadQuota.resourceType, mockSinglePhotoUploadQuota.id),
      legacyId: mockSinglePhotoUploadQuota.id,
      __internalId: mockSinglePhotoUploadQuota.id,
      __raw: mockSinglePhotoUploadQuota,

      // field mapping in PhotoUploadQuota
      fieldName: mockSinglePhotoUploadQuota.field_name,
    });
  });
});

describe('[PhotoUploadQuota.bulkLoadData]', () => {
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
    photoUploadQuota.context = loggedInMockContext;

    const spy = jest.spyOn(photoUploadQuota, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await photoUploadQuota.bulkLoadData(keys);
    expect(res).toEqual([mockApiResponse[5], null, mockApiResponse[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    photoUploadQuota.context = loggedInMockContext;

    const spy = jest.spyOn(photoUploadQuota, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoUploadQuota.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoUploadQuotas/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    photoUploadQuota.context = loggedOutMockContext;

    const spy = jest.spyOn(photoUploadQuota, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoUploadQuota.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoUploadQuotas/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
