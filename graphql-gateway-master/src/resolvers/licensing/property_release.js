import {logger} from '../../utils/logger';

export const resolvers = {

  Mutation: {
    createPropertyRelease: async (_, {input}, {dataSources}) => {
      const {
        propertyRelease,
        directUpload,
      } = await dataSources.Licensing.propertyRelease.create(input);

      return {
        clientMutationId: input.clientMutationId,
        propertyRelease,
        directUpload,
      };
    },

    activatePropertyRelease: async (_, {input}, {dataSources}) => {
      const propertyRelease = await dataSources.Licensing.propertyRelease.activate(input.legacyId);

      return {
        clientMutationId: input.clientMutationId,
        propertyRelease,
      };
    },
  },
};
