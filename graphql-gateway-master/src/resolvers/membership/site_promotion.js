
export const resolvers = {
  Query: {

    sitePromotion: async (_, {}, {dataSources}) => {
      const __sitePromotion = await dataSources.Membership.sitePromotion.sitePromotion();
      return __sitePromotion;
    },
  },
};
