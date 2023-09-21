import {logger} from '../../utils/logger';
import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  Gallery: {
    creator: generateToOneAssocationFieldResolver('creator', 'UserCenter', 'User'),

    isLikedByMe: async ({__internalId}, _, {dataSources}) => {
      if (!dataSources.UserCenter.user.currentUserId) {
        // Use the same cache hint as the photo
        return null;
      }
      return await dataSources.Liking.photoLikedByMeState.resourceLikedByMe(__internalId, 'FEATURED_GALLERIES');
    },
    likesCount: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.Liking.photoLikeCounter.findByResourceKey(__internalId, 'FEATURED_GALLERIES');
    },
    photosAddedToGallery: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.MoodGallery.moodGallery.countPhotosAddedToGallery(__internalId, 'FEATURED_GALLERIES');
    },
    // eslint-disable-next-line no-unused-vars
    viewStat: async ({__internalId}, _, {dataSources}) => {
      const id=0;
      const legacyId=0;
      const totalViewCount=0;
      const uniqueViewCount=0;
      return {
        id,
        legacyId,
        totalViewCount,
        uniqueViewCount,
      };
    },
    cover: async ({__coverPhotoId}, _, {dataSources}) => {
      if (__coverPhotoId === null || __coverPhotoId === undefined) return null;

      const [cover] = await dataSources.Photo.photo.findByInternalIdsInGallery([__coverPhotoId]);
      return cover;
    },

    canonicalPath: async ({__creatorUserId, publicSlug, privateToken, privacy, __creatorUsername}, _, {dataSources}) => {
      /*
       * This resolver is used directly by src/resolvers/notification/hydration_helpers.js:hydrateLink
       * if __creatorUsername exists, then use it
       */
      if (privacy == 'PRIVATE') {
        return `/g/${privateToken}`;
      } else {
        const creator = __creatorUsername ?
          {username: __creatorUsername} :
          await dataSources.UserCenter.user.findByInternalId(__creatorUserId);

        return creator ? `/${creator.username}/galleries/${publicSlug}` : null;
      }
    },
    reportStatus: async ({__creatorUserId, legacyId}, _, {dataSources}) => {
      if (!dataSources.UserCenter.user.currentUserId) {
        return 'UNAUTHORIZED';
      } else if (__creatorUserId == dataSources.UserCenter.user.currentUserId) {
        return 'DISABLED';
      } else {
        const reportStatus = await dataSources.Flagging.flagging.isGalleryReported(legacyId);
        if (reportStatus) {
          return 'REPORTED';
        } else {
          return 'UNREPORTED';
        }
      }
    },

    photosAddedSinceLastPublished: async ({legacyId, lastPublishedAt}, _, {dataSources}) => {
      if (lastPublishedAt) {
        const legacyPagination = {
          pageNum: 1,
          pageSize: 1,
        };

        const {
          totalCount,
        } = await dataSources.Gallery.photosOnGallery.paginatedNewlyAddedPhotoIdList(
            legacyPagination,
            legacyId,
        );
        return totalCount;
      }

      // never published reutrn null.
      return null;
    },
  },
  Query: {
    gallery: async (_, {galleryLegacyId}, {dataSources}) => {
      const gallery = await dataSources.Gallery.gallery.findByInternalId(galleryLegacyId);
      return gallery;
    },
  },
  Mutation: {
    createGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
      } = input;

      // eslint-disable-next-line max-len
      const gallery = await dataSources.Gallery.gallery.create(input);

      return {
        clientMutationId,
        gallery,
      };
    },

    updateGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        legacyId,
      } = input;

      // eslint-disable-next-line max-len
      const gallery = await dataSources.Gallery.gallery.update(legacyId, input);

      return {
        clientMutationId,
        gallery,
      };
    },

    deleteGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        legacyId,
      } = input;

      // eslint-disable-next-line max-len
      await dataSources.Gallery.gallery.destroy(legacyId);

      return {
        clientMutationId,
      };
    },

    updateGalleryExternalUrl: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
      } = input;

      await dataSources.Gallery.gallery.updateExternalUrl(input);

      return {
        clientMutationId,
      };
    },

    publishGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        galleryLegacyId,
      } = input;

      await dataSources.Gallery.gallery.publishGallery(galleryLegacyId);

      return {
        clientMutationId,
      };
    },
  },
};
