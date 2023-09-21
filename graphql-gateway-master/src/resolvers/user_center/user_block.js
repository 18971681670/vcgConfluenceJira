import {
  loadSqlBasedConnectionFields,
} from '../helpers';
import {logger} from '../../utils/logger';
import {ApolloError} from 'apollo-server-express';

export const resolvers = {
  Query: {
    getUserBlockList: async (_, {first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __userIds,
          totalCount,
        } = await dataSources.SitewideSettings.sitewideSettingUserBlock.userBlockList(
            legacyPagination,
        );

        const users = await dataSources.UserCenter.user.findByInternalIds(__userIds);
        return {
          nodes: users,
          totalCount,
        };
      });

      const {edges, pageInfo, totalCount} = await loadConnection();

      return {
        edges,
        pageInfo,
        totalCount,
      };
    },
  },
  Mutation: {
    userBlock: async (_, {userLegacyId}, {dataSources}) => {
      const currentUserId = dataSources.UserCenter.user.currentUserId;
      if (!currentUserId) {
        throw new ApolloError('Unauthorised', '401', {status: 401});
      }

      const userIds = await dataSources.SitewideSettings.sitewideSettingUserBlock.userBlock(userLegacyId);
      if (!userIds || userIds.length === 0) {
        return false;
      }

      try {
        await Promise.all([
          dataSources.Commenting.commentUserBlock.commentUserBlock(userLegacyId),
          dataSources.Following.userFollowedByMeState.unfollow(userLegacyId),
        ]);
      } catch (e) {
        // nothing to do
        logger.error('user block error', e);
      }
      return true;
    },

    userUnblock: async (_, {userLegacyId}, {dataSources}) => {
      const currentUserId = dataSources.UserCenter.user.currentUserId;
      if (!currentUserId) {
        throw new ApolloError('Unauthorised', '401', {status: 401});
      }

      const userIds = await dataSources.SitewideSettings.sitewideSettingUserBlock.userUnblock(userLegacyId);
      if (!userIds || userIds.length === 0) {
        return false;
      }
      try {
        await dataSources.Commenting.commentUserBlock.commentUserUnblock(userLegacyId);
      } catch (e) {
        // nothing to do
        logger.error('user unblock error', e);
      }
      return true;
    },
  },
};
