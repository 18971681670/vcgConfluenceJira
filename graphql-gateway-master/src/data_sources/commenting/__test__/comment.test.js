import {Comment} from '../comment';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const comment = new Comment();

describe('[Comment.constructor]', () => {
  it('inheriates from Node', () => {
    expect(comment).toBeInstanceOf(Node);
  });
});

describe('[Comment.serviceName]', () => {
  it('returns "comment"', () => {
    expect(comment.serviceName).toEqual('comment');
  });
});

describe('[Comment.resourceType]', () => {
  it('returns "Comment"', () => {
    expect(comment.resourceType).toEqual('Comment');
  });
});

describe('[Comment.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleComment = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    comment.reducer(mockSingleComment);

    expect(spy).toBeCalledWith(mockSingleComment);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(comment.reducer(mockSingleComment)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(comment.resourceType, mockSingleComment.id),
      legacyId: mockSingleComment.id,
      __internalId: mockSingleComment.id,
      __raw: mockSingleComment,

      // field mapping in Comment
      fieldName: mockSingleComment.field_name,
    });
  });
});

describe('[Comment.bulkLoadData]', () => {
  const mockApiResponse = [
    {
      id: 1,
      field_name: 'value_1',
    },
    {
      id: 5,
      field_name: 'value_5',
    },
  ];
  const keys = [5, 2, 1];

  const lookupById = mockApiResponse.reduce(function(map, obj) {
    map[obj.id] = obj;
    return map;
  }, {});

  it('returns the results in the expected order', async () => {
    comment.context = loggedInMockContext;

    const spy = jest.spyOn(comment, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await comment.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    comment.context = loggedInMockContext;

    const spy = jest.spyOn(comment, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await comment.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/comments/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    comment.context = loggedOutMockContext;

    const spy = jest.spyOn(comment, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await comment.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/comments/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
