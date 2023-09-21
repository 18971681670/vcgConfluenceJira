export const resolvers = {
  QuestHeaderPhoto: {
    photo: async ({__photoId}, _, {dataSources}) => {
      if (process.env.STAGE_ENV !== 'production') {
        // when not in production, use a photo id that exists to avoid errors when testing. The photo meta data will be wrong but not broken
        return await dataSources.Photo.photo.findByInternalId('1000024453');
      }
      return await dataSources.Photo.photo.findByInternalId(__photoId);
    },
    imageUrl: async ({__photoId}) => {
      /*
       * static s3 cdn - location of header images
       * when more need to be added, manually upload them to the static s3 and follow the folder pattern
       */
      const base = 'https://static.500px.com/quests/overview_header/';
      const android = `${base}${__photoId}/android.jpg`;
      const ios = `${base}${__photoId}/ios.jpg`;
      const webDesktop = `${base}${__photoId}/desktop.jpg`;
      const webMobile = `${base}${__photoId}/mobile.jpg`;
      return {
        android,
        ios,
        webDesktop,
        webMobile,
      };
    },
  },
};
