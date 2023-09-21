import {merge} from 'lodash';

import {resolvers as queryResolvers} from './query';

/* == BEGIN OF AUTO IMPORT ==*/
import {resolvers as membershipResolvers} from './membership';
import {resolvers as productResolvers} from './product';
import {resolvers as promotionDiscountResolvers} from './promotion_discount';
import {resolvers as productFeedResolvers} from './product_feed';
import {resolvers as authorizedFeaturesResolvers} from './authorized_features';
import {resolvers as sitePromotionResolvers} from './site_promotion';
import {resolvers as playstoreResolvers} from './playstore';
/* == END OF AUTO IMPORT ==*/

export const resolvers = merge(
    {},
    queryResolvers,
    /* == BEGIN OF AUTO RESOLVER ==*/
    membershipResolvers,
    productResolvers,
    promotionDiscountResolvers,
    productFeedResolvers,
    authorizedFeaturesResolvers,
    sitePromotionResolvers,
    playstoreResolvers,
    /* == END OF AUTO RESOLVER ==*/
);
