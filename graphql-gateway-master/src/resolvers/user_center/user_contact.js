import {logger} from '../../utils/logger';

export const resolvers = {
  UserContact: {
    id: async ({__internalId}, _, {dataSources}) => {
      const {id} = dataSources.UserCenter.userContact.idReducer(__internalId);
      return id;
    },

    legacyId: async ({__internalId}, _, {dataSources}) => {
      const {legacyId} = dataSources.UserCenter.userContact.idReducer(__internalId);
      return legacyId;
    },

    email: async ({__internalId, __userRaw}, _, {dataSources}) => {
      __userRaw = __userRaw || (await dataSources.UserCenter.user.findByInternalId(__internalId)).__raw;

      const {email} = dataSources.UserCenter.userContact.reducerFromUser(__userRaw);
      return email;
    },

    unverifiedEmail: async ({__internalId, __userRaw}, _, {dataSources}) => {
      __userRaw = __userRaw || (await dataSources.UserCenter.user.findByInternalId(__internalId)).__raw;

      const {unverifiedEmail} = dataSources.UserCenter.userContact.reducerFromUser(__userRaw);
      return unverifiedEmail;
    },

    phone: async ({__internalId}, _, {dataSources}) => {
      const __extendedUserRaw = (await dataSources.UserCenter.extendedUser.findByInternalId(__internalId)).__raw;

      const {phone} = dataSources.UserCenter.userContact.reducerFromExtendedUser(__extendedUserRaw);
      return phone;
    },

    phoneCountry: async ({__internalId}, _, {dataSources}) => {
      const __extendedUserRaw = (await dataSources.UserCenter.extendedUser.findByInternalId(__internalId)).__raw;

      const {phoneCountry} = dataSources.UserCenter.userContact.reducerFromExtendedUser(__extendedUserRaw);
      return phoneCountry;
    },
  },

  Mutation: {
    updateUserContact: async (_, {input}, {dataSources}) => {
      const {
        unverifiedEmail,
      } = input;

      if (unverifiedEmail) {
        const userContact = await dataSources.UserCenter.userCenter.emailVerification(input.legacyId, {'email': unverifiedEmail});
        return {
          clientMutationId: input.clientMutationId,
          userContact,
        };
      } else {
        return null;
      }
    },
  },

};
