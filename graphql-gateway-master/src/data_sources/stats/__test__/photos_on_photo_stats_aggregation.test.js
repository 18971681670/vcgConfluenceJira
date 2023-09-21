import {PhotosOnPhotoStatsAggregation} from '../photos_on_photo_stats_aggregation';
import {API} from '../../base/api';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new PhotosOnPhotoStatsAggregation();

describe('[PhotosOnPhotoStatsAggregation.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[PhotosOnPhotoStatsAggregation.serviceName]', () => {
  it('returns "stats"', () => {
    expect(dataSource.serviceName).toEqual('stats');
  });
});

describe('[PhotosOnPhotoStatsAggregation.paginatedPhotoIdList]', () => {
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
