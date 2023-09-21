import {PhotoLikeCounter} from '../photo_like_counter';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const photoLikeCounter = new PhotoLikeCounter();

describe('[PhotoLikeCounter.constructor]', () => {
  it('inheriates from Node', () => {
    expect(photoLikeCounter).toBeInstanceOf(Node);
  });
});

describe('[PhotoLikeCounter.serviceName]', () => {
  it('returns "liking"', () => {
    expect(photoLikeCounter.serviceName).toEqual('liking');
  });
});

describe('[PhotoLikeCounter.resourceType]', () => {
  it('returns "PhotoLikeCounter"', () => {
    expect(photoLikeCounter.resourceType).toEqual('PhotoLikeCounter');
  });
});

describe('[PhotoLikeCounter.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePhotoLikeCounter = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    photoLikeCounter.reducer(mockSinglePhotoLikeCounter);

    expect(spy).toBeCalledWith(mockSinglePhotoLikeCounter);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(photoLikeCounter.reducer(mockSinglePhotoLikeCounter)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(photoLikeCounter.resourceType, mockSinglePhotoLikeCounter.id),
      legacyId: mockSinglePhotoLikeCounter.id,
      __internalId: mockSinglePhotoLikeCounter.id,
      __raw: mockSinglePhotoLikeCounter,

      // field mapping in PhotoLikeCounter
      fieldName: mockSinglePhotoLikeCounter.field_name,
    });
  });
});

describe('[PhotoLikeCounter.bulkLoadData]', () => {
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
    photoLikeCounter.context = loggedInMockContext;

    const spy = jest.spyOn(photoLikeCounter, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await photoLikeCounter.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    photoLikeCounter.context = loggedInMockContext;

    const spy = jest.spyOn(photoLikeCounter, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoLikeCounter.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoLikeCounters/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    photoLikeCounter.context = loggedOutMockContext;

    const spy = jest.spyOn(photoLikeCounter, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoLikeCounter.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoLikeCounters/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
