import {
  generateToOneAssocationFieldResolver,
  loadDdbBasedConnectionFields,
  loadSqlBasedConnectionFields,
} from '../helpers';

export const resolvers = {
  Story: {
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
      return await dataSources.Liking.photoLikedByMeState.resourceLikedByMe(__internalId, 'PHOTO_STORIES');
    },
    storyPulse: generateToOneAssocationFieldResolver('storyPulse', 'ContentStream', 'StoryPulse', '__internalId'),
    photosInStory: async ({legacyId, photosInStory}, _, {dataSources}) => {
      // 兼容mock数据，后续去掉
      if (photosInStory) {
        return photosInStory;
      }

      const {
        items,
      } = await dataSources.Story.storyItem.getPhotoListByStoryId(legacyId);

      return items;
    },
    viewCount: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.Story.storyViewCount.findByKey(__internalId);
    },
    createdBy: async ({__creatorUserId}, _, {dataSources}) => {
      if (__creatorUserId) {
        const user = await dataSources.UserCenter.user.findByInternalId(__creatorUserId);
        return user;
      } else {
        return null;
      }
    },
    canonicalPath: async ({canonicalPath, __creatorUserId}, _, {dataSources}) => {
      if (!canonicalPath) {
        return null;
      }
      const user = await dataSources.UserCenter.user.findByInternalId(__creatorUserId);
      return user ? `/p/${user.username}/story/${canonicalPath}` : null;
    },
    featureInGalleries: async ({legacyId}, {first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        let {
          __galleries,
          totalCount,
        } = await dataSources.Gallery.inGalleriesOnPhoto.paginatedGalleryListForStory(
            legacyPagination,
            legacyId,
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
    comments: async ({legacyId}, {first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __comments,
          __commentEdgePayloads,
          totalCount,
        } = await dataSources.Commenting.commentsOnPhoto.paginatedStoryCommentList(
            legacyPagination,
            legacyId,
        );

        return {
          nodes: __comments,
          edgePayloads: __commentEdgePayloads,
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

        commentsAndRepliesTotalCount: async (_args, {dataSources}) => {
          return await dataSources.Commenting.photoCommentCounter.commentsTotalCountStory(__internalId);
        },
      };
    },
    likedByUsers: async ({__internalId, __cacheHint}, {first, after}, {dataSources}, info) => {
      info.cacheControl.setCacheHint(__cacheHint);

      loadDdbBasedConnectionFields({first, after}, async (ddbPagination) => {
        const {
          __userIds,
          __userEdgePayloads,
          __lastEvaluatedKey,
        } = await dataSources.Liking.likedByUsersOnPhoto.paginatedUserIdList(
            ddbPagination,
            __internalId,
        );
      });

      return {
        totalCount: async (_args, {dataSources}) => {
          return await dataSources.Liking.photoLikeCounter.findByResourceKey(__internalId, 'PHOTO_STORIES');
        },
      };
    },
  },

  Query: {

    photoStories: async (_, {privacy, sort, first = 3, after, ownerId, filters, search, realTime, isByPage}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after, overridePagination: isByPage}, async (legacyPagination) => {
        const {
          __stories,
          totalCount,
        } = await dataSources.Story.story.pageStoryList(privacy, sort, ownerId, filters, search, realTime,
          isByPage ? {pageNum: legacyPagination.first, pageSize: legacyPagination.after} : legacyPagination);

        if (__stories == null) {
          return {};
        }
        // isByPage=true为传统分页，否则为游标分页
        const cursor = isByPage ? {cursors: [1], cursorPagination: 1} : {};
        return {
          nodes: __stories,
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

    getStoryDetailById: async (_, {storyId}, {dataSources}) => {
      const story = await dataSources.Story.story.getStoryDetailById(storyId);
      return story;
    },
    getStoryDetailBySlug: async (_, {slug}, {dataSources}) => {
      const story = await dataSources.Story.story.getDetailBySlug(slug);
      return story;
    },
    getRelateStoryByPhotoId: async (_, {photoIds}, {dataSources}) => {
      return await dataSources.Story.story.getRelateStoryByPhotoId(photoIds);
    },
  },

  Mutation: {
    createStory: async (_, {input}, {dataSources}) => {
      const story = await dataSources.Story.story.createStory(input);
      return {
        story,
      };
    },
    featureStory: async (_, {storyId}, {dataSources}) => {
      return await dataSources.Story.story.featureStory(storyId);
    },
    unFeatureStory: async (_, {storyId}, {dataSources}) => {
      return await dataSources.Story.story.unFeatureStory(storyId);
    },
    deleteStory: async (_, {input}, {dataSources}) => {
      const {
        storyIds,
      } = input;

      // eslint-disable-next-line max-len
      await dataSources.Story.story.deleteStory(storyIds);

      return {
        clientMutationId: '1',
      };
    },
    updateStoryPrivacy: async (_, {input}, {dataSources}) => {
      await dataSources.Story.story.updateStoryPrivacy(input);

      return {
        clientMutationId: '1',
      };
    },
    increaseStoryViewCount: async (_, {storyIds, slugs}, {dataSources}) => {
      // 有storyIds就用storyIds
      if (storyIds && storyIds.length > 0) {
        await dataSources.Story.storyViewCount.incrementViewCount(storyIds);
      } else {
        // slug主要是web detail页面用
        if (slugs && slugs.length > 0) {
          const slug = slugs[0];
          const story = await dataSources.Story.story.getDetailBySlug(slug);
          await dataSources.Story.storyViewCount.incrementViewCount([story.legacyId]);
        }
      }
      return true;
    },
  },
};
