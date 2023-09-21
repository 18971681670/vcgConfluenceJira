import {logger} from '../../utils/logger';

export const resolvers = {
  LicensingDistribution: {
    owner: async ({__ownerUserId}, _, {dataSources}) => {
      return dataSources.UserCenter.user.findByInternalId(__ownerUserId);
    },

    oneToManyResources: async ({__internalId}, _, {dataSources}) => {
      const {__userIds} = dataSources.Licensing.licensingDistributionFollowsUser.findByInternalId(__internalId);
      return dataSources.UserCenter.user.findByInternalIds(__userIds);
    },
  },
};
