export const resolvers = {
  Query: {
    getPhotoKeywords: async (_, {photoId, userId, photoUrl, photoBase64Content, quantity}, {dataSources}) => {
      if (photoBase64Content) {
        photoBase64Content = photoBase64Content.replace('data:image/jpg;base64,', '');
      }
      return await dataSources.AiDetection.keyword.getPhotoKeywords(photoId, userId, photoUrl, photoBase64Content, quantity);
    },
    batchGetPhotoKeywords: async (_, {photos, userId, intersectionQuantity, unionQuantity}, {dataSources}) => {
      return await dataSources.AiDetection.keyword.batchGetPhotoKeywords(photos, userId, intersectionQuantity, unionQuantity);
    },
  },
};
