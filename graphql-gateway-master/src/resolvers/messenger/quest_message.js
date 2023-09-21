import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  QuestMessage: {
    sender: generateToOneAssocationFieldResolver('sender', 'UserCenter', 'User', '__senderId'),
    recevier: generateToOneAssocationFieldResolver('recevier', 'UserCenter', 'User', '__receiverId'),
    quest: generateToOneAssocationFieldResolver('quest', 'Quest', 'Quest', '__questId'),
  },
};
