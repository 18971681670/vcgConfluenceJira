export const resolvers = {
  PhotoInStory: {
    __resolveType({__resolveType}) {
      /*
       *a
       * Resolves the specific item type passed in
       * so __resolveType: 'Gallery' will call the Gallery resolver, etc
       */
      return __resolveType;
    },

    photoInfo: async ({photoId}, args, {dataSources}) => {
      return dataSources.Photo.photo.findByInternalIdForAdmin(photoId);
    },


  },
};
