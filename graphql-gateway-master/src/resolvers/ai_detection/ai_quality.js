export const resolvers = {
  Query: {
    getAiQualityData: async (_, args, {dataSources}) => {
      return await dataSources.AiDetection.aiQuality.batchGetPhotoAiQualities(args.photoIds);
    },
  },
};
