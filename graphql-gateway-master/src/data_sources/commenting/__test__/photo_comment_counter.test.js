import {PhotoCommentCounter} from '../photo_comment_counter';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const photoCommentCounter = new PhotoCommentCounter();

describe('[PhotoCommentCounter.constructor]', () => {
  it('inheriates from Node', () => {
    expect(photoCommentCounter).toBeInstanceOf(Node);
  });
});

describe('[PhotoCommentCounter.serviceName]', () => {
  it('returns "commenting"', () => {
    expect(photoCommentCounter.serviceName).toEqual('commenting');
  });
});

describe('[PhotoCommentCounter.resourceType]', () => {
  it('returns "PhotoCommentCounter"', () => {
    expect(photoCommentCounter.resourceType).toEqual('PhotoCommentCounter');
  });
});

describe('[PhotoCommentCounter.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePhotoCommentCounter = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    photoCommentCounter.reducer(mockSinglePhotoCommentCounter);

    expect(spy).toBeCalledWith(mockSinglePhotoCommentCounter);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(photoCommentCounter.reducer(mockSinglePhotoCommentCounter)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(photoCommentCounter.resourceType, mockSinglePhotoCommentCounter.id),
      legacyId: mockSinglePhotoCommentCounter.id,
      __internalId: mockSinglePhotoCommentCounter.id,
      __raw: mockSinglePhotoCommentCounter,

      // field mapping in PhotoCommentCounter
      fieldName: mockSinglePhotoCommentCounter.field_name,
    });
  });
});

describe('[PhotoCommentCounter.bulkLoadData]', () => {
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
    photoCommentCounter.context = loggedInMockContext;

    const spy = jest.spyOn(photoCommentCounter, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await photoCommentCounter.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    photoCommentCounter.context = loggedInMockContext;

    const spy = jest.spyOn(photoCommentCounter, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoCommentCounter.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoCommentCounters/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    photoCommentCounter.context = loggedOutMockContext;

    const spy = jest.spyOn(photoCommentCounter, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoCommentCounter.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoCommentCounters/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
