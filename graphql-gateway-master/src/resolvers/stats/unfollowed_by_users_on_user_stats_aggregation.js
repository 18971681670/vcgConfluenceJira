import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  UserStatsAggregation: {
    unfollowedByUsers: async ({from, to, __cacheHint}, {first, after}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __userIds,
          __userEdgePayloads,
          totalCount,
        } = await dataSources.Stats.unfollowedByUsersOnUserStatsAggregation.paginatedUserIdList(
            legacyPagination,
            from,
            to,
        );

        return {
          nodes: (await dataSources.UserCenter.user.findByInternalIds(__userIds)),
          edgePayloads: __userEdgePayloads,
          totalCount,
        };
      }, {
        skipNullNode: false,
        cacheHintOverride: __cacheHint,
      });

      return {
        edges: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(__cacheHint);
          const {edges} = await loadConnection();
          return edges;
        },
        pageInfo: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(__cacheHint);
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },
        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },
      };
    },
  },
};
