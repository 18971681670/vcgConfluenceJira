import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  User: {
    following: async ({__internalId, __cacheHint}) => {
      return {
        __resolveType: 'FollowingUsers',
        __internalId,
        __cacheHint,
      };
    },
    followingUsers: async ({__internalId, __cacheHint}, {first, after}, {dataSources}, info) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __userIds,
          totalCount,
        } = await dataSources.Following.usersFollowedByMe.paginatedUserIdList(
            legacyPagination,
            __internalId,
        );

        const users = await dataSources.UserCenter.user.findByInternalIds(__userIds);
        return {
          nodes: users,
          totalCount,
        };
      });

      const {edges, pageInfo, totalCount} = await loadConnection();
      const isFollowingMe = await dataSources.Following.userFollowingMeState.findByKey(__internalId);

      info.cacheControl.setCacheHint(__cacheHint);
      return {
        edges,
        pageInfo,
        totalCount,
        isFollowingMe,
      };
    },
  },
  FollowingUsers: {
    followingUsers: async ({__internalId, __cacheHint}, {first, after}, {dataSources}, info) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __userIds,
          totalCount,
        } = await dataSources.Following.usersFollowedByMe.paginatedUserIdList(
            legacyPagination,
            __internalId,
        );

        const users = await dataSources.UserCenter.user.findByInternalIds(__userIds);

        return {
          nodes: users,
          totalCount,
        };
      });

      const {edges, pageInfo, totalCount} = await loadConnection();

      info.cacheControl.setCacheHint(__cacheHint);
      return {
        edges,
        pageInfo,
        totalCount,
        isFollowingMe: null,
      };
    },
    totalCount: async ({__internalId, __cacheHint}, {}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);
      return await dataSources.Following.userFollowingCounter.findByKey(__internalId);
    },
    isFollowingMe: async ({__internalId, __cacheHint}, {}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);
      return await dataSources.Following.userFollowingMeState.findByKey(__internalId);
    },
  },
};
