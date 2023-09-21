import {logger} from '../../utils/logger';
import {
  generateToOneAssocationFieldResolver,
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Workshop: {
    creator: generateToOneAssocationFieldResolver('creator', 'UserCenter', 'User'),

    location: generateToOneAssocationFieldResolver('location', 'Location', 'Location', '__locationId'),

    cover: async ({__coverPhotoId}, _, {dataSources}) => {
      return dataSources.Photo.photo.findByInternalIdForAdmin(__coverPhotoId);
    },
  },
  Query: {
    upcomingWorkshops: async (_, {first, after, sort, ownerUserLegacyId}, {dataSources}) => {
      // FIXME: remove this after making `sort` mandatory
      if (!sort) {
        sort = 'START_TIME_ACS';
      }

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        legacyPagination = {
          ...legacyPagination,
          pageNum: legacyPagination.pageNum -1,
        };

        const {
          __workshops,
          __workshopEdgePayloads,
          totalCount,
        } = await dataSources.Workshop.workshop.upcomingPage(
            legacyPagination,
            sort.toLowerCase(),
            ownerUserLegacyId,
        );

        return {
          nodes: __workshops,
          edgePayloads: __workshopEdgePayloads,
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
