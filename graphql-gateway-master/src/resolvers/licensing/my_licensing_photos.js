import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    myLicensingPhotos: async (_, {sort, status, first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          totalCount,
          __photoIds,
        } = await dataSources.Licensing.myLicensingPhotos.paginatedLicensingPhotoList(
            legacyPagination,
            status,
            sort,
        );

        return {
          nodes: (await dataSources.Licensing.licensingPhoto.findByInternalIds(__photoIds)),
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
        __filter: status,
      };
    },
    myLicensingPhotosV2: async (_, {sort, status, first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after, overridePagination: true}, async (legacyPagination) => {
        const {
          cursors,
          totalCount,
          __photoIds,
        } = await dataSources.Licensing.myLicensingPhotos.paginatedLicensingPhotoListV2(
            {
              pageNum: legacyPagination.first,
              pageSize: legacyPagination.after,
            },
            status,
            sort,
        );

        const cursorPagination = {
          ...cursors,
        };

        return {
          nodes: (await dataSources.Licensing.licensingPhoto.findByInternalIds(__photoIds)),
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
        __filter: status,
      };
    },
  },
};
