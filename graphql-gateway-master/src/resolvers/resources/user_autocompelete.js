import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

export const resolvers = {
  ResourceUserAutocomplete: {
    user: generateToOneAssocationFieldResolver('user', 'UserCenter', 'User', '__userId'),
  },
};
