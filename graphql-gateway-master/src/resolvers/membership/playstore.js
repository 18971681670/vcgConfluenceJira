import {logger} from '../../utils/logger';

export const resolvers = {
  Query: {
    verifyPlayStorePurchase: async (_, {subscriptionId, packageName, playstoreToken}, {dataSources}) => {
      return await dataSources.Membership.playstore.verifyPlaystorePurchase(subscriptionId, packageName, playstoreToken);
    },
  },

  Mutation: {
    verifyIOSAppStorePurchase: async (_, {input}, {dataSources}) => {
      return await dataSources.Membership.playstore.verifyIOSAppStorePurchase(input.receiptData);
    },
  },
};
