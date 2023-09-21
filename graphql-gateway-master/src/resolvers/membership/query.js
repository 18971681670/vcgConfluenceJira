export const resolvers = {
  Query: {
    authorizedFeatures: () => {
      return [];
    },
    getMembershipInfo: async (_, {tier}, {dataSources}) => {
      const response = await dataSources.Membership.membership.getMembershipInfo(tier);
      return response;
    },
  },
};
