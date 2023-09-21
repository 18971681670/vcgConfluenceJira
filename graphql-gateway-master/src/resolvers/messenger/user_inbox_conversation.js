import {
  loadSqlBasedConnectionFields,
  loadDdbBasedConnectionFieldsOnlyLastEvalutedKey,
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  UserInboxConversationInfo: {
    toUser: generateToOneAssocationFieldResolver('toUser', 'UserCenter', 'User', 'toUserId'),
  },
  Query: {
    myInboxConversation: async (_, {first, after}, {dataSources}) => {
      const loadConnection = loadDdbBasedConnectionFieldsOnlyLastEvalutedKey({first, after}, async (ddbPagination) => {
        const {
          __lastEvaluatedKey,
          __inboxInfo,
        } = await dataSources.Messenger.myConversationList.conversationList(ddbPagination);
        return {
          nodes: __inboxInfo,
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
    mySearchInboxConversation: async (_, {first, after, searchText}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __inboxInfo,
          totalCount,
        } = await dataSources.Messenger.myConversationList.searchConversationList(
            legacyPagination,
            searchText,
        );
        return {
          nodes: __inboxInfo,
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
    myStrangerInboxConversation: async (_, {}, {dataSources}) => {
      const {__inboxInfo, __lastEvaluatedKey} = await dataSources.Messenger.myConversationList.strangerConversationList();

      const edges = __inboxInfo.map((node) => {
        if (!node) {
          return null;
        }

        return {
          node,
        };
      }).filter((e) => e);

      return {
        edges: edges,
        pageInfo: {
          startCuror: '',
          endCursor: __lastEvaluatedKey,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
    },
    myStrangerMesssageCnt: async (_, {}, {dataSources}) => {
      return await dataSources.Messenger.myConversationList.totalStrangerCnt();
    },
    isMessageBlock: async (_, {blockId}, {dataSources}) => {
      return await dataSources.Messenger.block.isBlock(blockId);
    },
  },
};
