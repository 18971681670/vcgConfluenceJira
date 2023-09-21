import {resolvers} from '../grouped_notification';

describe('resolvers', () => {
  it('contains resource node and connection', async () => {
    const keys = Object.keys(resolvers);
    expect(keys.sort()).toEqual([
      'GroupedNotification',
      'GroupedNotificationItem',
    ].sort());
  });
});

/*
 * describe('resolvers.GroupedNotification.owner', () => {
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
 *
 *     const spy = context.dataSources.UserCenter.user.findByInternalId;
 *     const mockData = {
 *       legacyId: 5,
 *       id: 'abc',
 *     };
 *     const __ownerUserId = mockData.legacyId;
 *
 *     spy.mockReturnValue(mockData);
 *
 *     const res = await resolvers.GroupedNotification.owner({__ownerUserId}, null, context);
 *
 *     expect(spy).toBeCalledWith(__ownerUserId);
 *     expect(res).toEqual(mockData);
 *   });
 * });
 *
 * describe('resolvers.GroupedNotification.oneToManyResources', () => {
 *   it('load data from the data source', async () => {
 *     const context = {
 *       dataSources: {
 *         UserCenter: {
 *           user: {
 *             findByInternalIds: jest.fn(),
 *           },
 *         },
 *         Notification: {
 *           groupedNotificationFollowsUser: {
 *             findByInternalId: jest.fn(),
 *           },
 *         },
 *       },
 *     };
 *
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
 *
 *     const listSpy = context.dataSources.Notification.groupedNotificationFollowsUser.findByInternalId;
 *     const mockList = {
 *       __userIds: mockData.map((i) => i.legacyId),
 *     };
 *     const __internalId = 99;
 *
 *     listSpy.mockReturnValue(mockList);
 *     dataSpy.mockReturnValue(mockData);
 *
 *     const res = await resolvers.GroupedNotification.oneToManyResources({__internalId}, null, context);
 *
 *     expect(listSpy).toBeCalledWith(__internalId);
 *     expect(dataSpy).toBeCalledWith(mockList.__userIds);
 *     expect(res).toEqual(mockData);
 *   });
 * });
 *
 *
 * describe('resolvers.GroupedNotificationConnection.edges', () => {
 *   it('load data from the data source', async () => {
 *     const context = {
 *       dataSources: {
 *         Notification: {
 *           groupedNotification: {
 *             findByInternalIds: jest.fn(),
 *           },
 *         },
 *       },
 *     };
 *
 *     const spy = context.dataSources.Notification.groupedNotification.findByInternalIds;
 *     const mockData = [
 *       {
 *         legacyId: 5,
 *         id: 'abc',
 *       },
 *     ];
 *     const __groupedNotificationIds = mockData.map((i) => i.legacyId);
 *
 *     spy.mockReturnValue(mockData);
 *
 *     const res = await resolvers.GroupedNotificationConnection.edges({__groupedNotificationIds}, null, context);
 *
 *     expect(spy).toBeCalledWith(__groupedNotificationIds);
 *     expect(res).toEqual([
 *       {
 *         node: mockData[0],
 *       },
 *     ]);
 *   });
 * });
 *
 */
