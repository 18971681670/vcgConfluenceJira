export const resolvers = {
  Mutation: {
    makeMessengerRelation: async (_, {receiver}, {dataSources}) => {
      const response = await dataSources.Messenger.message.userRelation(receiver);
      return response;
    },
    sendTextMessage: async (_, {receiver, message}, {dataSources}) => {
      const response = await dataSources.Messenger.message.sendText(receiver, message);
      return response;
    },
    sendPhotoMessage: async (_, {receiver, photoId}, {dataSources}) => {
      const response = await dataSources.Messenger.message.sendPhoto(receiver, photoId);
      return response;
    },
    sendProfileMessage: async (_, {receiver, profileId}, {dataSources}) => {
      const response = await dataSources.Messenger.message.sendUserProfile(receiver, profileId);
      return response;
    },
    sendGalleryMessage: async (_, {receiver, galleryId}, {dataSources}) => {
      const response = await dataSources.Messenger.message.sendGallery(receiver, galleryId);
      return response;
    },
    sendQuestMessage: async (_, {receiver, questId}, {dataSources}) => {
      const response = await dataSources.Messenger.message.sendQuest(receiver, questId);
      return response;
    },
    sendResourceMessage: async (_, {receiver, resourceId}, {dataSources}) => {
      const response = await dataSources.Messenger.message.sendResource(receiver, resourceId);
      return response;
    },
    deleteInboxConversation: async (_, {toUserIds}, {dataSources}) => {
      return await dataSources.Messenger.message.deleteUserConverstaion(toUserIds);
    },
    blockMessageUser: async (_, {blockId}, {dataSources}) => {
      return await dataSources.Messenger.block.createBlock(blockId);
    },
    cancelBlockMessageUser: async (_, {blockId}, {dataSources}) => {
      return await dataSources.Messenger.block.cancelBlock(blockId);
    },
  },
};
