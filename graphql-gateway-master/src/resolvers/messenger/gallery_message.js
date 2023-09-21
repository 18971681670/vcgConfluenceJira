import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  GalleryMessage: {
    sender: generateToOneAssocationFieldResolver('sender', 'UserCenter', 'User', '__senderId'),
    recevier: generateToOneAssocationFieldResolver('recevier', 'UserCenter', 'User', '__receiverId'),
    gallery: generateToOneAssocationFieldResolver('gallery', 'Gallery', 'Gallery', '__galleryId'),
  },
};
