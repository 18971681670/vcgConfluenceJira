
export const resolvers = {
  PhotoEdge: {
    // If you request this from outside quests, you must provide a questId to the query.
    inShortlist: async ({questLegacyIdFromContext, __internalId}, {questLegacyId}, {dataSources}) => {
      const questId = questLegacyId ? questLegacyId : questLegacyIdFromContext;
      if (!questId) return Error('No quest identified. Must pass as argument if not a child of quest.');
      return await dataSources.Photo.withShortlist.findByKey({questId, photoId: __internalId});
    },
    // If you request this from outside quests, you must provide a questId to the query.
    inQuest: async ({questLegacyIdFromContext, __internalId}, {questLegacyId}, {dataSources}) => {
      const questId = questLegacyId ? questLegacyId : questLegacyIdFromContext;
      if (!questId) return Error('No quest identified. Must pass as argument if not a child of quest.');
      return await dataSources.Photo.withQuest.findByKey({questId, photoId: __internalId});
    },
  },
};
