/* eslint-disable camelcase */
export const resolvers = {
  Resource: {
    __resolveType({__resolveType}) {
      /*
       * Resolves the specific item type passed in
       */
      return __resolveType;
    },
  },
  Query: {
    getResourceByUserIdAndSlug: async (_, {userId, slug}, {dataSources}) => {
      const resource = await dataSources.Resource.resource.getResourceByUserIdAndSlug(userId, slug);
      return resource;
    },
    getResourceByLegacyId: async (_, {legacyId}, {dataSources}) => {
      const resource = await dataSources.Resource.resource.findByInternalId(legacyId);
      return resource;
    },
    getUserResources: async (_, {legacyId, first, after, filter = false}, {dataSources}) => {
      const upcomingOnly = filter && filter === 'UPCOMING';
      const {totalCount, remaining} = await dataSources.Resource.resource.getUserIdPageInfo(legacyId, after, first, upcomingOnly);
      const hasNextPage = remaining > 0;
      const resources = await dataSources.Resource.resource.getResourcesByUserid(legacyId, first, after, false, upcomingOnly);
      const pageInfo = {
        hasNextPage,
      };
      return {
        totalCount,
        pageInfo,
        edges: [
          ...resources.map((resource) => {
            return {
              cursor: resource.mixedDateCursor,
              node: resource,
            };
          }),
        ],

      };
    },
    getUserDraftResourceCount: async (_, {}, {dataSources}) => {
      return await dataSources.Resource.resource.getUserDraftResourceCount();
    },
  },
  Mutation: {
    uploadPresignedResourceCover: async (_, {}, {dataSources}) => {
      const {
        directUpload,
        objectName,
      } = await dataSources.Resource.resource.uploadPresignedResourceCover();

      return {
        directUpload,
        objectName,
      };
    },
    createResource: async (_, {input}, {dataSources}) => {
      const resource = {...input};
      if (resource.location) {
        const location_id = await dataSources.Location.location.create(resource.location);
        resource.locationId = location_id;
      }
      const mutation = await dataSources.Resource.resource.createResource(resource);
      return mutation;
    },
    createAndPublishResource: async (_, {input}, {dataSources}) => {
      const resource = {...input};
      if (resource.location) {
        const location_id = await dataSources.Location.location.create(resource.location);
        resource.locationId = location_id;
      }
      const mutation = await dataSources.Resource.resource.createAndPublishResource(resource);
      return mutation;
    },

    updateResource: async (_, {input}, {dataSources}) => {
      const resource = {...input};
      if (resource.location) {
        const location_id = await dataSources.Location.location.create(resource.location);
        resource.locationId = location_id;
      }
      const mutation = await dataSources.Resource.resource.updateResource(resource);
      return mutation;
    },

    updateAndPublishResource: async (_, {input}, {dataSources}) => {
      const resource = {...input};
      if (resource.location) {
        const location_id = await dataSources.Location.location.create(resource.location);
        resource.locationId = location_id;
      }
      const mutation = await dataSources.Resource.resource.updateAndPublishResource(resource);
      return mutation;
    },

    publishResource: async (_, {input}, {dataSources}) => {
      const res = await dataSources.Resource.resource.publishResource(input);
      return res;
    },

    unpublishResource: async (_, {input}, {dataSources}) => {
      const res = await dataSources.Resource.resource.unpublishResource(input);
      return res;
    },

    deleteResources: async (_, {input}, {dataSources}) => {
      const res = await dataSources.Resource.resource.deleteResources(input);
      return {
        deletedIds: res,
      };
    },

    featureResource: async (_, {input}, {dataSources}) => {
      await dataSources.Resource.resource.featureResource(input.resourceLegacyId);
      return {
        clientMutationId: input.clientMutationId,
      };
    },

    unfeatureResource: async (_, {input}, {dataSources}) => {
      await dataSources.Resource.resource.unfeatureResource(input.resourceLegacyId);
      return {
        clientMutationId: input.clientMutationId,
      };
    },
  },
};

