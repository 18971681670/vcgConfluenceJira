/* eslint-disable camelcase */
import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Gallery: {
    photos: async ({__internalId, __creatorUserId}, {first, after, before, last, showNude}, {dataSources}, info) => {
      const size = before ? last : first;
      const cursor = before ? before : after;

      const loadConnection = loadSqlBasedConnectionFields({first, after, before, last, overridePagination: true}, async () => {
        const {
          cursors,
          totalCount,
          photoIds,
          pageInfo,
        } = await dataSources.Gallery.photosOnGallery.cursorPaginatedPhotoIdList({
          cursor,
          size,
          legacyId: __internalId,
          previous: !!before,
        });

        const nodes = await dataSources.Photo.photo.findByInternalIdsInGallery(photoIds);

        const cursorPagination = {
          ...cursors,
          ...pageInfo,
        };

        return {
          nodes,
          cursors,
          totalCount,
          cursorPagination,
          before,
        };
      });

      const {edges, pageInfo, totalCount} = await loadConnection();

      return {
        edges: async () => {
          const filteredEdges = showNude ? edges : edges.filter((item) => !item.node(null, null, info).notSafeForWork);
          // TODO: will be refactored/removed as part of tracking service redesign
          await dataSources.Photo.photoViewCount.incrementViewCount(filteredEdges.map((e) => e.__internalId));
          return filteredEdges;
        },
        pageInfo,
        totalCount,
        __internalId,
        __creatorUserId,
      };
    },
  },

  PhotoConnectionForPhotosOnGallery: {
    containsPhotos: async ({__internalId, __creatorUserId}, {photoLegacyIds}, {dataSources}) => {
      if (__creatorUserId != dataSources.UserCenter.user.currentUserId) {
        return null;
      }

      if (!photoLegacyIds || photoLegacyIds.length == 0) {
        return 'NONE';
      }

      const containsPhotos = await dataSources.Gallery.myGalleryContainsPhotos.findByKey({
        galleryInternalId: __internalId,
        photoInternalIds: photoLegacyIds,
      });

      if (containsPhotos.length == 0) {
        return 'NONE';
      } else if (containsPhotos.length == photoLegacyIds.length) {
        return 'ALL';
      } else {
        return 'SOME';
      }
    },
  },
  Query: {
    newlyAddedGalleryPhotos: async (_, {legacyGalleryId, first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __photoIds,
          __photoEdgePayloads,
          totalCount,
        } = await dataSources.Gallery.photosOnGallery.paginatedNewlyAddedPhotoIdList(
            legacyPagination,
            legacyGalleryId,
        );

        return {
          nodes: (await dataSources.Photo.photo.findByInternalIds(__photoIds)),
          edgePayloads: __photoEdgePayloads,
          totalCount,
        };
      });

      return {
        edges: async () => {
          const {edges} = await loadConnection();
          return edges;
        },
        pageInfo: async () => {
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },
        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },
      };
    },
  },
  Mutation: {
    addPhotoToGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        galleryLegacyId,
        photoLegacyId,
      } = input;

      await dataSources.Gallery.photosOnGallery.add({
        galleryLegacyId,
        photoLegacyIds: [photoLegacyId],
      });

      return {
        clientMutationId,
        gallery: async () => {
          return await dataSources.Gallery.gallery.findByInternalId(galleryLegacyId);
        },
        photo: async () => {
          return await dataSources.Photo.photo.findByInternalId(photoLegacyId);
        },
      };
    },

    addPhotosToGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        galleryLegacyId,
        photoLegacyIds,
      } = input;
      await dataSources.Gallery.photosOnGallery.add(input);

      return {
        clientMutationId,
        gallery: async () => {
          return await dataSources.Gallery.gallery.findByInternalId(galleryLegacyId);
        },
        photos: async () => {
          return await dataSources.Photo.photo.findByInternalIds(photoLegacyIds);
        },
      };
    },

    addGalleryPhotosToGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        fromGalleryLegacyId,
        toGalleryLegacyId,
      } = input;
      await dataSources.Gallery.photosOnGallery.addGalleryPhotos(input);

      return {
        clientMutationId,
        fromGallery: async () => {
          return await dataSources.Gallery.gallery.findByInternalId(fromGalleryLegacyId);
        },
        toGallery: async () => {
          return await dataSources.Gallery.gallery.findByInternalId(toGalleryLegacyId);
        },
      };
    },

    removePhotoFromGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        galleryLegacyId,
        photoLegacyId,
      } = input;
      await dataSources.Gallery.photosOnGallery.remove(input);

      return {
        clientMutationId,
        gallery: async () => {
          return await dataSources.Gallery.gallery.findByInternalId(galleryLegacyId);
        },
        photo: async () => {
          return await dataSources.Photo.photo.findByInternalId(photoLegacyId);
        },
      };
    },
    batchRemovePhotosFromGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        galleryLegacyId,
        photoLegacyIds,
      } = input;
      await dataSources.Gallery.photosOnGallery.batchRemove(input);

      return {
        clientMutationId,
        gallery: async () => {
          return await dataSources.Gallery.gallery.findByInternalId(galleryLegacyId);
        },
        photos: async () => {
          return await dataSources.Photo.photo.findByInternalIds(photoLegacyIds);
        },
      };
    },

    rearrangeGalleryPhoto: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        galleryLegacyId,
        after,
        photoLegacyId,
      } = input;
      await dataSources.Gallery.photosOnGallery.rearrangeGalleryPhoto({gallery_id: galleryLegacyId, after, rearrange_id: photoLegacyId});

      return {
        clientMutationId,
      };
    },
  },
};
