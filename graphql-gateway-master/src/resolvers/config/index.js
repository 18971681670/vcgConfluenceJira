import {merge} from 'lodash';

import {resolvers as configResolvers} from './config';

export const resolvers = merge(
    {},
    configResolvers,
);
