import {logger} from '../../utils/logger';

export const resolvers = {
  Mutation: {
    featureGallery: async (_, {input}, {dataSources}) => {
      const {
        galleryLegacyId,
        userLegacyId,
      } = input;

      const {code, message} = await dataSources.Gallery.featureGallery.featureGallery(userLegacyId, galleryLegacyId);

      return {
        code,
        message,
      };
    },

    unfeatureGallery: async (_, {input}, {dataSources}) => {
      const {
        galleryLegacyId,
        userLegacyId,
      } = input;

      const {code, message} = await dataSources.Gallery.featureGallery.unfeatureGallery(userLegacyId, galleryLegacyId);

      return {
        code,
        message,
      };
    },
  },
};
