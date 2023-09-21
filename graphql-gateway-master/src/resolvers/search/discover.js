import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Query: {
    photoDiscoverSearch: async (_, {first, after, last, before, search, filters, sort}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after, last, before}, async (legacyPagination) => {
        const {
          __photoIds,
          totalCount,
        } = await dataSources.Search.photoDiscoverSearch.paginatedDiscoverPhotoIdList(
            legacyPagination,
            search,
            filters,
            sort,
        );
        let nodes = await dataSources.Photo.photo.findByInternalIds(__photoIds);
        const currentUserId = dataSources.UserCenter.user.currentUserId;
        if (!!currentUserId) {
          const blockUserIds = await dataSources.SitewideSettings.sitewideSettingUserBlock.getUserBlockIdList(currentUserId);
          nodes = nodes.filter((_photo) => !!_photo && !blockUserIds.includes(_photo.__uploaderUserId));
        }

        return {nodes, totalCount};
      });

      const {edges, pageInfo, totalCount} = await loadConnection();
      // TODO: will be refactored/removed as part of tracking service redesign
      await dataSources.Photo.photoViewCount.incrementViewCount(edges.map((edge) => edge.__internalId));

      return {
        edges,
        pageInfo,
        totalCount,
      };
    },
  },
};
