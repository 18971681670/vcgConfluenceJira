

export const resolvers = {
  Mutation: {
    signPhotoKeywordReqeuest: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
      } = input;

      if (input.photoLegacyIds.length < 2) {
        input.unionQuantity = 15;
      }

      const {
        requestBody,
        requestUrl,
      } = await dataSources.Photo.photoKeyWordToken.signPhotoKeywordReqeuest(input);

      return {
        clientMutationId,
        requestBody: requestBody,
        requestUrl: requestUrl,
      };
    },
  },
};
