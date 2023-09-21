import {merge} from 'lodash';
import {resolvers as customDomainResolvers} from './customDomain';

export const resolvers = merge(
    customDomainResolvers,
);
