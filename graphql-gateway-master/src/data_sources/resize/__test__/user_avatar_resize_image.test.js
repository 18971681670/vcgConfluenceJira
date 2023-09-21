import {UserAvatarResizeImage} from '../user_avatar_resize_image';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const userAvatarResizeImage = new UserAvatarResizeImage();

describe('[UserAvatarResizeImage.constructor]', () => {
  it('inheriates from Node', () => {
    expect(userAvatarResizeImage).toBeInstanceOf(Node);
  });
});

describe('[UserAvatarResizeImage.serviceName]', () => {
  it('returns "Resize"', () => {
    expect(userAvatarResizeImage.serviceName).toEqual('usercenter');
  });
});

describe('[UserAvatarResizeImage.resourceType]', () => {
  it('returns "UserAvatarResizeImage"', () => {
    expect(userAvatarResizeImage.resourceType).toEqual('UserAvatarResizeImage');
  });
});

describe('[UserAvatarResizeImage.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleUserAvatarResizeImage = {
    id: [88, 1, 'DEFAULT'],
    https: 'http://resize/user/1/default.jpg',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    userAvatarResizeImage.reducer(mockSingleUserAvatarResizeImage);

    expect(spy).toBeCalledWith(mockSingleUserAvatarResizeImage);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(userAvatarResizeImage.reducer(mockSingleUserAvatarResizeImage)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(userAvatarResizeImage.resourceType, mockSingleUserAvatarResizeImage.id),
      legacyId: mockSingleUserAvatarResizeImage.id.join('--'),
      __internalId: mockSingleUserAvatarResizeImage.id,
      __raw: mockSingleUserAvatarResizeImage,

      url: mockSingleUserAvatarResizeImage.https,
      size: 'DEFAULT',
    });
  });
});

describe('[UserAvatarResizeImage.bulkLoadData]', () => {
  const mockApiResponse = [
    {
      id: 1,
      avatars: {
        large: {
          https: 'http://resize/user/5/large.jpg',
        },
      },
    },
    {
      id: 5,
      avatars: {
        large: {
          https: 'http://resize/user/5/large.jpg',
        },
      },
    },
  ];
  const keys = [[5, 9, 'DEFAULT'], [5, 9, 'BAD'], [1, 3, 'DEFAULT']];

  const lookupById = mockApiResponse.reduce(function(map, obj) {
    map[obj.id] = obj;
    return map;
  }, {});

  it('returns the results in the expected order', async () => {
    userAvatarResizeImage.context = loggedInMockContext;

    const spy = jest.spyOn(userAvatarResizeImage, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await userAvatarResizeImage.bulkLoadData(keys);
    expect(res).toEqual([
      {
        ...lookupById[5].avatars.large,
        id: [5, 9, 'DEFAULT'],
      },
      null,
      {
        ...lookupById[1].avatars.large,
        id: [1, 3, 'DEFAULT'],
      }]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    userAvatarResizeImage.context = loggedInMockContext;

    const spy = jest.spyOn(userAvatarResizeImage, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userAvatarResizeImage.bulkLoadData(keys);

    const expectedQuery = {
      ids: [5, 1].join(','),
    };
    expect(spy).toBeCalledWith('internal/graphql/userAvatarResizeImages/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    userAvatarResizeImage.context = loggedOutMockContext;

    const spy = jest.spyOn(userAvatarResizeImage, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await userAvatarResizeImage.bulkLoadData(keys);

    const expectedQuery = {
      ids: [5, 1].join(','),
    };
    expect(spy).toBeCalledWith('internal/graphql/userAvatarResizeImages/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
