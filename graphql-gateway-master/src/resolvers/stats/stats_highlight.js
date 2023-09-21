import {logger} from '../../utils/logger';
import {
  generateCurrentWindow,
  generatePreviousWindow,
} from './my_stats';

export const resolvers = {
  StatsHighlight: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },

  StatsHighlightPhotoViewCount: {
    numberInCurrentWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generateCurrentWindow(__window);
      return dataSources.Stats.photoStatsViewCountAggregationSum.loadData(from.format(), to.format());
    },

    numberInPreviousWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generatePreviousWindow(__window);
      return dataSources.Stats.photoStatsViewCountAggregationSum.loadData(from.format(), to.format());
    },
  },

  StatsHighlightPhotoLikeCount: {
    numberInCurrentWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generateCurrentWindow(__window);
      return dataSources.Stats.photoStatsLikeCountAggregationSum.loadData(from.format(), to.format());
    },

    numberInPreviousWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generatePreviousWindow(__window);
      return dataSources.Stats.photoStatsLikeCountAggregationSum.loadData(from.format(), to.format());
    },
  },

  StatsHighlightPhotoAveragePulse: {
    numberInCurrentWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generateCurrentWindow(__window);
      return dataSources.Stats.photoStatsHighlightPulseAggregationAverage.loadData(from.format(), to.format());
    },

    numberInPreviousWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generatePreviousWindow(__window);
      return dataSources.Stats.photoStatsHighlightPulseAggregationAverage.loadData(from.format(), to.format());
    },
  },

  StatsHighlightUserViewCount: {
    numberInCurrentWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generateCurrentWindow(__window);
      return dataSources.Stats.photoStatsHighlightUserViewCountAggregationSum.loadData(from.format(), to.format());
    },

    numberInPreviousWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generatePreviousWindow(__window);
      return dataSources.Stats.photoStatsHighlightUserViewCountAggregationSum.loadData(from.format(), to.format());
    },
  },

  StatsHighlightUserFollowerCount: {
    numberInCurrentWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generateCurrentWindow(__window);
      return dataSources.Stats.photoStatsHighlightUserFollowerCountAggregationSum.loadData(from.format(), to.format());
    },

    numberInPreviousWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generatePreviousWindow(__window);
      return dataSources.Stats.photoStatsHighlightUserFollowerCountAggregationSum.loadData(from.format(), to.format());
    },
  },

  StatsHighlightPhotoUploadCount: {
    numberInCurrentWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generateCurrentWindow(__window);
      return dataSources.Stats.photoStatsHighlightUploadCountAggregationSum.loadData(from.format(), to.format());
    },

    numberInPreviousWindow: async ({__window}, _, {dataSources}) => {
      const {from, to} = generatePreviousWindow(__window);
      return dataSources.Stats.photoStatsHighlightUploadCountAggregationSum.loadData(from.format(), to.format());
    },
  },
};
