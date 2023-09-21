import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    myGalleries: async (_, {first, after, sort, search, showNude}, {dataSources}) => {
      // FIXME: remove this after making `sort` mandatory
      if (!sort) {
        sort = 'POSITION_ASC';
      }

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __galleries,
          __galleryEdgePayloads,
          totalCount,
        } = await dataSources.Gallery.myGalleries.paginatedGalleryList(
            legacyPagination,
            sort.toLowerCase(),
            search,
            showNude,
        );

        // Note: resolves HELP-2009. Fixes private galleries with a null privateToken
        const privateGalleryIdsWithEmptyTokens = [];
        __galleries.forEach((gallery) => {
          if (gallery.privacy === 'PRIVATE' && !gallery.privateToken) {
            privateGalleryIdsWithEmptyTokens.push(gallery.legacyId);
          }
        });

        if (privateGalleryIdsWithEmptyTokens.length > 0) {
          const updatedGalleries = await dataSources.Gallery.myGalleries.backfillPrivateGalleryTokens({
            galleryIds: privateGalleryIdsWithEmptyTokens,
          });

          if (updatedGalleries && Object.keys(updatedGalleries).length > 0) {
            __galleries.forEach((gallery) => {
              const updatedGallery = updatedGalleries[gallery.legacyId];
              if (updatedGallery) {
                gallery.privateToken = updatedGallery.token;
              }
            });
          }
        }

        return {
          nodes: __galleries,
          edgePayloads: __galleryEdgePayloads,
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
    myGalleriesV2: async (_, {first, after, sort, search, showNude, privacy}, {dataSources}) => {
      // FIXME: remove this after making `sort` mandatory
      if (!sort) {
        sort = 'POSITION_ASC';
      }

      const loadConnection = loadSqlBasedConnectionFields({first, after, overridePagination: true}, async (legacyPagination) => {
        const {
          cursors,
          __galleries,
          __galleryEdgePayloads,
          totalCount,
        } = await dataSources.Gallery.myGalleries.paginatedGalleryListV2(
            {
              pageNum: legacyPagination.first,
              pageSize: legacyPagination.after,
            },
            sort.toLowerCase(),
            search,
            showNude,
            privacy.toLowerCase(),
        );

        const cursorPagination = {
          ...cursors,
        };

        // Note: resolves HELP-2009. Fixes private galleries with a null privateToken
        const privateGalleryIdsWithEmptyTokens = [];
        __galleries.forEach((gallery) => {
          if (gallery.privacy === 'PRIVATE' && !gallery.privateToken) {
            privateGalleryIdsWithEmptyTokens.push(gallery.legacyId);
          }
        });

        if (privateGalleryIdsWithEmptyTokens.length > 0) {
          const updatedGalleries = await dataSources.Gallery.myGalleries.backfillPrivateGalleryTokens({
            galleryIds: privateGalleryIdsWithEmptyTokens,
          });

          if (updatedGalleries && Object.keys(updatedGalleries).length > 0) {
            __galleries.forEach((gallery) => {
              const updatedGallery = updatedGalleries[gallery.legacyId];
              if (updatedGallery) {
                gallery.privateToken = updatedGallery.token;
              }
            });
          }
        }

        return {
          nodes: __galleries,
          edgePayloads: __galleryEdgePayloads,
          totalCount,
          cursorPagination,
          cursors,
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
    myGalleryIdsOfPhoto: async (_, {photoLegacyIds}, {dataSources}) => {
      return dataSources.Gallery.myGalleries.myGalleryIdOfPhotos(photoLegacyIds);
    },
  },
  Mutation: {
    rearrangeGallery: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        galleryId,
      } = input;
      await dataSources.Gallery.myGalleries.rearrageGallery({...input, rearrange_id: galleryId});

      return {
        clientMutationId,
      };
    },
  },
};
