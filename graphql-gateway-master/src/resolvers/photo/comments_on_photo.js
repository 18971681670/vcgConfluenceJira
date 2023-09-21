// import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Photo: {
    comments: async ({__internalId}, {first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __comments,
          __commentEdgePayloads,
          totalCount,
        } = await dataSources.Commenting.commentsOnPhoto.paginatedCommentList(
            legacyPagination,
            __internalId,
        );

        return {
          nodes: __comments,
          edgePayloads: __commentEdgePayloads,
          totalCount,
        };
      });

      return {
        edges: async () => {
          const {edges} = await loadConnection();
          return edges;
        },

        pageInfo: async () => {
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },

        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },

        commentsAndRepliesTotalCount: async (_args, {dataSources}) => {
          return await dataSources.Commenting.photoCommentCounter.findByKey(__internalId);
        },
      };
    },
  },
};
