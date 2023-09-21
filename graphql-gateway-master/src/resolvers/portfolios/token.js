export const resolvers = {
  Mutation: {
    createPortfolioTemporaryToken: async (_, __, {dataSources}) => {
      return dataSources.Portfolio.token.createTokenForUser();
    },
  },
};
