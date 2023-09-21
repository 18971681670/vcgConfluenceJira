export const resolvers = {
  Mutation: {
    sendStatsTracking: async (_, {input}, {dataSources}) => {
      if (input && input.views && input.views.length > 0) {
        await dataSources.Stats.statsTracking.sendStatsTrackingViewEvent(input.views);
        return true;
      }
      return false;
    },
    batchTracking: async (_, {input}, {dataSources}) => {
      if (input && input.actions && input.actions.length > 0) {
        await dataSources.Stats.statsTrackingV2.batchTracking(input.actions);
        return true;
      }
      return false;
    },
  },
};
