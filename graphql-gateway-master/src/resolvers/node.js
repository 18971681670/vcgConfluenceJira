import {logger} from '../utils/logger';
import {globalToInternalIdWithResourceType} from '../utils/global_id';

export const resolvers = {
  Query: {
    node: async (_, {id}, {dataSources}, info) => {
      const {resourceType, internalId} = globalToInternalIdWithResourceType(id);
      logger.debug(`node is called`, {id, resourceType, internalId});

      for (const [_name, microservice] of Object.entries(dataSources)) {
        for (const [_name, ds] of Object.entries(microservice.dataSources)) {
          if (ds.resourceType == resourceType && ds.queryable) {
            const res = await ds.findByInternalId(internalId);
            if (!res) {
              return null;
            }

            info.cacheControl.setCacheHint(res.__cacheHint);

            return {
              ...res,
              __resolveType: resourceType,
            };
          }
        }
      }
    },

    nodeByLegacyId: async (_, {resourceType, legacyId}, {dataSources}, info) => {
      for (const [_name, microservice] of Object.entries(dataSources)) {
        for (const [_name, ds] of Object.entries(microservice.dataSources)) {
          if (ds.resourceType == resourceType && ds.queryable) {
            const res = await ds.findByInternalId(legacyId);
            if (!res) {
              return null;
            }

            info.cacheControl.setCacheHint(res.__cacheHint);
            return {
              ...res,
              __resolveType: resourceType,
            };
          }
        }
      }
    },
  },

  Node: {
    __resolveType: ({__resolveType}) => {
      return __resolveType;
    },
  },
};
