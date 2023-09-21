export const resolvers = {
  Query: {
    myGroupedNotifications: async () => {
      return {
        unreadCount: 0,
        haveUnread: false,
        unreadSince: '',
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
        },
        edges: [],
      };
    },
  },

  Mutation: {
    markMyGroupedNotificationsAsRead: async (_, {input}) => {
      return input;
    },
  },
};
