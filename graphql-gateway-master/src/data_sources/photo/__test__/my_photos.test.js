import {API} from '../../base/api';
import {MyPhotos} from '../my_photos';
import {Photo} from '../photo';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new MyPhotos();

describe('[MyPhotos.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[MyPhotos.serviceName]', () => {
  it('returns "photo"', () => {
    expect(dataSource.serviceName).toEqual('photo');
  });
});

describe('[MyPhotos.paginatedPhotoList]', () => {
  const mockApiResponse = {
    photos: [
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

  it('returns a list of Photo resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedPhotoList({}, internalId);
    const __photos = mockApiResponse.photos.map((obj) => Photo.prototype.reducer(obj));
    expect(res).toEqual({
      __photos,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
