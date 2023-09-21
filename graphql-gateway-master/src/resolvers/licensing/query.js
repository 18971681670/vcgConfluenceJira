import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    myLicensingPhotoCandidates: async (_, {filter, first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          totalCount,
          __photoIds,
        } = await dataSources.Licensing.myLicensingPhotoCandidates.paginatedPhotoIdList(
            legacyPagination,
            filter,
        );

        return {
          nodes: (await dataSources.Photo.photo.findByInternalIds(__photoIds)),
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
        __filter: filter,
      };
    },
    myLicensingPhotoCandidatesV2: async (_, {filter, sort, first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after, overridePagination: true}, async (legacyPagination) => {
        const {
          cursors,
          totalCount,
          __photoIds,
        } = await dataSources.Licensing.myLicensingPhotoCandidates.pagePhotoIdListByES(
            {
              pageNum: legacyPagination.first,
              pageSize: legacyPagination.after,
            },
            filter,
            sort,
        );
        const cursorPagination = {
          ...cursors,
        };

        return {
          nodes: (await dataSources.Photo.photo.findByInternalIds(__photoIds)),
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
        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },
        __filter: filter,
      };
    },
  },
};
