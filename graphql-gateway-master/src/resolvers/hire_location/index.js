import {merge} from 'lodash';

import {resolvers as hireLocationResolvers} from './hire_location';

export const resolvers = merge(
    {},
    hireLocationResolvers,
);
