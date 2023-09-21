import {PhotosOnGallery} from '../photos_on_gallery';
import {API} from '../../base/api';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new PhotosOnGallery();

describe('[PhotosOnGallery.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[PhotosOnGallery.serviceName]', () => {
  it('returns "gallery"', () => {
    expect(dataSource.serviceName).toEqual('gallery');
  });
});

describe('[PhotosOnGallery.paginatedPhotoIdList]', () => {
  const mockApiResponse = {
    photo_ids: [1, 2, 3],
    total_items: 3,
  };

  it('returns a list of Photo IDs', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedPhotoIdList({}, internalId);
    expect(res).toEqual({
      __photoIds: mockApiResponse.photo_ids,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
