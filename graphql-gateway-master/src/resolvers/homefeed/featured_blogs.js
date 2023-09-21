export const resolvers = {
  FeaturedBlog: {
    __resolveType({__resolveType}) {
      /*
       * Resolves the specific item type passed in
       * so __resolveType: 'Gallery' will call the Gallery resolver, etc
       */
      return __resolveType;
    },

    isLikedByMe: async () => {
      return false;
    },
  },

};
