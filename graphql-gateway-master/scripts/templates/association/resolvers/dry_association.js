// import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  __RESOURCE_TYPE_PASCALCASE__: {
    __PREFIXED_ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__: async ({__internalId, __cacheHint}, {first, after, filter}, {dataSources}, info) => {
      // TODO Feel free to change to a cache hint different from the parent resource
      const cacheHint = __cacheHint;

      info.cacheControl.setCacheHint(cacheHint);

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          ____ASSOCIATED_RESOURCE_TYPE_CAMELCASE__Ids,
          ____ASSOCIATED_RESOURCE_TYPE_CAMELCASE__EdgePayloads,
          totalCount,
        } = await dataSources.__ASSOCIATION_MICROSERVICE_PASCALCASE__.__CLASS_NAME_CAMELCASE__.paginated__ASSOCIATED_RESOURCE_TYPE_PASCALCASE__IdList(
            legacyPagination,
            __internalId,
            // filter,
        );

        return {
          nodes: (await dataSources.__ASSOCIATED_MICROSERVICE_PASCALCASE__.__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__.findByInternalIds(____ASSOCIATED_RESOURCE_TYPE_CAMELCASE__Ids)),
          edgePayloads: ____ASSOCIATED_RESOURCE_TYPE_CAMELCASE__EdgePayloads,
          totalCount,
        };
      });

      return {
        edges: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(cacheHint);
          const {edges} = await loadConnection();
          return edges;
        },

        pageInfo: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(cacheHint);
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
    add__PREFIXED_ASSOCIATED_RESOURCE_TYPE_PASCALCASE__To__RESOURCE_TYPE_PASCALCASE__: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        __RESOURCE_TYPE_CAMELCASE__LegacyId,
        __ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId,
      } = input;
      await dataSources.__MICROSERVICE_PASCALCASE__.__CLASS_NAME_CAMELCASE__.add(input);

      return {
        clientMutationId,
        __RESOURCE_TYPE_CAMELCASE__: async () => {
          return await dataSources.__MICROSERVICE_PASCALCASE__.__RESOURCE_TYPE_CAMELCASE__.findByInternalId(__RESOURCE_TYPE_CAMELCASE__LegacyId);
        },
        __ASSOCIATED_RESOURCE_TYPE_CAMELCASE__: async () => {
          return await dataSources.__ASSOCIATED_MICROSERVICE_PASCALCASE__.__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__.findByInternalId(__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId);
        },
      };
    },

    remove__PREFIXED_ASSOCIATED_RESOURCE_TYPE_PASCALCASE__From__RESOURCE_TYPE_PASCALCASE__: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        __RESOURCE_TYPE_CAMELCASE__LegacyId,
        __ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId,
      } = input;
      await dataSources.__MICROSERVICE_PASCALCASE__.__CLASS_NAME_CAMELCASE__.remove(input);

      return {
        clientMutationId,
        __RESOURCE_TYPE_CAMELCASE__: async () => {
          return await dataSources.__MICROSERVICE_PASCALCASE__.__RESOURCE_TYPE_CAMELCASE__.findByInternalId(__RESOURCE_TYPE_CAMELCASE__LegacyId);
        },
        __ASSOCIATED_RESOURCE_TYPE_CAMELCASE__: async () => {
          return await dataSources.__ASSOCIATED_MICROSERVICE_PASCALCASE__.__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__.findByInternalId(__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__LegacyId);
        },
      };
    },
  },
};
