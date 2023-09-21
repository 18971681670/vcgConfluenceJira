import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  PhotoStatsAggregation: {
    photos: async ({from, to, __cacheHint}, {first, after}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __photoIds,
          __photoEdgePayloads,
          totalCount,
        } = await dataSources.Stats.photosOnPhotoStatsAggregation.paginatedPhotoIdList(
            legacyPagination,
            from,
            to,
        );

        return {
          nodes: (await dataSources.Photo.photo.findByInternalIds(__photoIds)),
          edgePayloads: __photoEdgePayloads,
          edgeContext: {
            __from: from,
            __to: to,
          },
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

  PhotoEdgeForPhotosOnPhotoStatsAggregation: {
    likeCount: async ({__photoId, __from, __to}, _, {dataSources}) => {
      return await dataSources.Stats.photoStatsLikeCountAggregationPhotoSum.findByKey(__photoId, {
        name: `${__from}—${__to}`,
        from: __from,
        to: __to,
      });
    },

    commentAndReplyCount: async ({__photoId, __from, __to}, _, {dataSources}) => {
      return await dataSources.Stats.photoStatsCommentCountAggregationPhotoSum.findByKey(__photoId, {
        name: `${__from}—${__to}`,
        from: __from,
        to: __to,
      });
    },

    viewCountFromHomefeed: async ({__photoId, __from, __to}, _, {dataSources}) => {
      const {homeFeedCount} = await dataSources.Stats.photoStatsViewSourceCountAggregationPhotoSum.findByKey(__photoId, {
        name: `${__from}—${__to}`,
        from: __from,
        to: __to,
      });
      return homeFeedCount;
    },

    viewCountFromDiscover: async ({__photoId, __from, __to}, _, {dataSources}) => {
      const {discoverCount} = await dataSources.Stats.photoStatsViewSourceCountAggregationPhotoSum.findByKey(__photoId, {
        name: `${__from}—${__to}`,
        from: __from,
        to: __to,
      });
      return discoverCount;
    },

    viewCountFromProfile: async ({__photoId, __from, __to}, _, {dataSources}) => {
      const {profileCount} = await dataSources.Stats.photoStatsViewSourceCountAggregationPhotoSum.findByKey(__photoId, {
        name: `${__from}—${__to}`,
        from: __from,
        to: __to,
      });
      return profileCount;
    },

    viewCountFromSearch: async ({__photoId, __from, __to}, _, {dataSources}) => {
      const {searchCount} = await dataSources.Stats.photoStatsViewSourceCountAggregationPhotoSum.findByKey(__photoId, {
        name: `${__from}—${__to}`,
        from: __from,
        to: __to,
      });
      return searchCount;
    },
  },
};
