import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  User: {
    followedBy: async ({__internalId, __cacheHint}) => {
      return {
        __resolveType: 'FollowedByUsers',
        __internalId,
        __cacheHint,
      };
    },
    followedByUsers: async ({__internalId, __cacheHint}, {first, after}, {dataSources}, info) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __userIds,
          totalCount,
        } = await dataSources.Following.usersFollowingMe.paginatedUserIdList(
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
      const isFollowedByMe = await dataSources.Following.userFollowedByMeState.findByKey(__internalId);

      info.cacheControl.setCacheHint(__cacheHint);
      return {
        edges,
        pageInfo,
        totalCount,
        isFollowedByMe,
      };
    },
  },
  FollowedByUsers: {
    followedByUsers: async ({__internalId, __cacheHint}, {first, after}, {dataSources}, info) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __userIds,
          totalCount,
        } = await dataSources.Following.usersFollowingMe.paginatedUserIdList(
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
        isFollowedByMe: null,
      };
    },
    totalCount: async ({__internalId, __cacheHint}, {}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);
      return await dataSources.Following.userFollowerCounter.findByKey(__internalId);
    },
    isFollowedByMe: async ({__internalId, __cacheHint}, {}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);
      return await dataSources.Following.userFollowedByMeState.findByKey(__internalId);
    },
  },
};
