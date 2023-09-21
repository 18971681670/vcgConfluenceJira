import {PhotoLikedByMeState} from '../photo_liked_by_me_state';
import {Node} from '../../base/node';
import {internalToGlobalId} from '../../../utils/global_id';
import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const photoLikedByMeState = new PhotoLikedByMeState();

describe('[PhotoLikedByMeState.constructor]', () => {
  it('inheriates from Node', () => {
    expect(photoLikedByMeState).toBeInstanceOf(Node);
  });
});

describe('[PhotoLikedByMeState.serviceName]', () => {
  it('returns "liking"', () => {
    expect(photoLikedByMeState.serviceName).toEqual('liking');
  });
});

describe('[PhotoLikedByMeState.resourceType]', () => {
  it('returns "PhotoLikedByMeState"', () => {
    expect(photoLikedByMeState.resourceType).toEqual('PhotoLikedByMeState');
  });
});

describe('[PhotoLikedByMeState.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSinglePhotoLikedByMeState = {
    id: 1,
    field_name: 'example',
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(Node.prototype, 'reducer');

    photoLikedByMeState.reducer(mockSinglePhotoLikedByMeState);

    expect(spy).toBeCalledWith(mockSinglePhotoLikedByMeState);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(photoLikedByMeState.reducer(mockSinglePhotoLikedByMeState)).toEqual({
      // from Node.reducer
      id: internalToGlobalId(photoLikedByMeState.resourceType, mockSinglePhotoLikedByMeState.id),
      legacyId: mockSinglePhotoLikedByMeState.id,
      __internalId: mockSinglePhotoLikedByMeState.id,
      __raw: mockSinglePhotoLikedByMeState,

      // field mapping in PhotoLikedByMeState
      fieldName: mockSinglePhotoLikedByMeState.field_name,
    });
  });
});

describe('[PhotoLikedByMeState.bulkLoadData]', () => {
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
    photoLikedByMeState.context = loggedInMockContext;

    const spy = jest.spyOn(photoLikedByMeState, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    const res = await photoLikedByMeState.bulkLoadData(keys);
    expect(res).toEqual([lookupById[5], null, lookupById[1]]);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-in user', async () => {
    photoLikedByMeState.context = loggedInMockContext;

    const spy = jest.spyOn(photoLikedByMeState, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoLikedByMeState.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoLikedByMeStates/findByIds', expectedQuery);

    spy.mockRestore();
  });

  it('calls the correct API for a logged-out user', async () => {
    photoLikedByMeState.context = loggedOutMockContext;

    const spy = jest.spyOn(photoLikedByMeState, 'get');
    spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));

    await photoLikedByMeState.bulkLoadData(keys);

    const expectedQuery = {
      ids: keys.join(','),
      queryOne: true,
    };
    expect(spy).toBeCalledWith('internal/graphql/photoLikedByMeStates/findByIds', expectedQuery);

    spy.mockRestore();
  });
});
