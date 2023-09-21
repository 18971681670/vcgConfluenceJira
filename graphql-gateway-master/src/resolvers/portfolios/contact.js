export const resolvers = {
  Mutation: {
    sendPortfolioContact: async (_, {input}, {dataSources}) => {
      const contactRequest = {
        receiverId: input.portfolioOwnerId,
        ...input,
      };
      const response = await dataSources.Portfolio.contact.sendContact(contactRequest);
      return response;
    },
  },
};
