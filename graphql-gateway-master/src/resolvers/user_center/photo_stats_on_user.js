// import {logger} from '../../utils/logger';

const PHOTO_STATS_ON_USER_CACHE_HINT = {
  maxAge: 600,
  scope: 'PRIVATE',
};

export const resolvers = {
  User: {
    photoStats: async ({__internalId}, _, {dataSources}, info) => {
      info.cacheControl.setCacheHint(PHOTO_STATS_ON_USER_CACHE_HINT);
      return await dataSources.Photo.photosAggregateStats.getAggregateStats({userLegacyId: __internalId});
    },
  },
};
