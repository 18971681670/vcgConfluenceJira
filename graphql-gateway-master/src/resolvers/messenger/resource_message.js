import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  ResourceMessage: {
    sender: generateToOneAssocationFieldResolver('sender', 'UserCenter', 'User', '__senderId'),
    recevier: generateToOneAssocationFieldResolver('recevier', 'UserCenter', 'User', '__receiverId'),
    resource: generateToOneAssocationFieldResolver('resource', 'Resource', 'Resource', '__resourceId'),
  },
};
