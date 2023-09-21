import {
  loadSqlBasedConnectionFields,
} from '../helpers';

const PRIVACY_RULES = {
  UNLISTED: '0',
  LIMITED_ACCESS: '1',
  PROFILE: '2',
  VISIBLE: '0,2',
  ALL: '0,1,2',
};

export const resolvers = {
  Query: {
    photoSearch: async (_, {first, after, last, before, search, filters, sort}, {dataSources}) => {
      const currentUserId = dataSources.UserCenter.user.currentUserId;
      if (!currentUserId) {
        return {
          edges: [],
          totalCount: 0,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
          },
        };
      }
      let isAdmin = false;
      if (currentUserId != null) {
        const currentUser = await dataSources.UserCenter.user.findByInternalId(currentUserId);
        if (currentUser != null && currentUser.type == 'ADMIN') {
          isAdmin = true;
        }
      }
      const loadConnection = loadSqlBasedConnectionFields({first, after, last, before}, async (legacyPagination) => {
        const {
          __photoIds,
          totalCount,
        } = await dataSources.Search.photoSearch.paginatedPhotoIdList(
            legacyPagination,
            search,
            filters,
            sort,
        );
        let nodes = [];
        if (isAdmin) {
          nodes = await dataSources.Photo.photo.findByInternalIdsForAdmin(__photoIds);
        } else {
          nodes = await dataSources.Photo.photo.findByInternalIds(__photoIds);
        }
        const blockUserIds = await dataSources.SitewideSettings.sitewideSettingUserBlock.getUserBlockIdList(currentUserId);
        nodes = nodes.filter((_photo) => !!_photo && !blockUserIds.includes(_photo.__uploaderUserId));

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
    photosAggregationSearch: async (_, {term, tag, geo, only, exclude, userId, createdAfterDaysAgo, wasFeaturedType, followersCount, sort, page, rpp, imageSize, excludeNude, mediaType, likedBy, category, aggregate, top}, {dataSources}) => {
      const resp = await dataSources.Search.photoSearch.photosAggregationSearch(term, tag, geo, only, exclude, userId, createdAfterDaysAgo, wasFeaturedType, followersCount, sort, page, rpp, imageSize, excludeNude, mediaType, likedBy, category, aggregate, top);
      const result = {
        aggregateType: resp.aggregate_type,
        aggregates: resp.aggregates,
      };
      return {
        aggregateRes: result,
      };
    },

    photosLikeSearch: async (_, {term, terms, tag, geo, only, exclude, userId, createdAfterDaysAgo, wasFeaturedType, followersCount, sort, page, rpp, imageSize, excludeNude, mediaType, likedBy, category, camera, lens}, {dataSources}) => {
      const resp = await dataSources.Search.photoSearch.photosLikeSearch(term, terms, tag, geo, only, exclude, userId, createdAfterDaysAgo, wasFeaturedType, followersCount, sort, page, rpp, imageSize, excludeNude, mediaType, likedBy, category, camera, lens);
      const photoIds = [];
      resp.photos.forEach((photo) => {
        if (photo) {
          photoIds.push(photo.id);
        }
      });

      const photos = await dataSources.Photo.photo.findByInternalIds(photoIds);

      // Create cursors for null photos to preserve pagination
      const edges = photos.map((photo) => {
        return {
          node: photo,
        };
      });

      if (edges === null || edges === undefined || edges.length < 1) {
        return null;
      }

      const hasNextPage = resp.current_page != null && resp.total_pages != null && resp.total_pages > resp.current_page;

      const pageInfo = {
        hasNextPage,
        hasPreviousPage: !(page == null | page == 1),
        currentPageLegacy: resp.current_page,
        legacyTotalPages: resp.total_pages,
      };
      return {edges, pageInfo};
    },

    myUnlicensedPhotos: async (_, {first, after, sort}, {dataSources, currentUserId}) => {
      if (!currentUserId) {
        return null;
      }
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __photoIds,
          totalCount,
        } = await dataSources.Search.photoSearch.paginatedPhotoIdList(
            legacyPagination,
            '',
            [{key: 'USER_ID', value: currentUserId}, {key: 'EXCLUDE_LICENSING_STATUS', value: '0,1,2,3'}, {key: 'NSFW', value: false}, {key: 'PRIVACY', value: '0,1,2'}],
            sort,
        );
        const nodes = await dataSources.Photo.photo.findByInternalIdsInGalleryAndResubmit(__photoIds);

        return {
          nodes,
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

    myPhotosV2: async (_, {privacy, sort, first, after}, {dataSources, currentUserId}) => {
      if (!currentUserId) {
        return null;
      }

      const filters = [{key: 'USER_ID', value: currentUserId},
        {key: 'PRIVACY', value: PRIVACY_RULES[privacy]}];

      const loadConnection = loadSqlBasedConnectionFields({
        first,
        after,
        overridePagination: true,
      }, async (legacyPagination) => {
        const {
          cursors,
          __photoIds,
          totalCount,
        } = await dataSources.Search.photoSearch.paginatedPhotoIdListV2(
            {
              pageNum: legacyPagination.first,
              pageSize: legacyPagination.after,
            },
            '',
            filters,
            sort,
        );

        const cursorPagination = {
          ...cursors,
        };

        const nodes = await dataSources.Photo.photo.findByInternalIds(__photoIds);

        return {
          nodes,
          totalCount,
          cursorPagination,
          cursors,
        };
      });

      const {edges, totalCount} = await loadConnection();
      return {
        edges,
        totalCount,
      };
    },
  },
};
