import {logger} from '../../utils/logger';

export const resolvers = {
  Mutation: {
    followUser: async (_, {input}, {dataSources}) => {
      const {
        userLegacyId,
        clientMutationId,
      } = input;

      await dataSources.Following.userFollowedByMeState.follow(userLegacyId);

      return {
        clientMutationId,
        me: async () => {
          const currentUserId = dataSources.UserCenter.user.currentUserId;
          return await dataSources.UserCenter.user.findByInternalId(currentUserId);
        },
        followee: async () => {
          return await dataSources.UserCenter.user.findByInternalId(userLegacyId);
        },
      };
    },

    unfollowUser: async (_, {input}, {dataSources}) => {
      const {
        userLegacyId,
        clientMutationId,
      } = input;

      await dataSources.Following.userFollowedByMeState.unfollow(userLegacyId);

      return {
        clientMutationId,
        me: async () => {
          const currentUserId = dataSources.UserCenter.user.currentUserId;
          return await dataSources.UserCenter.user.findByInternalId(currentUserId);
        },
        followee: async () => {
          return await dataSources.UserCenter.user.findByInternalId(userLegacyId);
        },
      };
    },
  },
};
