import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    gallerySearch: async (_, {first, after, last, before, search, filters, sort}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after, last, before}, async (legacyPagination) => {
        const {
          __galleryIds,
          totalCount,
        } = await dataSources.Search.gallerySearch.paginatedGalleryIdList(
            legacyPagination,
            search,
            filters,
            sort,
        );
        let nodes = await dataSources.Gallery.gallery.findByInternalIds(__galleryIds);

        const currentUserId = dataSources.UserCenter.user.currentUserId;
        if (!!currentUserId) {
          const blockUserIds = await dataSources.SitewideSettings.sitewideSettingUserBlock.getUserBlockIdList(currentUserId);
          nodes = nodes.filter((_gallery) => !!_gallery && !blockUserIds.includes(_gallery.__creatorUserId));
        }

        return {
          nodes,
          totalCount,
        };
      });

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
  },
};
