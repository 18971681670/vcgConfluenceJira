import {resolvers} from '../model_release';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys).toEqual(['ModelReleaseMetadata', 'Query', 'Mutation']);
  });
});

/*
 * describe('resolvers.ModelRelease.owner', () => {
 *   it('load data from the data source', async () => {
 *     const context = {
 *       dataSources: {
 *         UserCenter: {
 *           user: {
 *             findByInternalId: jest.fn(),
 *           },
 *         },
 *       },
 *     };
 */

/*
 *     const __internalId = 99;
 *     const spy = context.dataSources.UserCenter.user.findByInternalId;
 *     const mockData = {
 *       legacyId: 5,
 *       id: 'abc',
 *     };
 *     const __ownerUserId = mockData.legacyId;
 */

//     spy.mockReturnValue(mockData);

//     const res = await resolvers.ModelRelease.owner({__ownerUserId}, null, context);

/*
 *     expect(spy).toBeCalledWith(__ownerUserId);
 *     expect(res).toEqual(mockData);
 *   });
 * });
 */

/*
 * describe('resolvers.ModelRelease.oneToManyResources', () => {
 *   it('load data from the data source', async () => {
 *     const context = {
 *       dataSources: {
 *         UserCenter: {
 *           user: {
 *             findByInternalIds: jest.fn(),
 *           },
 *         },
 *         Licensing: {
 *           modelReleaseFollowers: {
 *             findByInternalId: jest.fn(),
 *           },
 *         },
 *       },
 *     };
 */

/*
 *     const dataSpy = context.dataSources.UserCenter.user.findByInternalIds;
 *     const mockData = [
 *       {
 *         legacyId: 5,
 *         id: 'abc',
 *       },
 *       {
 *         legacyId: 3,
 *         id: 'efg',
 *       },
 *     ];
 */

/*
 *     const listSpy = context.dataSources.Licensing.modelReleaseFollowers.findByInternalId;
 *     const mockList = {
 *       __userIds: mockData.map((i) => i.legacyId),
 *     };
 *     const __internalId = 99;
 */

/*
 *     listSpy.mockReturnValue(mockList);
 *     dataSpy.mockReturnValue(mockData);
 */

//     const res = await resolvers.ModelRelease.oneToManyResources({__internalId}, null, context);

/*
 *     expect(listSpy).toBeCalledWith(__internalId);
 *     expect(dataSpy).toBeCalledWith(mockList.__userIds);
 *     expect(res).toEqual(mockData);
 *   });
 * });
 */
