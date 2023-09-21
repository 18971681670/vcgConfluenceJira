import {
  loadDdbBasedConnectionFieldsOnlyLastEvalutedKey,
} from '../helpers';

export const resolvers = {
  Message: {
    __resolveType({__resolveType}) {
      return __resolveType;
    },
  },
  Query: {
    conversationMessage: async (_, {first, after, conversationId}, {dataSources}) => {
      const loadConnection = loadDdbBasedConnectionFieldsOnlyLastEvalutedKey({first, after}, async (ddbPagination) => {
        const {
          __lastEvaluatedKey,
          __messages,
        } = await dataSources.Messenger.conversationFeedMessage.conversationMessage(ddbPagination, conversationId);

        return {
          nodes: __messages,
          lastEvaluatedKey: __lastEvaluatedKey,
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
      };
    },
    getSocketMessageInfo: async (_, {id, sender, receiver, kind, read, content, createdAt}, {dataSources}) => {
      return await dataSources.Messenger.message.directCombileMessage({id, sender, receiver, kind, read, content, createdAt});
    },
  },
};
