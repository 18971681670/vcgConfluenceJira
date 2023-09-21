import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    __CLASS_NAME_CAMELCASE__: async (_, {first, after, filter}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          ____RESOURCE_TYPE_CAMELCASE__Ids,
          ____RESOURCE_TYPE_CAMELCASE__EdgePayloads,
          totalCount,
        } = await dataSources.__FEED_MICROSERVICE_PASCALCASE__.__CLASS_NAME_CAMELCASE__.paginated__RESOURCE_TYPE_PASCALCASE__IdList(
            legacyPagination,
            filter,
        );

        return {
          nodes: (await dataSources.__MICROSERVICE_PASCALCASE__.__RESOURCE_TYPE_CAMELCASE__.findByInternalIds(____RESOURCE_TYPE_CAMELCASE__Ids)),
          edgePayloads: ____RESOURCE_TYPE_CAMELCASE__EdgePayloads,
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
