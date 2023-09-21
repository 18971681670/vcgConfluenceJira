import {logger} from '../../utils/logger';

export const resolvers = {
  Query: {
    getCurrentUserAccountDeletable: async (_, {legacyUserId}, {dataSources}) => {
      const deletable = await dataSources.UserCenter.userCenter.getAccountDeletable();
      return {
        legacyUserId,
        deletable,
      };
    },
    getUserAccountStatus: async (_, {email}, {dataSources}) => {
      const user = await dataSources.UserProfile.personalAndProfile.getByEmail(email);
      if (user) {
        return {
          exist: true,
          legacyId: user.id,
          email: user.email,
          active: user.active,
        };
      }
      return {exist: false};
    },
  },
  Mutation: {
    deleteUserAccount: async (_, {input, legacyUserId}, {dataSources}) => {
      const {
        clientMutationId,
        reason,
        note,
      } = input;

      const request = {
        reason,
        note: note || null,
        id: legacyUserId,
      };

      await dataSources.UserCenter.userCenter.deleteUserAccount(request);

      return {
        clientMutationId,
      };
    },
    deactivateUserAccount: async (_, {legacyUserId, clientMutationId}, {dataSources}) => {
      await dataSources.UserCenter.userCenter.deactivateUserAccount(legacyUserId);

      return {
        clientMutationId,
      };
    },
    requestActivateAccount: async (_, {redirect, origin, newEmail}, {dataSources}) => {
      await dataSources.UserCenter.userCenter.requestActivateAccount(redirect, origin, newEmail);
      return true;
    },
    completeActivateAccount: async (_, {legacyUserId, code}, {dataSources}) => {
      await dataSources.UserCenter.userCenter.completeActivateAccount(legacyUserId, code);
      return true;
    },
    requestChangeEmail: async (_, {newEmail}, {dataSources}) => {
      await dataSources.UserCenter.userCenter.requestChangeEmail(newEmail);
      return newEmail;
    },
    completeChangeEmail: async (_, {legacyUserId, code}, {dataSources}) => {
      await dataSources.UserCenter.userCenter.completeChangeEmail(legacyUserId, code);
      return true;
    },
    completeEmailConfirmation: async (_, {legacyUserId, code}, {dataSources}) => {
      await dataSources.UserCenter.userCenter.completeEmailConfirmation(legacyUserId, code);
      return true;
    },
    sendReactivation: async (_, {email, username}, {dataSources}) => {
      return await dataSources.UserCenter.userCenter.sendReactivation({email, username});
    },
  },

};
