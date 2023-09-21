import {merge} from 'lodash';

import {resolvers as resumeResolvers} from './resume';

export const resolvers = merge(
    {},
    resumeResolvers,
);
