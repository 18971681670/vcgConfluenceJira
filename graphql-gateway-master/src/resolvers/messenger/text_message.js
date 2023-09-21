/* eslint-disable camelcase */
import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  TextMessage: {
    content: async ({kindContent}) => {
      return kindContent.text;
    },
    sender: generateToOneAssocationFieldResolver('sender', 'UserCenter', 'User', '__senderId'),
    recevier: generateToOneAssocationFieldResolver('recevier', 'UserCenter', 'User', '__receiverId'),
  },
};
