import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    productFeed: async (_, {period}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({}, async () => {
        const {
          __products,
          __productEdgePayloads,
          totalCount,
        } = await dataSources.Membership.productFeed.paginatedProductList(
            period,
        );

        return {
          nodes: __products,
          edgePayloads: __productEdgePayloads,
          totalCount,
        };
      });

      const {edges} = await loadConnection();
      return edges;
    },
  },
};
