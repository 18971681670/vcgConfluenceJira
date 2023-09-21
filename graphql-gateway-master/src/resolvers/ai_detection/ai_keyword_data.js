export const resolvers = {
  Query: {
    getAiKeywordData: async (_, args, {dataSources}) => {
      return await dataSources.AiDetection.keyword.getPhotoKeywordsByIds(args.photoIds);
    },
  },
};
