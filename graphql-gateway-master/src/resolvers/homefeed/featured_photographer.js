import {logger} from '../../utils/logger';

import {
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  FeaturedPhotographer: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },
  Query: {
    featuredPhotographers: async (_, {first, after, ignoreDismissal = false}, {dataSources}) => {
      let requestTries = 0;
      let edgesOut = [];
      let pageInfoOut = {};
      let totalCountOut = 0;
      do {
        const {
          edges,
          pageInfo,
          totalCount,
        } = await featuredPhotographerPaginatedLoop(first, after, ignoreDismissal, dataSources);

        /*
         * logger.debug('====edges====', {edges: edges});
         * logger.debug('====pageInfo====', {pageInfo: pageInfo});
         * logger.debug('====totalCount====', {totalCount: totalCount});
         */

        edgesOut = edges;
        pageInfoOut = pageInfo;
        totalCountOut = totalCount;
        // hide blocked user
        const currentUserId = dataSources.UserCenter.user.currentUserId;
        if (!!currentUserId) {
          const blockUserIds = await dataSources.SitewideSettings.sitewideSettingUserBlock.getUserBlockIdList(currentUserId);
          edgesOut = edgesOut.filter((_user) => !blockUserIds.includes(_user.__internalId));
        }

        after = !!pageInfo ? pageInfo.endCursor : '';
        requestTries += 1;
      } while (edgesOut.length < 1 && requestTries < 3 && !!pageInfoOut && pageInfoOut.hasNextPage);


      return {
        edges: edgesOut,
        pageInfo: pageInfoOut,
        totalCount: totalCountOut,
        /*
         * edges: async () => {
         *   const {edges} = await loadConnection();
         *   return edges;
         * },
         * pageInfo: async () => {
         *   const {pageInfo} = await loadConnection();
         *   return pageInfo;
         * },
         * totalCount: async () => {
         *   const {totalCount} = await loadConnection();
         *   return totalCount;
         * },
         */
        enabled: async (_args, {dataSources}) => {
          const {enabled} = await dataSources.Homefeed.featuredPhotographer.featuredPhotographerPaginated({pageNum: 1, pageSize: 0});
          return enabled;
        },
      };
    },
  },
  Mutation: {
    disableFeaturedPhotographer: async (_, {input}, {dataSources}) => {
      return await dataSources.Homefeed.featuredPhotographer.disable(input);
    },
    enabledFeaturedPhotographer: async (_, {input}, {dataSources}) => {
      return await dataSources.Homefeed.featuredPhotographer.enabled(input);
    },
    removePhotographer: async (_, {input}, {dataSources}) => {
      return await dataSources.Homefeed.featuredPhotographer.removePhotographer(input);
    },
    addPhotographer: async (_, {input}, {dataSources}) => {
      return await dataSources.Homefeed.featuredPhotographer.addPhotographer(input);
    },
  },
};

/**
 * featuredPhotographerPaginatedLoop.
 * @param {*} first
 * @param {*} after
 * @param {*} ignoreDismissal
 * @param {*} dataSources
 * @return {Promise<Object>}
 */
async function featuredPhotographerPaginatedLoop(first, after, ignoreDismissal, dataSources) {
  // FIXME: remove this after making `sort` mandatory
  const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
    const {
      __photographers,
      totalCount,
    } = await dataSources.Homefeed.featuredPhotographer.featuredPhotographerPaginated(
        legacyPagination, ignoreDismissal,
    );
    // logger.debug('====__photographers====', {__photographers: __photographers});
    const photographerIds = __photographers.map((item) => {
      return item.__photographerUserId;
    });

    // logger.debug('====photographerIds====', {photographerIds: photographerIds});
    let photographers = null;
    if (!!photographerIds) {
      const userInfos = await dataSources.UserCenter.user.bulkLoadData(photographerIds).then((users) => {
        return users.map((user) => dataSources.UserCenter.user.reducer(user));
      });
      // logger.debug('====userInfos====', {userInfos: userInfos});
      const userFollowedByMeState = await dataSources.Following.userFollowedByMeState.bulkLoadData(photographerIds);

      // logger.debug('====userFollowedByMeState====', {userFollowedByMeState: userFollowedByMeState});

      photographers = __photographers.map((item, idx) => {
        // logger.debug('====jude====', {jude: !!userInfos[idx] && true != userFollowedByMeState[idx]});
        if ((!!userInfos[idx] && (userInfos[idx].active == 0 || userInfos[idx].active == 1)) && true != userFollowedByMeState[idx]) {
          item.photographer = userInfos[idx];
          return item;
        } else {
          return null;
        }
      }).filter((item) => item != null);
    }

    // logger.debug('====photographers====', {photographers: photographers});

    return {
      nodes: photographers,
      totalCount,
    };
  });
  return await loadConnection();
}
