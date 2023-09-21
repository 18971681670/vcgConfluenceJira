/* eslint-disable camelcase */
/*
 * import {logger} from '../../utils/logger';
 * import {btoa, atob} from '../../utils/base64';
 */
import {
  generateToOneAssocationFieldResolver,
  loadSqlBasedConnectionFields,
  getDateCursorAndNodes,
} from '../helpers';
import {ApolloError} from 'apollo-server-core';

export const resolvers = {
  Quest: {
    canonicalPath: async ({__internalId, slug}) => {
      // This resolver is used directly by src/resolvers/notification/hydration_helpers.js:hydrateLink datasources
      return `/quests/${__internalId}/${slug}`;
    },

    cover: async ({__coverPhotoId}, _, {dataSources}) => {
      return dataSources.Photo.photo.findByInternalIdForAdmin(__coverPhotoId);
    },

    judge: generateToOneAssocationFieldResolver('judge', 'UserCenter', 'User'),

    geofenced: async ({__internalId}, _, {dataSources}) => {
      const geofences = await dataSources.Quest.questGeofences.findByKey(__internalId);
      return geofences.length > 0;
    },
    topics: async ({__internalId}, _, {dataSources}) => {
      const topics = await dataSources.Quest.questTopic.findByKey(__internalId);
      return topics;
    },
    judgeList: async ({__internalId}, _, {dataSources}) => {
      const judges = await dataSources.Quest.questjudge.findByKey(__internalId);
      return judges;
    },

    isUserInGeofence: async ({__internalId}, _, {dataSources, viewerCountry}) => {
      const geofences = await dataSources.Quest.questGeofences.findByKey(__internalId);
      if (geofences && geofences.length == 0) {
        return null;
      }

      return geofences.includes(viewerCountry);
    },

    winners: async ({__internalId, status}, _, {dataSources}) => {
      if (status !== 'COMPLETED') {
        return null;
      }

      const {questEntries} = await dataSources.Quest.questPhotos.paginatedPhotoIdList(
          {size: 50},
          __internalId,
          'winner',
      );

      return await dataSources.Photo.photo.findByInternalIds(questEntries.map((q) => q.photo_id));
    },

    multiTopicWinnerList: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.Quest.questPhotos.winners(__internalId);
    },

    submittedPhotos: async ({__internalId}, {first, after, last, before, licensingFilter, legacyPage = 0, questTopicId, uploadFromFilter}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after, last, before, overridePagination: true}, async () => {
        const {
          currentPageLegacy,
          legacyTotalPages,
          questEntries,
          totalCount,
          hasNextPage,
          hasPreviousPage,
        } = await dataSources.Quest.questPhotos.paginatedPhotoIdList(
            {
              size: last ? last : first,
              previous: before ? true : false,
              cursor: after ? after : before,
              page: legacyPage,

            },
            __internalId,
            null,
            licensingFilter,
            questTopicId,
            uploadFromFilter,
        );

        if (totalCount === 0 || questEntries.length===0) {
          return {
            nodes: [],
            cursors: [],
            totalCount,
            cursorPagination: {
              hasNextPage,
              hasPreviousPage,
            },
            edgeContext: {questLegacyIdFromContext: __internalId},
          };
        }

        const {cursors, pageCursors, nodes} = await getDateCursorAndNodes({questEntries, after, before, dataSources});

        const cursorPagination = {
          ...pageCursors,
          hasNextPage,
          hasPreviousPage,
          currentPageLegacy,
          legacyTotalPages,
        };

        return {
          nodes,
          cursors,
          totalCount,
          cursorPagination,
          edgeContext: {questLegacyIdFromContext: __internalId},
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

    mySubmittedPhotos: async ({__internalId}, {first, legacyPage = 1, questTopicId}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first}, async () => {
        const {
          currentPageLegacy,
          legacyTotalPages,
          photos,
          totalCount,
          hasNextPage,
          hasPreviousPage,
        } = await dataSources.Quest.questPhotos.mySubmittedPhotos(__internalId, questTopicId, first, legacyPage);

        if (totalCount === 0 || photos.length===0) {
          return {
            nodes: [],
            cursors: [],
            totalCount,
            cursorPagination: {
              hasNextPage,
              hasPreviousPage,
            },
            edgeContext: {questLegacyIdFromContext: __internalId},
          };
        }

        const nodes = await dataSources.Photo.photo.findByInternalIds(photos);

        const cursorPagination = {
          hasNextPage,
          hasPreviousPage,
          currentPageLegacy,
          legacyTotalPages,
        };

        return {
          nodes,
          cursors: [],
          totalCount,
          cursorPagination,
          edgeContext: {questLegacyIdFromContext: __internalId},
        };
      });

      const {edges, pageInfo, totalCount} = await loadConnection();
      return {
        edges,
        pageInfo,
        totalCount,
      };
    },

    inspirationPhotos: async ({__inspirationGalleryId}, {first, after, last, before, inspirationGalleryId}, {dataSources}) => {
      const size = before ? last : first;
      const cursor = before ? before : after;
      const _galleryId = inspirationGalleryId?inspirationGalleryId:__inspirationGalleryId;
      const loadConnection = loadSqlBasedConnectionFields({first, after, last, before, overridePagination: true}, async () => {
        const {
          cursors,
          totalCount,
          photoIds,
          pageInfo,
        } = await dataSources.Gallery.photosOnGallery.cursorPaginatedPhotoIdList({
          cursor,
          size,
          legacyId: _galleryId,
          previous: !!before,
        });

        const nodes = await dataSources.Photo.photo.findByInternalIds(photoIds);

        const cursorPagination = {
          ...cursors,
          ...pageInfo,
        };

        return {
          nodes,
          cursors,
          totalCount,
          cursorPagination,
          before,
        };
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

  QuestJudge: {
    judge: async ({judgeId}, _, {dataSources}) => {
      if (judgeId==null) {
        return null;
      }
      return await dataSources.UserCenter.user.findByInternalId(judgeId);
    },
  },

  QuestWinner: {
    photo: async ({_photo_id}, _, {dataSources}) => {
      return await dataSources.Photo.photo.findByInternalId(_photo_id);
    },

  },

  QuestInvolvement: {
    won: async ({_photo_id, _user_id}, {first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __quests,
          totalCount,
        } = await dataSources.Quest.questFeed.paginatedQuestList(
            {...legacyPagination,
              photoId: _photo_id,
              userId: _user_id,
            },
            'won',
        );
        return {
          nodes: __quests,
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
    participated: async ({_photo_id, _user_id}, {first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __quests,
          totalCount,
        } = await dataSources.Quest.questFeed.paginatedQuestList(
            {...legacyPagination,
              photoId: _photo_id,
              userId: _user_id,
            },
            'participated',
        );
        return {
          nodes: __quests,
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
  Mutation: {
    addPhotoToQuest: async (_, {input}, {dataSources}) => {
      try {
        await dataSources.Quest.questPhotos.add(input);
      } catch (e) {
        // make it idempotent
        if (!(e instanceof ApolloError) || e.extensions.response.status != 422) {
          throw e;
        }
      }

      const [photo, quest] = await Promise.all([
        dataSources.Photo.photo.findByInternalId(input.photoLegacyId),
        dataSources.Quest.quest.findByInternalId(input.questLegacyId),
      ]);

      return {
        clientMutationId: input.clientMutationId,
        photo,
        quest,
      };
    },
    removePhotoFromQuest: async (_, {input: {clientMutationId, questLegacyId, photoLegacyId}}, {dataSources}) => {
      const currentUserId = dataSources.UserCenter.user.currentUserId;
      const photo = await dataSources.Photo.photo.findByInternalId(photoLegacyId);
      try {
        if (currentUserId == photo.__uploaderUserId) {
          await dataSources.Quest.questPhotos.deleteFromQuests(questLegacyId, photoLegacyId);
        } else {
          await dataSources.Quest.questPhotos.deleteFromQuests4Admin(questLegacyId, photoLegacyId);
        }
      } catch (e) {
        // make it idempotent
        if (!(e instanceof ApolloError) || e.extensions.response.status != 422) {
          throw e;
        }
      }

      const quest = await dataSources.Quest.quest.findByInternalId(questLegacyId);

      return {
        clientMutationId: clientMutationId,
        photo,
        quest,
      };
    },
  },
};
