export const resolvers = {
  Query: {
    getExploreFeed: async (_, {first, after}, {dataSources, currentUserId}) => {
      const response = await dataSources.Explore.explore.getFeed(currentUserId || '', first, after);
      return {
        __photoIds: response.__photoIds,
        __cursors: response.__cursors,
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: response.__photoIds !== undefined && response.__photoIds.length,
          endCursor: response.__next,
        },
      };
    },
  },

  ExploreConnection: {
    edges: async ({__photoIds, __cursors}, _, {dataSources}) => {
      const photos = await dataSources.Photo.photo.findByInternalIdsExcludeNsfw(__photoIds);

      const resp = photos.map((photo) => {
        return {
          node: photo,
          cursor: photo ? __cursors[photo.legacyId] : '',
        };
      }).filter((photo) => photo.node !== null);

      return resp;
    },
  },
};
