import {logger} from '../../utils/logger';

export const resolvers = {
  WebAccessTokenResponse: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },
  Query: {
    verifySecurityToken: async (_, {legacyUserId, securityToken, securityTokenType}, {dataSources}) => {
      const isValid = await dataSources.UserCenter.userCenter.verifySecurityToken({legacyUserId, securityToken, securityTokenType});
      return isValid;
    },
  },
  Mutation: {
    requestPasswordReset: async (_, {input}, {dataSources}) =>{
      const {
        clientMutationId,
        email,
        username,
      } = input;

      await dataSources.UserCenter.userCenter.requestPasswordRerset({email, username});

      return {clientMutationId};
    },

    verifyPaswwordReset: async (_, {verifyCode, clientMutationId}, {dataSources}) => {
      const res = await dataSources.UserCenter.userCenter.verifyPasswordReset(verifyCode);
      return {
        legacyUserId: res.userId,
        tfaEnabled: res.tfaEnabled,
        verifyCode: res.verifyCode,
        clientMutationId,
      };
    },

    resetPassword: async (_, {verifyCode, password, clientMutationId}, {dataSources}) =>{
      await dataSources.UserCenter.userCenter.doPasswordReset(verifyCode, password);
      return {clientMutationId};
    },

    changePassword: async (_, {input}, {dataSources}) => {
      const {currentPassword, password} = input;
      await dataSources.UserCenter.userCenter.changePassword({current_password: currentPassword, password});
      return true;
    },
  },

};
