// import {logger} from '../../utils/logger';
import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Photo: {
    inGalleries: async ({__internalId, __uploaderUserId, __cacheHint}, {first, after}, {dataSources}, info) => {
      const cacheHint = __cacheHint;

      info.cacheControl.setCacheHint(cacheHint);

      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        let {
          __galleries,
          totalCount,
        } = await dataSources.Gallery.inGalleriesOnPhoto.paginatedGalleryList(
            legacyPagination,
            __internalId,
            __uploaderUserId,
        );

        const currentUserId = dataSources.UserCenter.user.currentUserId;
        if (!!currentUserId && __galleries.length > 0) {
          const blockUserIds = await dataSources.SitewideSettings.sitewideSettingUserBlock.getUserBlockIdList(currentUserId);
          __galleries = __galleries.filter((_gallery) => !!_gallery && !blockUserIds.includes(_gallery.__creatorUserId));
        }

        return {
          nodes: __galleries,
          totalCount,
        };
      });

      return {
        edges: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(cacheHint);
          const {edges} = await loadConnection();
          return edges;
        },

        pageInfo: async (_args, _context, info) => {
          info.cacheControl.setCacheHint(cacheHint);
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },

        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },
      };
    },
  },
};
