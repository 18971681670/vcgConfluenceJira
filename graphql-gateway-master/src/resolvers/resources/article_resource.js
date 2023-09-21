/* eslint-disable camelcase */
import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  ArticleResource: {
    creator: generateToOneAssocationFieldResolver('creator', 'UserCenter', 'User'),

    cover: async ({__coverPhotoId}, _, {dataSources}) => {
      return dataSources.Photo.photo.findByInternalIdForAdmin(__coverPhotoId);
    },

    images({__internalId, coverVersion}, {sizes}, {dataSources}) {
      return dataSources.Resize.resourceCoverResizeImage.findByInternalId({
        id: __internalId,
        coverVersion,
        sizes,
      });
    },

    stats: async ({legacyId}, _, {dataSources}) => {
      return dataSources.Resource.resource.getResourceViewStats(legacyId);
    },

    featureDate: async (workshop, _, {dataSources}) => {
      return dataSources.Resource.resource.getFeatureDate(workshop.legacyId)
          .then((resp) => resp.featureDate)
          .catch(() => null); // default to no feature date
    },
  },
};
