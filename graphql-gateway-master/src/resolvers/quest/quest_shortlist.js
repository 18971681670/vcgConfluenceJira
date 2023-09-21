import {
  loadSqlBasedConnectionFields,
} from '../helpers';
import {ApolloError} from 'apollo-server-core';

export const resolvers = {
  Quest: {
    shortlistedPhotos: async ({__internalId}, {first, after, questTopicId}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __photoIds,
          totalCount,
        } = await dataSources.Quest.questShortlist.paginatedPhotoIdList(
            legacyPagination,
            __internalId,
            questTopicId,
        );

        const nodes = await dataSources.Photo.photo.findByInternalIds(__photoIds);

        return {
          nodes,
          totalCount,
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

  Mutation: {
    addPhotoToShortlist: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        photoLegacyId,
        questLegacyId,
      } = input;

      try {
        await dataSources.Quest.questShortlist.add(input);
      } catch (e) {
        // make it idempotent
        if (!(e instanceof ApolloError) || e.extensions.response.status != 422) {
          throw e;
        }
      }

      return {
        clientMutationId,
        photo: async () => {
          return await dataSources.Photo.photo.findByInternalId(photoLegacyId);
        },
        quest: async () => {
          return await dataSources.Quest.quest.findByInternalId(questLegacyId);
        },
      };
    },

    removePhotoFromShortlist: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        photoLegacyId,
        questLegacyId,
      } = input;

      try {
        await dataSources.Quest.questShortlist.remove(input);
      } catch (e) {
        // make it idempotent
        if (!(e instanceof ApolloError) || e.extensions.response.status != 422) {
          throw e;
        }
      }

      return {
        clientMutationId,
        photo: async () => {
          return await dataSources.Photo.photo.findByInternalId(photoLegacyId);
        },
        quest: async () => {
          return await dataSources.Quest.quest.findByInternalId(questLegacyId);
        },
      };
    },
  },
};
