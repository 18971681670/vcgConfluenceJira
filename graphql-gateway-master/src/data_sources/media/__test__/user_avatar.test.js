import {UserAvatar} from '../user_avatar';
import {User} from '../../user_center/user';
import {internalToGlobalId} from '../../../utils/global_id';
// import {loggedInMockContext, loggedOutMockContext} from '../../../__mocks__/mock_context';

const userAvatar = new UserAvatar();

describe('[UserAvatar.constructor]', () => {
  it('inheriates from User', () => {
    expect(userAvatar).toBeInstanceOf(User);
  });
});

describe('[UserAvatar.resourceType]', () => {
  it('returns "UserAvatar"', () => {
    expect(userAvatar.resourceType).toEqual('UserAvatar');
  });
});

describe('[UserAvatar.reducer]', () => {
  // FIXME please provide a sample object returned from API representing a resource
  const mockSingleUserAvatar = {
    id: 1,
    avatar_version: 99,
  };

  it('calls the parent reducer to render IDs', () => {
    const spy = jest.spyOn(User.prototype, 'reducer');

    userAvatar.reducer(mockSingleUserAvatar);

    expect(spy).toBeCalledWith(mockSingleUserAvatar);

    spy.mockRestore();
  });

  it('tranforms API response to the schema', () => {
    expect(userAvatar.reducer(mockSingleUserAvatar)).toEqual({
      // from User.reducer
      ...User.prototype.reducer(mockSingleUserAvatar),

      id: internalToGlobalId(userAvatar.resourceType, mockSingleUserAvatar.id),
      legacyId: mockSingleUserAvatar.id,
      __internalId: mockSingleUserAvatar.id,


      // field mapping in UserAvatar
      version: mockSingleUserAvatar.avatar_version,
    });
  });
});

/*
 * describe('[UserAvatar.bulkLoadData]', () => {
 *   const mockApiResponse = [
 *     {
 *       id: 1,
 *       field_name: 'value_1',
 *     },
 *     {
 *       id: 5,
 *       field_name: 'value_5',
 *     },
 *   ];
 *   const keys = [5, 2, 1];
 *
 *   const lookupById = mockApiResponse.reduce(function(map, obj) {
 *     map[obj.id] = obj;
 *     return map;
 *   }, {});
 *
 *   it('returns the results in the expected order', async () => {
 *     userAvatar.context = loggedInMockContext;
 *
 *     const spy = jest.spyOn(userAvatar, 'get');
 *     spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));
 *
 *     const res = await userAvatar.bulkLoadData(keys);
 *     expect(res).toEqual([lookupById[5], null, lookupById[1]]);
 *
 *     spy.mockRestore();
 *   });
 *
 *   it('calls the correct API for a logged-in user', async () => {
 *     userAvatar.context = loggedInMockContext;
 *
 *     const spy = jest.spyOn(userAvatar, 'get');
 *     spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));
 *
 *     await userAvatar.bulkLoadData(keys);
 *
 *     const expectedQuery = {
 *       ids: keys.join(','),
 *       queryOne: true,
 *     };
 *     expect(spy).toBeCalledWith('internal/graphql/userAvatars/findByIds', expectedQuery);
 *
 *     spy.mockRestore();
 *   });
 *
 *   it('calls the correct API for a logged-out user', async () => {
 *     userAvatar.context = loggedOutMockContext;
 *
 *     const spy = jest.spyOn(userAvatar, 'get');
 *     spy.mockReturnValueOnce(Promise.resolve(mockApiResponse));
 *
 *     await userAvatar.bulkLoadData(keys);
 *
 *     const expectedQuery = {
 *       ids: keys.join(','),
 *       queryOne: true,
 *     };
 *     expect(spy).toBeCalledWith('internal/graphql/userAvatars/findByIds', expectedQuery);
 *
 *     spy.mockRestore();
 *   });
 * });
 */
