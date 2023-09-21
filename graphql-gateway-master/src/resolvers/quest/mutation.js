export const resolvers = {
  Mutation: {
    subscribeToCampaign: async (_, {signupEmail, campaignName}, {dataSources}) => {
      return await dataSources.Quest.campaignSignup.subscribe(signupEmail, campaignName);
    },

    unsubscribeFromCampaign: async (_, {token}, {dataSources}) => {
      return await dataSources.Quest.campaignSignup.unsubscribe(token);
    },
  },
};
