export const resolvers = {
  LiveAiData: {
    keywords: async ({photoId, userId, photoUrl, photoBase64Content, keywordsQuantity}, _, {dataSources}) => {
      if (photoBase64Content) {
        photoBase64Content = photoBase64Content.replace('data:image/jpg;base64,', '');
      }
      return await dataSources.AiDetection.keyword.getPhotoKeywords(photoId, userId, photoUrl, photoBase64Content, keywordsQuantity);
    },
    categories: async ({photoId}, _, {dataSources}) => {
      return await dataSources.AiDetection.category.getPhotoCategory(photoId);
    },
    title: async ({photoId}, _, {dataSources}) => {
      return await dataSources.AiDetection.title.getPhotoTitle(photoId);
    },

  },
  Query: {
    getAiDetectionData: async (_, args) => {
      return args;
    },
  },
};
