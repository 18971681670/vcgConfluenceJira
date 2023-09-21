import {resolvers} from '../user_avatar';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['UserAvatar', 'Mutation']);
  });
});

describe('resolvers.UserAvatar.images', () => {
  it('load data from the data source', async () => {
    const context = {
      dataSources: {
        Resize: {
          userAvatarResizeImage: {
            findByInternalId: jest.fn(),
          },
        },
      },
    };

    const dataSpy = context.dataSources.Resize.userAvatarResizeImage.findByInternalId;

    const parent = {
      __internalId: 99,
      version: 15,
      __s3Path: '/user/1/avatar.jpg',
    };
    const sizes = ['DEFAULT', 'LARGE'];

    const mockData = [
      {
        size: 'DEFAULT',
        url: 'https://avatars/default',
      },
      {
        size: 'LARGE',
        url: 'https://avatars/large',
      },
    ];

    dataSpy.mockReturnValue(mockData);

    const res = await resolvers.UserAvatar.images(parent, {sizes}, context);

    expect(dataSpy).toBeCalledWith({
      userId: parent.__internalId,
      version: parent.version,
      s3Avatar: parent.__s3Path,
      sizes,
    });
    expect(res).toEqual(mockData);
  });
});
