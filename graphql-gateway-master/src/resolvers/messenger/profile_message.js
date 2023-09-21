import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  UserprofileMessage: {
    sender: generateToOneAssocationFieldResolver('sender', 'UserCenter', 'User', '__senderId'),
    recevier: generateToOneAssocationFieldResolver('recevier', 'UserCenter', 'User', '__receiverId'),
    profile: generateToOneAssocationFieldResolver('profile', 'UserCenter', 'User', '__profileId'),
  },
};
