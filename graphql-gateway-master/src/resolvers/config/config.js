/* eslint-disable */
export const resolvers = {
  Config: {
  },
  Mutation: {
    createUpdateRemoteConfig: async (_, {clientId, input}, {dataSources}) => {
      const remoteConfigRequest = {
             ...input,
             emailVerificationCutOfTimestamp: input.emailVerificationCutOffTimestamp,
              } ;
      return await dataSources.Config.config.updateConfig(clientId, remoteConfigRequest);
    },
    createUpdateBlacklist: async (_, {clientId, input}, {dataSources}) => {
          return await dataSources.Config.config.updateBlacklist(clientId, {...input});
        },
  },
  Query: {
   getRemoteConfig: async (_, {clientId, version}, {dataSources}) => {
      return await dataSources.Config.config.getByClientId(clientId, version);
    },

  },
};
