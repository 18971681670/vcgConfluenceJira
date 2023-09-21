export const resolvers = {
  Notification: {},
  NotificationHeader: {
    // Necessary for compound (union) types
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },
  NotificationExtra: {
    // Necessary for compound (union) types
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },
  FollowInteraction: {
    isFollowedByMe: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.Following.userFollowedByMeState.findByKey(__internalId);
    },
  },
};
