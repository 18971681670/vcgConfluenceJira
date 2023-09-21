import {
  generateToOneAssocationFieldResolver,
} from '../helpers';

const SIZE_MAP = {
  TINY: '30x30',
  SMALL: '50x50',
  MEDIUM: '100x100',
  LARGE: '300x300',
};

export const resolvers = {
  Group: {
    creator: generateToOneAssocationFieldResolver('creator', 'UserCenter', 'User'),
    avatarUrl: async ({__avatars}, {size}) => {
      // FIXME: This should be a real avatar resolver instead of this junk
      if (Object.keys(__avatars).length === 0) {
        return null;
      }

      return __avatars[SIZE_MAP[size]].url;
    },
  },
};
