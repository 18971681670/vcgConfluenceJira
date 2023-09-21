import {ApolloError} from 'apollo-server-core';

export const resolvers = {
  Mutation: {
    likePhoto: async (_, {input}, {dataSources}) => {
      const {photoLegacyId, clientMutationId} = input;

      try {
        await dataSources.Liking.photoLikedByMeState.like(photoLegacyId);
      } catch (e) {
        // make it idempotent
        if (!(e instanceof ApolloError) || e.extensions.response.status != 403) {
          throw e;
        }
      }

      const photo = await dataSources.Photo.photo.findByInternalId(photoLegacyId);

      return {
        clientMutationId,
        photo,
      };
    },

    unlikePhoto: async (_, {input}, {dataSources}) => {
      const {photoLegacyId, clientMutationId} = input;

      try {
        await dataSources.Liking.photoLikedByMeState.unlike(photoLegacyId);
      } catch (e) {
        // make it idempotent
        if (!(e instanceof ApolloError) || e.extensions.response.status != 403) {
          throw e;
        }
      }

      const photo = await dataSources.Photo.photo.findByInternalId(photoLegacyId);

      return {
        clientMutationId,
        photo,
      };
    },
    likeResource: async (_, {input}, {dataSources}) => {
      const {resourceId, resourceType, clientMutationId} = input;

      try {
        await dataSources.Liking.photoLikedByMeState.likeResource(resourceId, resourceType);
      } catch (e) {
        // make it idempotent
        if (!(e instanceof ApolloError) || e.extensions.response.status != 403) {
          throw e;
        }
      }

      const result=true;
      return {
        clientMutationId,
        result,
      };
    },
    unlikeResource: async (_, {input}, {dataSources}) => {
      const {resourceId, resourceType, clientMutationId} = input;

      try {
        await dataSources.Liking.photoLikedByMeState.unlikeResource(resourceId, resourceType);
      } catch (e) {
        // make it idempotent
        if (!(e instanceof ApolloError) || e.extensions.response.status != 403) {
          throw e;
        }
      }

      const result=true;
      return {
        clientMutationId,
        result,
      };
    },
    batchSaveLiked: async (_, {input}, {dataSources}) => {
      if (!dataSources.UserCenter.user.currentUserId) {
        // Use the same cache hint as the photo
        return null;
      }
      try {
        if (input && input.list && input.list.length > 0 && input.list.length<=20) {
          await dataSources.Liking.photoLikedByMeState.batchSaveLiked(dataSources.UserCenter.user.currentUserId, input.list);
          return true;
        }
      } catch (e) {

      }
      return false;
    },

  },
};
