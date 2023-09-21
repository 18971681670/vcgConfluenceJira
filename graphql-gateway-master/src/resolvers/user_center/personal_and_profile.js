export const resolvers = {
  PersonalAndProfile: {
    auth: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.UserProfile.personalAndProfile.loadAuthData(__internalId);
    },
  },
};
