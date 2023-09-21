import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Membership} from './membership';
import {PhotoUploadQuotaPolicy} from './photo_upload_quota_policy';
import {Product} from './product';
import {PromotionDiscount} from './promotion_discount';
import {ProductFeed} from './product_feed';
import {AuthorizedFeature} from './authorized_feature';
import {SitePromotion} from './site_promotion';
import {Playstore} from './playstore';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from membership microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    membership: new Membership(),
    photoUploadQuotaPolicy: new PhotoUploadQuotaPolicy(),
    product: new Product(),
    promotionDiscount: new PromotionDiscount(),
    productFeed: new ProductFeed(),
    authorizedFeature: new AuthorizedFeature(),
    sitePromotion: new SitePromotion(),
    playstore: new Playstore(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
