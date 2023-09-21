import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {UserAvatarResizeImage} from './user_avatar_resize_image';
import {PhotoResizeImage} from './photo_resize_image';
import {LicensingPhotoResizeImage} from './licensing_photo_resize_image';
import {ResourceCoverResizeImage} from './resource_cover_resize_image';
import {PortfolioCoverResizeImage} from './portfolio_cover_resize_image';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from resize microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    userAvatarResizeImage: new UserAvatarResizeImage(),
    photoResizeImage: new PhotoResizeImage(),
    licensingPhotoResizeImage: new LicensingPhotoResizeImage(),
    resourceCoverResizeImage: new ResourceCoverResizeImage(),
    portfolioCoverResizeImage: new PortfolioCoverResizeImage(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
