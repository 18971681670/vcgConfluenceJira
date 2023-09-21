import {logger} from '../../utils/logger';

export const resolvers = {
  UserStatsAggregation: {
    totalFollowerCount: async ({to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return dataSources.Stats.userStatsTotalFollowerCount.loadData(to);
    },
    followerCount: async ({from, to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return await dataSources.Stats.userStatsFollowerCountAggregationSum.findByKey({from, to});
    },
    unfollowerCount: async ({from, to, __noData}, _, {dataSources}) => {
      if (__noData) {
        return null;
      }
      return await dataSources.Stats.userStatsUnFollowerCountAggregationSum.findByKey({from, to});
    },
  },
};
