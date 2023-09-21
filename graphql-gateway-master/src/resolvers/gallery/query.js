import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    galleryByOwnerIdAndSlugOrToken: async (_, {ownerLegacyId, slug, token}, {dataSources}) => {
      if (ownerLegacyId && slug) {
        return dataSources.Gallery.gallery.getByOwnerIdAndSlug(ownerLegacyId, slug);
      } else if (token) {
        return dataSources.Gallery.gallery.getByToken(token);
      }
      return null;
    },
    galleryByOwnerIdAndSlug: async (_, {ownerLegacyId, slug}, {dataSources}) => {
      return dataSources.Gallery.gallery.getByOwnerIdAndSlug(ownerLegacyId, slug);
    },
    galleries: async (_, {galleryOwnerLegacyId, first, after, sort, search, showNude = false}, {dataSources}) => {
      if (!sort) {
        sort = 'POSITION_ASC';
      }

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __galleries,
          __galleryEdgePayloads,
          totalCount,
        } = await dataSources.Gallery.gallery.paginatedPublicGalleryList(
            legacyPagination,
            galleryOwnerLegacyId,
            sort.toLowerCase(),
            search,
            showNude,
        );

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
    myRecommendGalleries: async (_, {first, after}, {dataSources}) => {
      let __galleries = [];
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __ids,
          __galleryEdgePayloads,
          totalCount,
        } = await dataSources.Gallery.gallery.recommendGalleries(
            legacyPagination,
        );

        if (__ids.length > 0) {
          __galleries = await dataSources.Gallery.gallery.getByIds(__ids);
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
  },
};
