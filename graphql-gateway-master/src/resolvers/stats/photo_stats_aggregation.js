import {logger} from '../../utils/logger';

export const resolvers = {
  PhotoStats: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },

  PhotoStatsAggregation: {
    viewCount: async ({from, to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return await dataSources.Stats.photoStatsViewCountAggregationSum.findByKey({from, to});
    },

    likeCount: async ({from, to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return await dataSources.Stats.photoStatsLikeCountAggregationSum.findByKey({from, to});
    },

    commentAndReplyCount: async ({from, to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return await dataSources.Stats.photoStatsCommentCountAggregationSum.findByKey({from, to});
    },

    viewCountFromHomefeed: async ({from, to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return await dataSources.Stats.photoStatsViewSourceCountAggregationSum.findByKey({from, to}, {
        name: 'homeFeed',
        source: 'homeFeed',
      });
    },

    viewCountFromDiscover: async ({from, to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return await dataSources.Stats.photoStatsViewSourceCountAggregationSum.findByKey({from, to}, {
        name: 'discover',
        source: 'discover',
      });
    },

    viewCountFromProfile: async ({from, to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return await dataSources.Stats.photoStatsViewSourceCountAggregationSum.findByKey({from, to}, {
        name: 'profile',
        source: 'profile',
      });
    },

    viewCountFromSearch: async ({from, to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return await dataSources.Stats.photoStatsViewSourceCountAggregationSum.findByKey({from, to}, {
        name: 'search',
        source: 'search',
      });
    },
  },
};
