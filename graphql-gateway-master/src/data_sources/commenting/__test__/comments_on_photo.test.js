import {API} from '../../base/api';
import {CommentsOnPhoto} from '../comments_on_photo';
import {Comment} from '../comment';
import {loggedInMockContext} from '../../../__mocks__/mock_context';

const dataSource = new CommentsOnPhoto();

describe('[CommentsOnPhoto.constructor]', () => {
  it('inheriates from API', () => {
    expect(dataSource).toBeInstanceOf(API);
  });
});

describe('[CommentsOnPhoto.serviceName]', () => {
  it('returns "commenting"', () => {
    expect(dataSource.serviceName).toEqual('commenting');
  });
});

describe('[CommentsOnPhoto.paginatedCommentList]', () => {
  const mockApiResponse = {
    comments: [
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

  it('returns a list of Comment resources', async () => {
    dataSource.context = loggedInMockContext;

    const spy = jest.spyOn(dataSource, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const internalId = 99;

    const res = await dataSource.paginatedCommentList({}, internalId);
    const __comments = mockApiResponse.comments.map((obj) => Comment.prototype.reducer(obj));
    expect(res).toEqual({
      __comments,
      totalCount: mockApiResponse.total_items,
    });

    spy.mockRestore();
  });
});
