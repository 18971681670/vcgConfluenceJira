import {logger} from '../../utils/logger';
import {
  loadDdbBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Photo: {
    likedByUsers: async ({__internalId, __cacheHint}, {first, after}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      const loadConnection = loadDdbBasedConnectionFields({first, after}, async (ddbPagination) => {
        const {
          __userIds,
          __userEdgePayloads,
          __lastEvaluatedKey,
        } = await dataSources.Liking.likedByUsersOnPhoto.paginatedUserIdList(
            ddbPagination,
            __internalId,
        );

        return {
          nodes: (await dataSources.UserCenter.user.findByInternalIds(__userIds)),
          edgePayloads: __userEdgePayloads,
          lastEvaluatedKey: __lastEvaluatedKey,
        };
      });

      return {
        totalCount: async (_args, {dataSources}) => {
          return await dataSources.Liking.photoLikeCounter.findByKey(__internalId);
        },

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

        isLikedByMe: async (_args, {dataSources}, info) => {
          if (!dataSources.UserCenter.user.currentUserId) {
            // Use the same cache hint as the photo
            return null;
          }

          info.cacheControl.setCacheHint({maxAge: 0, scope: 'PRIVATE'});

          return await dataSources.Liking.photoLikedByMeState.findByKey(__internalId);
        },
      };
    },
  },
};
