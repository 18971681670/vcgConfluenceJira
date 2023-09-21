import {merge} from 'lodash';

import {resolvers as exploreResolvers} from './explore';

export const resolvers = merge(
    exploreResolvers,
);
