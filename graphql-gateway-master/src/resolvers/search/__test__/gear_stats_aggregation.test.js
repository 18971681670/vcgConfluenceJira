// import {resolvers} from '../gear_stats_aggregation';

xdescribe('gearStatsAggregation resolvers', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      Search: {
        gearStatsAggregation: {
          dateHistogram: jest.fn(),
          best100PhotoIds: jest.fn(),
          topPhotographers: jest.fn(),
          topCategories: jest.fn(),
        },
      },
      Photo: {
        photo: {
          findByInternalIds: jest.fn(),
        },
      },
    };
  });

  it('should return dateHistogram, best100photos and topPhotographers', async () => {
    const exp = [{key: 'k1', value: 1.0}, {key: 'k2', value: 0.5}];
    const ids = ['10000000', '11110000'];
    const photographerIds = ['10000000', '10000001', '10000002'];
    const bestPhotos = [{}];
    const topPhotographers =[];
    const topCategories = [];
    const gearType = 'CAMERA';
    const gearId = '1234';
    dataSources.Search.gearStatsAggregation.dateHistogram.mockResolvedValueOnce(exp);
    dataSources.Search.gearStatsAggregation.best100PhotoIds.mockResolvedValue(ids);
    dataSources.Search.gearStatsAggregation.topPhotographers.mockResolvedValue(photographerIds);
    dataSources.Search.gearStatsAggregation.topCategories.mockResolvedValue(topCategories);
    dataSources.Photo.photo.findByInternalIds.mockResolvedValueOnce(bestPhotos).mockResolvedValueOnce(topPhotographers);
    const result = await resolvers.Query.gearStatsAggregation(null, {
      type: gearType,
      legacyId: gearId,
    }, {dataSources});
    expect(result).toEqual({
      legacyId: '1234',
      dateHistogram: exp,
      best100Photos: bestPhotos,
      topPhotographers: topPhotographers,
      topCategories: [],
    });
    expect(dataSources.Search.gearStatsAggregation.dateHistogram).toHaveBeenCalledTimes(1);
    expect(dataSources.Search.gearStatsAggregation.dateHistogram).toHaveBeenCalledWith(gearType, gearId);
    expect(dataSources.Search.gearStatsAggregation.best100PhotoIds).toHaveBeenCalledTimes(1);
    expect(dataSources.Search.gearStatsAggregation.best100PhotoIds).toHaveBeenCalledWith(gearType, gearId);
    expect(dataSources.Search.gearStatsAggregation.topPhotographers).toHaveBeenCalledTimes(1);
    expect(dataSources.Search.gearStatsAggregation.topPhotographers).toHaveBeenCalledWith(gearType, gearId);
    expect(dataSources.Search.gearStatsAggregation.topCategories).toHaveBeenCalledTimes(1);
    expect(dataSources.Search.gearStatsAggregation.topCategories).toHaveBeenCalledWith(gearType, gearId);
    expect(dataSources.Photo.photo.findByInternalIds).toHaveBeenCalledTimes(2);
    expect(dataSources.Photo.photo.findByInternalIds).toHaveBeenCalledWith(ids);
    expect(dataSources.Photo.photo.findByInternalIds).toHaveBeenCalledWith(photographerIds);
  });

  it('should return topCategories', async () => {
    const gearType = 'CAMERA';
    const gearId = '1234';

    dataSources.Search.gearStatsAggregation.dateHistogram.mockResolvedValueOnce([]);
    dataSources.Search.gearStatsAggregation.best100PhotoIds.mockResolvedValue([]);
    dataSources.Search.gearStatsAggregation.topPhotographers.mockImplementation((t, id, c) => {
      switch (c) {
        case '1':
          return [1];
        case '2':
          return [1, 2];
        default:
          return [];
      }
    });
    dataSources.Search.gearStatsAggregation.topCategories.mockResolvedValue([{
      category: '1',
      users_count: 1,
      photos_count: 1,
    }, {
      category: '2',
      users_count: 2,
      photos_count: 2,
    }]);
    dataSources.Photo.photo.findByInternalIds.mockResolvedValueOnce([{
      legacyId: 1,
      name: '1',
    }, {
      legacyId: 2,
      name: '2',
    }]);

    const result = await resolvers.Query.gearStatsAggregation(null, {
      type: gearType,
      legacyId: gearId,
    }, {dataSources});

    expect(result).toEqual({
      legacyId: '1234',
      dateHistogram: [], best100Photos: [], topPhotographers: [], topCategories: [{
        category: 'CELEBRITIES',
        usersCount: 1,
        photosCount: 1,
        photos: [{
          legacyId: 1,
          name: '1',
        }],
      }, {
        category: 'FILM',
        usersCount: 2,
        photosCount: 2,
        photos: [{
          legacyId: 1,
          name: '1',
        }, {
          legacyId: 2,
          name: '2',
        }],
      }],
    });

    expect(dataSources.Search.gearStatsAggregation.topCategories).toHaveBeenCalledTimes(1);
    expect(dataSources.Search.gearStatsAggregation.topCategories).toHaveBeenCalledWith(gearType, gearId);
    expect(dataSources.Search.gearStatsAggregation.topPhotographers).toHaveBeenCalledTimes(3);
    expect(dataSources.Photo.photo.findByInternalIds).toHaveBeenCalledTimes(1);
    expect(dataSources.Photo.photo.findByInternalIds).toHaveBeenCalledWith([1, 2]);
  });
});
