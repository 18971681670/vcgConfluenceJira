import {logger} from '../../utils/logger';

export const resolvers = {

  ModelReleaseMetadata: {
    licensingPhoto: async ({__licensingPhotoId}, __, {dataSources}) => {
      return dataSources.Licensing.licensingPhoto.findByInternalId(__licensingPhotoId);
    },
    photo: async ({__licensingPhotoId}, __, {dataSources}) => {
      return dataSources.Photo.photo.findByInternalIdForAdmin(__licensingPhotoId);
    },
  },

  Query: {
    findModelReleaseInvitationByToken: async (__, {token}, {dataSources}) => {
      return dataSources.Licensing.modelReleaseMetadata.loadDataByToken(token);
    },

    findModelReleaseInvitationByTokenV2: async (__, {token}, {dataSources}) => {
      return dataSources.Licensing.modelReleaseMetadata.loadDataByTokenV2(token);
    },
  },
  Mutation: {
    createModelRelease: async (_, {input}, {dataSources}) => {
      const {
        modelRelease,
        directUpload,
      } = await dataSources.Licensing.modelRelease.create(input);

      return {
        clientMutationId: input.clientMutationId,
        modelRelease,
        directUpload,
      };
    },

    createModelReleaseInvitation: async (_, {input}, {dataSources}) => {
      const {
        modelRelease,
      } = await dataSources.Licensing.modelRelease.createModelReleaseInvitation(input);

      return {
        clientMutationId: input.clientMutationId,
        modelRelease,
      };
    },

    activateModelRelease: async (_, {input}, {dataSources}) => {
      const modelRelease = await dataSources.Licensing.modelRelease.activate(input.legacyId);

      return {
        clientMutationId: input.clientMutationId,
        modelRelease,
      };
    },

    rejectModelReleaseInvitation: async (_, {input}, {dataSources}) => {
      const modelReleaseInvitation = await dataSources.Licensing.modelReleaseMetadata.rejectModelReleaseInvitation(input);

      return {
        clientMutationId: input.clientMutationId,
        modelReleaseInvitation,
      };
    },

    permissionModelReleaseInvitation: async (_, {input}, {dataSources}) => {
      const modelReleaseInvitation = await dataSources.Licensing.modelReleaseMetadata.permissionModelReleaseInvitation(input);
      return {
        clientMutationId: input.clientMutationId,
        modelReleaseInvitation,
      };
    },
  },
};
