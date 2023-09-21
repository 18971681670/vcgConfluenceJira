import {logger} from '../../utils/logger';

export const resolvers = {
  Pulse: {
    __resolveType: ({__resolveType}) => {
      return __resolveType;
    },
  },
};
