export const resolvers = {
  ResourceAutocoplete: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },
  Query: {
    resourceDiscoverSectionSearch: async () => {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
        totalCount: 0,
      };
    },

    resourceSearch: async () => {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
        totalCount: 0,
      };
    },

    resourceAutocomplete: async () => {
      return [];
    },
  },
};
