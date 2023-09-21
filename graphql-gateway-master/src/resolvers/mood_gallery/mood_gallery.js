import {loadSqlBasedConnectionFields} from '../helpers';
import {ApolloError} from 'apollo-server-express';

export const PHOTO_SORT_TYPE = {
  0: 'RECENTLY_ADDED_DESC',
  1: 'RECENTLY_ADDED_ASC',
  2: 'IMPRESSIONS_DESC',
  3: 'IMPRESSIONS_ASC',
  4: 'HIGHEST_PULSE_DESC',
  5: 'HIGHEST_PULSE_ASC',
};

export const resolvers = {
  MoodGallery: {
    __resolveType({__resolveType}) {
      /*
       * Resolves the specific item type passed in
       * so __resolveType: 'Gallery' will call the Gallery resolver, etc
       */
      return __resolveType;
    },

    isLikedByMe: async ({__internalId}, _, {dataSources}) => {
      if (!dataSources.UserCenter.user.currentUserId) {
        // Use the same cache hint as the photo
        return null;
      }
      return await dataSources.Liking.photoLikedByMeState.resourceLikedByMe(__internalId, 'MOOD_GALLERY');
    },
    likesCount: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.Liking.photoLikeCounter.findByResourceKey(__internalId, 'MOOD_GALLERY');
    },
    photosAddedToGallery: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.MoodGallery.moodGallery.countPhotosAddedToGallery(__internalId, 'MOOD_GALLERY');
    },
    // eslint-disable-next-line no-unused-vars
    viewStat: async ({__internalId}, _, {dataSources}) => {
      const id=0;
      const legacyId=0;
      const totalViewCount=0;
      const uniqueViewCount=0;
      return {
        id,
        legacyId,
        totalViewCount,
        uniqueViewCount,
      };
    },

    viewCount: async () => {
      return 0;
    },

    cover: async ({legacyId, cover}, _, {dataSources}) => {
      if (cover) {
        return cover;
      }
      cover = null;
      let firstImg = null;
      let pageNum = 0;
      /*
       * 取第一张竖图
       * 若第一张图片是已删除或私有的图片，则取下一张，依次往复
       * 若整个mood中都没有一张竖图，则取mood中的第一张图。
       */
      while (!cover) {
        const {
          items,
          totalPages,
        } = await dataSources.MoodGallery.moodGalleryItem.getItemsPageByMoodId(legacyId, false, {pageNum: ++pageNum, pageSize: 10});
        if (items && items.length > 0) {
          /*
           * 过滤已删除和私有的图片
           * const coverPhotoId = items[0].photoId;
           * cover = await dataSources.Photo.photo.findByInternalId(coverPhotoId);
           */

          const photoIds = [];
          items.forEach((item) => {
            photoIds.push(item.photoId);
          });
          const verticalPhotos = [];
          const photos = await dataSources.Photo.photo.findByInternalIds(photoIds);
          if (photos) {
            photos.forEach((p) => {
              // 过滤已删除和私有的图片
              if (p && p.__raw && p.__raw.status == 1 && p.__raw.privacy_level == 2) {
                if (firstImg == null) {
                  firstImg = p;
                }
                if (!!p.height && !!p.width && p.height>p.width) {
                  verticalPhotos.push(p);
                }
              }
            });
            cover = verticalPhotos.length > 0 ? verticalPhotos[0] : null;
          }
        }
        if (pageNum >= totalPages) {
          // 已是最后一页数据了
          break;
        }
      }

      if (cover == null) {
        // 若整个mood中都没有一张竖图，则取mood中的第一张图
        cover = firstImg;
      }
      return cover;
    },

    photos: async ({legacyId, photos}, {first, after, isAdmin}, {dataSources, currentUserId, currentUserType}) => {
      // 兼容mock接口的数据，后续需去掉
      if (photos) {
        return photos;
      }

      if (!legacyId) {
        return {};
      }
      if (isAdmin) {
        // admin dashboard
        if (!currentUserId) {
          throw new ApolloError('Not Login', '401', {status: 401});
        }
        if (currentUserType !== '9') {
          throw new ApolloError('Not Admin', '401', {status: 401});
        }
      }

      const loadConnection = loadSqlBasedConnectionFields({first, after, overridePagination: isAdmin}, async (legacyPagination) => {
        const {
          items,
          totalCount,
        } = await dataSources.MoodGallery.moodGalleryItem.getItemsPageByMoodId(legacyId, isAdmin,
                    isAdmin ? {pageNum: legacyPagination.first, pageSize: legacyPagination.after} : legacyPagination);

        // isByPage=true为传统分页，否则为游标分页
        const cursor = isAdmin ? {cursors: [1], cursorPagination: 1} : {};

        // 过滤非active和private的photo，查询下一页需根据endCursor传值
        if (!isAdmin) {
          const photoIds = [];
          items.forEach((item) => {
            photoIds.push(item.photoId);
          });
          const activePhotoArrs = await dataSources.Photo.photo.findByInternalIds(photoIds);
          const photoMap = {};
          activePhotoArrs.forEach((photo) => {
            if (!!photo && !!photo.__raw && photo.__raw.status == 1 && photo.__raw.privacy_level == 2) {
              photoMap[photo.legacyId] = photo;
            }
          });
          const returnItems = [];
          items.forEach((item) => {
            if (photoMap.hasOwnProperty(item.photoId)) {
              item.photo = photoMap[item.photoId];
              returnItems.push(item);
            }
          });
          return {
            nodes: returnItems,
            totalCount,
            ...cursor,
          };
        }

        return {
          nodes: items,
          totalCount,
          ...cursor,
        };
      });
      const {edges, pageInfo, totalCount} = await loadConnection();

      return {
        edges,
        pageInfo,
        totalCount,
      };
    },

    canonicalPath: async ({canonicalPath, status}) => {
      if (!canonicalPath || status != 'PUBLISHED') {
        return null;
      }
      return `/mood/${canonicalPath}`;
    },

    createdBy: async ({__creatorUserId, createdBy}, _, {dataSources}) => {
      if (__creatorUserId) {
        return dataSources.UserCenter.user.findByInternalId(__creatorUserId);
      } else {
        return createdBy;
      }
    },

    photosAddedSinceLastPublished: async ({legacyId}, _, {dataSources}) => {
      return dataSources.MoodGallery.moodGalleryItem.getNewPublishedNumByMoodId(legacyId);
    },
  },
  Query: {
    exploreMoodGallery: async (_, {first = 6, after}, {dataSources}) => {
      if (first == null) {
        first = 6;
      }
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __moodGalleries,
          totalCount,
        } = await dataSources.MoodGallery.moodGallery.publishedMoodList(
            legacyPagination.pageNum, legacyPagination.pageSize,
        );

        return {
          nodes: __moodGalleries,
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

    getMoodDetailById: async (_, {moodId}, {dataSources, currentUserId, currentUserType}) => {
      if (!currentUserId) {
        throw new ApolloError('Not Login', '401', {status: 401});
      }
      if (currentUserType !== '9') {
        throw new ApolloError('Not Admin', '401', {status: 401});
      }
      const mood = await dataSources.MoodGallery.moodGallery.getMoodDetailByIdForAdmin(moodId);
      return mood;
    },

    getMoodDetailBySlug: async (_, {slug}, {dataSources}) => {
      const mood = await dataSources.MoodGallery.moodGallery.getMoodDetailBySlug(slug);
      if (!mood || mood.status != 'PUBLISHED') {
        throw new ApolloError('this mood not exist or has not published.', '404', {status: 404});
      }
      return mood;
    },

    moodGalleries: async (_, {status, sort, page, size}, {dataSources}) => {
      if (page < 1) {
        page = 1;
      }
      if (size < 1 || size > 10000) {
        size = 20;
      }

      const {
        __moodGalleries,
        totalCount,
      } = await dataSources.MoodGallery.moodGallery.pageMoodGalleryList(
          status, sort, page, size,
      );
      if (__moodGalleries == null) {
        return {};
      }

      return {
        edges: __moodGalleries,
        page: page,
        size: size,
        pages: Math.ceil(totalCount / size),
        totalCount,
      };
    },

    aiGenerateMoodTitle: async (_, {uuid}, {dataSources}) => {
      const response = await dataSources.MoodGallery.moodGallery.aiGenerateTitle(uuid);
      if (response && response.status == 200) {
        return response.data;
      } else {
        throw new ApolloError(response.message, '' + response.status, {status: response.status});
      }
    },
  },


  Mutation: {

    changeMoodToArchive: async (_, {moodIds}, {dataSources}) => {
      const response = await dataSources.MoodGallery.moodGallery.changeMoodToArchive(moodIds);
      if (response && response.status == 200) {
        return true;
      } else {
        return false;
      }
    },

    saveMood: async (_, {input, isPublish, isOverrideLastMood}, {dataSources}) => {
      const response = await dataSources.MoodGallery.moodGallery.saveMood(input, isPublish, isOverrideLastMood);
      return response;
    },

  },
};
