// import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  User: {
    photos: async ({__internalId, __cacheHint}, {privacy, excludeNude, sort, first, after}, {dataSources}, info) => {
      const cacheHint = __cacheHint;
      info.cacheControl.setCacheHint(cacheHint);

      /*
       * 查询当前登陆用户是否是管理员，若是管理员，则可以查到在用户的profile中看到private photos
       */
      const currentUserId = dataSources.UserCenter.user.currentUserId;
      if (currentUserId != null) {
        const currentUser = await dataSources.UserCenter.user.findByInternalId(currentUserId);
        if (currentUserId == __internalId || (currentUser != null && currentUser.type == 'ADMIN' && privacy == 'PROFILE')) {
          privacy = 'ALL';
        }
      }

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __photos,
          totalCount,
        } = await dataSources.Photo.myPhotos.paginatedUserPhotoList(
            legacyPagination,
            privacy,
            excludeNude,
            sort,
            __internalId,
        );

        return {
          nodes: __photos,
          totalCount,
        };
      });

      return {
        edges: async () => {
          info.cacheControl.setCacheHint(cacheHint);
          const {edges} = await loadConnection();
          return edges;
        },
        pageInfo: async () => {
          info.cacheControl.setCacheHint(cacheHint);
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },
        totalCount: async () => {
          info.cacheControl.setCacheHint(cacheHint);
          const {totalCount} = await loadConnection();
          return totalCount;
        },
      };
    },
  },
};
