import {LikedByUsersOnPhoto} from '../liked_by_users_on_photo';
import {API} from '../../base/api';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new LikedByUsersOnPhoto();

describe('[LikedByUsersOnPhoto.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[LikedByUsersOnPhoto.serviceName]', () => {
  it('returns "photo"', () => {
    expect(dataSource.serviceName).toEqual('photo');
  });
});

describe('[LikedByUsersOnPhoto.paginatedUserIdList]', () => {
  const mockApiResponse = {
    user_ids: [1, 2, 3],
    total_items: 3,
  };

  it('returns a list of User IDs', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedUserIdList({}, internalId);
    expect(res).toEqual({
      __userIds: mockApiResponse.user_ids,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
