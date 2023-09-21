import fields from 'graphql-fields';
import {
  loadSqlBasedConnectionFields,
  getDateCursorAndNodes,
} from '../helpers';

export const resolvers = {
  Query: {
    quests: async (_, {filter, first, after}, {dataSources}, info) => {
      let cacheHint = null;
      if (filter == 'ONGOING' || !after) {
        cacheHint = {
          maxAge: 60,
          scope: 'PUBLIC',
        };
      } else {
        cacheHint = {
          maxAge: 86400,
          scope: 'PUBLIC',
        };
      }
      info.cacheControl.setCacheHint(cacheHint);
      const parsedAndFlattenedRequest = JSON.stringify(fields(info));
      const geofenced = parsedAndFlattenedRequest.includes('isUserInGeofence') || parsedAndFlattenedRequest.includes('geofenced');

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __quests,
          totalCount,
        } = await dataSources.Quest.questFeed.paginatedQuestList(
            legacyPagination,
            filter,
            geofenced,
        );

        return {
          nodes: __quests,
          totalCount,
        };
      });

      const {edges, pageInfo, totalCount} = await loadConnection();
      info.cacheControl.setCacheHint(cacheHint);
      return {
        edges,
        pageInfo,
        totalCount,
      };
    },

    questHeaderPhotos: async (_, __, {dataSources}) => {
      return await dataSources.Quest.questHeader.getQuestHeaders();
    },

    // LEGACY! DEPRECATED!
    questSubmittedPhotos: async (_, {questLegacyId, first, after = null, last, before, filter}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after, last, before, overridePagination: true}, async () => {
        const {
          questEntries,
          totalCount,
          hasNextPage,
          hasPreviousPage,
        } = await dataSources.Quest.questPhotos.paginatedPhotoIdList(
            {
              size: first,
              previous: false,
              cursor: after,
            },
            questLegacyId,
            null,
            filter,
        );

        if (totalCount === 0) {
          return {
            nodes: [],
            cursors: [],
            totalCount,
            cursorPagination: {
              hasNextPage,
              hasPreviousPage,
            },
            edgeContext: {questLegacyIdFromContext: __internalId},
          };
        }

        const {cursors, pageCursors, nodes} = await getDateCursorAndNodes({questEntries, after, before, dataSources});

        const cursorPagination = {
          ...pageCursors,
          hasNextPage,
          hasPreviousPage,
        };

        return {
          nodes,
          cursors,
          totalCount,
          cursorPagination,
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

    // DEPRECATED!
    questInspirationPhotos: async (_, {questLegacyId, first, after}, {dataSources}) => {
      const {__inspirationGalleryId} = await dataSources.Quest.quest.findByInternalId(questLegacyId);

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __photoIds,
          totalCount,
        } = await dataSources.Gallery.photosOnGallery.legacyPaginatedPhotoIdList(
            legacyPagination,
            __inspirationGalleryId,
        );

        return {
          nodes: await dataSources.Photo.photo.findByInternalIds(__photoIds),
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
