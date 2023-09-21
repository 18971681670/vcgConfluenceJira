import {
  loadSqlBasedConnectionFields,
  loadDdbBasedConnectionFieldsOnlyLastEvalutedKey,
} from '../helpers';
import {ApolloError} from 'apollo-server-express';
import {btoa} from '../../utils/base64';
export const resolvers = {
  Query: {
    me: async (_parent, _args, {dataSources}) => {
      const currentUserId = dataSources.UserCenter.user.currentUserId;
      // check if user is login.
      if (!currentUserId) {
        throw new ApolloError('Unauthorised', '401', {status: 401});
      }

      return currentUserId ? dataSources.UserCenter.user.findByInternalId(currentUserId) : null;
    },
    userByUsername: async (_, {username}, {dataSources}) => {
      return dataSources.UserCenter.user.findByUsername(username);
    },
    profileGroupsByUsername: async (_, {username}, {dataSources}) => {
      const groups = await dataSources.Monolith.profileGroups.getGroups(username);
      const objects = groups.map((group) => {
        return dataSources.Monolith.group.reducer(group);
      });

      return objects;
    },
    mySearchFollowingUsers: async (_, {first, after, searchText}, {dataSources}) => {
      let loadConnection;
      if (searchText) {
        // search in elasticsearch
        loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
          const {
            __userIds,
            totalCount,
          } = await dataSources.Search.myFollowingUser.followingUserAutocomplete(
              legacyPagination,
              {},
              searchText,
          );

          const users = await dataSources.UserCenter.user.findByInternalIds(__userIds);
          return {
            nodes: users,
            totalCount,
          };
        });
      } else {
        // direct fetch from dynamodb
        loadConnection = loadDdbBasedConnectionFieldsOnlyLastEvalutedKey({first, after}, async (ddbPagination) => {
          const {
            __userIds,
            cursor,
          } = await dataSources.Search.myFollowingUser.followingUserAutocomplete(
              {}, ddbPagination,
          );

          const users = await dataSources.UserCenter.user.findByInternalIds(__userIds);
          return {
            nodes: users,
            lastEvaluatedKey: cursor,
          };
        });
      }

      return {
        edges: async () => {
          const {edges} = await loadConnection();
          return edges;
        },

        pageInfo: async () => {
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },

        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },

      };
    },
    mySearchMessengerFriends: async (_, {first, after, searchText}, {dataSources}) => {
      let loadConnection;
      if (searchText) {
        // search in elasticsearch
        loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
          const {
            __userIds,
            totalCount,
          } = await dataSources.Search.myFollowingUser.myMessengerFriends(
              legacyPagination,
              {},
              searchText,
          );

          const users = await dataSources.UserCenter.user.findByInternalIds(__userIds);
          return {
            nodes: users,
            totalCount,
          };
        });
      } else {
        // direct fetch from dynamodb
        loadConnection = loadDdbBasedConnectionFieldsOnlyLastEvalutedKey({first, after}, async (ddbPagination) => {
          const {
            __userIds,
            cursor,
          } = await dataSources.Search.myFollowingUser.myMessengerFriends(
              {}, ddbPagination,
          );

          const users = await dataSources.UserCenter.user.findByInternalIds(__userIds);

          return {
            nodes: users,
            lastEvaluatedKey: cursor,
          };
        });
      }

      return {
        edges: async () => {
          const {edges} = await loadConnection();
          return edges;
        },

        pageInfo: async () => {
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },

        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },

      };
    },
    oauth2UserPublicInfo: async (_, {clientId, clientSecret, token}, {dataSources}) => {
      const clientCert = 'Basic ' + btoa(clientId + ':' + clientSecret);

      // 1 user public info
      const userId = await dataSources.UserCenter.oauth2.chechAccessToken(clientCert, token, '1');
      const {id, firstName, lastName, username, __raw: {email}, __avatarS3Path, __avatarVersion} = await dataSources.UserCenter.user.findByInternalId(userId);
      const name = `${firstName || ''} ${lastName || ''}`.trim();
      const displayName = name ? name : username;
      const avatar = dataSources.Media.userAvatar.reducer({
        id: userId,
        __avatarS3Path,
        __avatarVersion,
      });

      return {userId: id, nickName: displayName, avatar, email};
    },
    webAccessToken: async (_parent, _args, context) => {
      const accessTokenInfo = await context.dataSources.UserCenter.userCenter.getWebAccessToken(_args);
      const {accessToken, accessTokenExpiresIn, csrfToken, csrfTokenExpiresIn} = accessTokenInfo;
      if (accessToken && accessTokenExpiresIn) {
        context.response.cookie('x-500px-token', accessToken, {
          maxAge: accessTokenExpiresIn * 1000,
          domain: process.env.AUTH_COOKIE_DOMAIN,
          path: '/',
          httpOnly: true,
          secure: true,
        });
      }
      if (csrfToken && csrfTokenExpiresIn) {
        context.response.cookie('x-csrf-token', csrfToken, {
          maxAge: csrfTokenExpiresIn * 1000,
          domain: process.env.AUTH_COOKIE_DOMAIN,
          path: '/',
          secure: true,
        });
      }
      return accessTokenInfo;
    },
  },
};
