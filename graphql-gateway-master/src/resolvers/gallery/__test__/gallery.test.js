import {resolvers} from '../gallery';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual([
      'Gallery',
      'Query',
      'Mutation',
    ]);
  });
});

describe('resolvers.Gallery.creator', () => {
  it('load data from the data source', async () => {
    const context = {
      dataSources: {
        UserCenter: {
          user: {
            findByInternalId: jest.fn(),
          },
        },
      },
    };

    const spy = context.dataSources.UserCenter.user.findByInternalId;
    const mockData = {
      legacyId: 5,
      id: 'abc',
    };
    const __creatorUserId = mockData.legacyId;

    spy.mockReturnValue(mockData);

    const res = await resolvers.Gallery.creator({__creatorUserId}, null, context);

    expect(spy).toBeCalledWith(__creatorUserId);
    expect(res).toEqual(mockData);
  });
});

describe('resolvers.Gallery.cover', () => {
  it('load data from the data source', async () => {
    const context = {
      dataSources: {
        Photo: {
          photo: {
            findByInternalIdsInGallery: jest.fn(),
          },
        },
      },
    };

    const spy = context.dataSources.Photo.photo.findByInternalIdsInGallery;
    const mockData = {
      legacyId: 5,
      id: 'abc',
    };
    const __coverPhotoId = mockData.legacyId;

    spy.mockReturnValue([mockData]);

    const res = await resolvers.Gallery.cover({__coverPhotoId}, null, context);

    expect(spy).toBeCalledWith([__coverPhotoId]);
    expect(res).toEqual(mockData);
  });
});
