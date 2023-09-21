import {logger} from '../../utils/logger';

export const resolvers = {
  Query: {
    authorizedFeatures: async (_, {features}, {dataSources}) => {
      const context = {
        name: 'no-user-info',
      };
      const authorizedFeatures = await dataSources.Membership.authorizedFeature.findByKeys(features, context);
      return authorizedFeatures.filter((i) => i);
    },
  },
};
