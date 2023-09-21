export const resolvers = {
  Query: {
    isHomefeedNeedRecommend: async (_, {}, {dataSources}) => {
      const __needRecommend = await dataSources.Following.userFollowedByMeState.isHomefeedNeedRecommand();
      return __needRecommend;
    },
    isActivityfeedNeedRecommend: async (_, {}, {dataSources}) => {
      const __needRecommend = await dataSources.Following.userFollowedByMeState.isHomefeedNeedRecommand();
      return __needRecommend;
    },
  },
};
