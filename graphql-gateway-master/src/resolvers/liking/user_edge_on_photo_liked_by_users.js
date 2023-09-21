import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  UserEdgeOnPhotoLikedByUsers: {
    node: generateToOneAssocationFieldResolver('node', 'UserCenter', 'User'),
  },
};
