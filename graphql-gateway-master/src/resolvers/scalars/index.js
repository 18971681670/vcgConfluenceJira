import {merge} from 'lodash';

import {resolvers as paginationAmountResolvers} from './pagination_amount';

export const resolvers = merge(
    {},
    paginationAmountResolvers,
);
