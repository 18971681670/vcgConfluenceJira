import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    userSearch: async (_, {first, after, last, before, search, filters, sort}, {dataSources}) => {
      const currentUserId = dataSources.UserCenter.user.currentUserId;
      if (!currentUserId) {
        return {
          edges: [],
          totalCount: 0,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
        };
      }
      const loadConnection = loadSqlBasedConnectionFields({first, after, last, before}, async (legacyPagination) => {
        const {
          __userIds,
          totalCount,
        } = await dataSources.Search.userSearch.paginatedUserIdList(
            legacyPagination,
            search,
            filters,
            sort,
        );
        const nodes = await dataSources.UserCenter.user.findByInternalIds(__userIds);

        return {
          nodes,
          totalCount,
        };
      });

      const {edges, pageInfo, totalCount} = await loadConnection();
      return {
        edges,
        pageInfo,
        totalCount,
      };
    },
  },
};
