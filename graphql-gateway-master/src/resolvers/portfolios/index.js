import {merge} from 'lodash';
import {resolvers as themeResolvers} from './theme';
import {resolvers as portfolioResolvers} from './portfolio';
import {resolvers as folderResolvers} from './folder';
import {resolvers as tokenResolvers} from './token';
import {resolvers as contactResolvers} from './contact';

export const resolvers = merge(
    themeResolvers,
    portfolioResolvers,
    folderResolvers,
    tokenResolvers,
    contactResolvers,
);
