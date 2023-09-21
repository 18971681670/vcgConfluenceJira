import {CATEGORIES, FEATURE_MAPPING, resolvers} from '../content_stream';

describe('resolvers', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      ContentStream: {
        contentStream: {
          photoDiscoverSearch: jest.fn(),
        },
      },
      Photo: {
        photo: {
          findByInternalIds: jest.fn(),
        },
      },
    };
  });

  it('should return feature photo cover', async () => {
    const expPhoto = {
      legacyId: 2,
      name: '2',
    };
    dataSources.ContentStream.contentStream.photoDiscoverSearch.mockResolvedValue({
      __ids: [1, 2, 3],
    });
    dataSources.Photo.photo.findByInternalIds.mockResolvedValueOnce([null, expPhoto, {
      legacyId: 3,
      name: '3',
    }]);

    const result = await resolvers.Query.featuresCoverPhoto({}, {}, {dataSources});

    expect(result).toEqual(FEATURE_MAPPING.map((f) => ({title: f, cover: expPhoto})));
    expect(dataSources.ContentStream.contentStream.photoDiscoverSearch).toHaveBeenCalledTimes(FEATURE_MAPPING.length);
    expect(dataSources.Photo.photo.findByInternalIds).toHaveBeenCalledTimes(1);
  });

  it('should return categories photo cover', async () => {
    const expPhoto = {
      legacyId: 2,
      name: '2',
    };
    dataSources.ContentStream.contentStream.photoDiscoverSearch.mockResolvedValue({
      __ids: [1, 2, 3],
    });
    dataSources.Photo.photo.findByInternalIds.mockResolvedValueOnce([null, expPhoto, {
      legacyId: 3,
      name: '3',
    }]);

    const result = await resolvers.Query.categoriesCoverPhoto({}, {}, {dataSources});

    expect(result).toEqual(CATEGORIES.map((f) => ({title: f.replace('&', 'and'), cover: expPhoto})));
    expect(dataSources.ContentStream.contentStream.photoDiscoverSearch).toHaveBeenCalledTimes(CATEGORIES.length);
    expect(dataSources.Photo.photo.findByInternalIds).toHaveBeenCalledTimes(1);
  });
});
