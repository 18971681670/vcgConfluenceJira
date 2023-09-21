import {API} from '../../base/api';
import {MyLicensingPhotos} from '../my_licensing_photos';
import {LicensingPhoto} from '../licensing_photo';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new MyLicensingPhotos();

describe('[MyLicensingPhotos.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[MyLicensingPhotos.serviceName]', () => {
  it('returns "licensing"', () => {
    expect(dataSource.serviceName).toEqual('licensing');
  });
});

describe('[MyLicensingPhotos.paginatedLicensingPhotoList]', () => {
  const mockApiResponse = {
    licensing_photos: [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ],
    total_items: 3,
  };

  it('returns a list of LicensingPhoto resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedLicensingPhotoList({}, internalId);
    const __licensingPhotos = mockApiResponse.licensing_photos.map((obj) => LicensingPhoto.prototype.reducer(obj));
    expect(res).toEqual({
      __licensingPhotos,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
