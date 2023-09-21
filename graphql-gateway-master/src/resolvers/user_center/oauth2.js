import {btoa} from '../../utils/base64';
import {ApolloError} from 'apollo-server-express';

export const resolvers = {
  Query: {
    oauth2AccessToken: async (_parent, _args, {
      dataSources,
    }) => {
      const accessTokenInfo = dataSources.UserCenter.oauth2.getAccessToken(_args);
      return accessTokenInfo;
    },
    oauth2RefreshAccessToken: async (_parent, _args, {
      dataSources,
    }) => {
      const accessTokenInfo = dataSources.UserCenter.oauth2.freshAccessToken({
        ..._args,
        grantType: 'refresh_token',
      });
      return accessTokenInfo;
    },
    oauth2LoginPage: async (_parent, {clientId, callbackUrl, state}) => {
      const loginUrl = `${process.env.MAIN_500PX_URL}/login/oauth2?clientId=${clientId}${callbackUrl == null ? '' : ('&callbackUrl=' + callbackUrl)}${state == null ? '' : ('&state=' + state)}`;

      return {loginUrl};
    },
    oauth2AccessTokenByCode: async (_parent, {clientId, clientSecret, code}, {
      dataSources,
    }) => {
      const clientCert = 'Basic ' + btoa(clientId + ':' + clientSecret);
      const {userId, accessToken} = await dataSources.UserCenter.oauth2.getAccessTokenByCode(clientCert, code);

      const {id, firstName, lastName, username, __raw: {email}, __avatarS3Path, __avatarVersion} = await dataSources.UserCenter.user.findByInternalId(userId);
      const name = `${firstName || ''} ${lastName || ''}`.trim();
      const displayName = name ? name : username;
      const avatar = dataSources.Media.userAvatar.reducer({
        id: userId,
        __avatarS3Path,
        __avatarVersion,
      });
      return {
        userId: id,
        accessToken,
        nickName: displayName,
        avatar,
        email,
      };
    },
    oauth2LoginInfoAndClientInfo: async (_parent, {clientId}, {
      dataSources,
    }) => {
      const userId = dataSources.UserCenter.user.currentUserId;
      const {name, resources} = await dataSources.UserCenter.oauth2.getClientInfo(clientId);
      if (userId) {
        const {firstName, lastName, username} = await dataSources.UserCenter.user.findByInternalId(userId);
        const uName = `${firstName || ''} ${lastName || ''}`.trim();
        const displayName = uName ? uName : username;
        const response = await dataSources.UserCenter.oauth2.getCodeTokenInfo(clientId, userId);

        const isAuthenticated = response != null && response.resource_auth != null;

        return {isAuthenticated, isLogin: true, displayName, name, resources};
      }

      return {isAuthenticated: false, isLogin: false, displayName: '', name, resources};
    },
    oauth2GetCallBackUrl: async (_parent, {clientId, resourceAuth, callbackUrl, state}, {
      dataSources,
    }) => {
      const userId = dataSources.UserCenter.user.currentUserId;
      if (!userId) {
        throw new ApolloError('Unauthorised', '401', {status: 401});
      }

      const response = await dataSources.UserCenter.oauth2.getCallBackUrl(clientId, userId, resourceAuth, callbackUrl, state);
      return {callbackUrl: response};
    },
  },
  Mutation: {
    oauth2Revoke: async (_, {
      input,
    }, {
        dataSources,
      }) => {
      await dataSources.UserCenter.oauth2.revoke(input);
      return 'OK';
    },
  },
};
