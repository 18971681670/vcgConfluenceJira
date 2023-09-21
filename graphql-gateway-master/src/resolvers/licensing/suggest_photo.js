import {ApolloError} from 'apollo-server-express';

export const resolvers = {
  Mutation: {
    dismissSuggestPhoto: async (_, {photoId}, {dataSources}) => {
      const currentUserId = dataSources.UserCenter.user.currentUserId;
      if (!currentUserId) {
        throw new ApolloError('Unauthorised', '401', {status: 401});
      }
      return await dataSources.Licensing.suggestPhoto.dismissSuggestPhoto(photoId);
    },
  },
};
