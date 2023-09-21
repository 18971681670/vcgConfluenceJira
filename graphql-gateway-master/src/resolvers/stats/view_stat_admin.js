
export const resolvers = {
  Query: {
    viewDataStat: async (_, {viewId, filter}, {dataSources}) => {
      let response;
      switch (filter) {
        case 'MOOD_GALLERY':
          response =await dataSources.MoodGallery.moodGallery.getMoodDetailByIdForAdmin(viewId);
          break;
        case 'FEATURED_GALLERIES':
          response =await dataSources.Gallery.gallery.findByInternalId(viewId);
          break;
        default:
          break;
      }
      return response;
    },
  },
  LikedResourceItem: {
    __resolveType({__resolveType}) {
      /*
       * Resolves the specific item type passed in
       * so __resolveType: 'Gallery' will call the Gallery resolver, etc
       */
      return __resolveType;
    },
  },
};
