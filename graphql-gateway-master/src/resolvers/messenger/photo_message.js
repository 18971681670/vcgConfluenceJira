import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  PhotoMessage: {
    sender: generateToOneAssocationFieldResolver('sender', 'UserCenter', 'User', '__senderId'),
    recevier: generateToOneAssocationFieldResolver('recevier', 'UserCenter', 'User', '__receiverId'),
    photo: generateToOneAssocationFieldResolver('photo', 'Photo', 'Photo', '__photoId'),
  },
};
