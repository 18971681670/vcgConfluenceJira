import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    myLicensingReleases: async (_, {first, after, filter}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __licensingReleases,
          totalCount,
        } = await dataSources.Licensing.myLicensingReleases.paginatedLicensingReleaseList(
            legacyPagination,
            filter,
        );

        return {
          nodes: __licensingReleases,
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
