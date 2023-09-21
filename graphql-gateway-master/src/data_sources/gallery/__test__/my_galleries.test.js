import {API} from '../../base/api';
import {MyGalleries} from '../my_galleries';
import {Gallery} from '../gallery';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new MyGalleries();

describe('[MyGalleries.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[MyGalleries.serviceName]', () => {
  it('returns "gallery"', () => {
    expect(dataSource.serviceName).toEqual('gallery');
  });
});

describe('[MyGalleries.paginatedGalleryList]', () => {
  const mockApiResponse = {
    galleries: [
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

  it('returns a list of Gallery resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedGalleryList({}, internalId);
    const __galleries = mockApiResponse.galleries.map((obj) => Gallery.prototype.reducer(obj));
    expect(res).toEqual({
      __galleries,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
