import {btoa, atob} from '../../utils/base64';

export const resolvers = {
  Query: {
    myChatBlockedUsers: async (_, {first, after}, {dataSources, currentUserId}) => {
      // Check if there are more blockIds to query for
      const lookaheadQuerySize = first + 1;
      const decodedAfterCursor = after ? atob(after).split(':')[1] : undefined;
      const {data, cursor} = await dataSources.Messenger.block.blockedUserListByCursor(decodedAfterCursor, lookaheadQuerySize);

      // If the query size is greater than the number of returned items, response.cursor will be falsy
      const hasNextPage = !!cursor;

      /*
       * If there is a nextPage, remove the last item from the data list
       * It shouldn't be returned. The front-end didn't actually ask for it
       */
      if (hasNextPage) data.pop();

      const __blockedUserIds = data.map((datum) => datum.blockId);

      const users = await dataSources.UserCenter.user.findByInternalIds(__blockedUserIds);
      const edges = users.map((user) => {
        return {node: user, cursor: btoa(`${currentUserId}:${user.legacyId}`)};
      });

      const hasEdges = edges && edges.length > 0;

      const pageInfo = {
        hasNextPage,
        hasPreviousPage: after ? true : false,
        startCursor: hasEdges ? edges[0].cursor : null,
        endCursor: hasEdges ? edges[edges.length - 1].cursor: null,
      };

      return {
        edges,
        pageInfo,
      };
    },
  },
};
