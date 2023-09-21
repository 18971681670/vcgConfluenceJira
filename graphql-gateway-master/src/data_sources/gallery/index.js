import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {Gallery} from './gallery';
import {PhotosOnGallery} from './photos_on_gallery';
import {MyGalleries} from './my_galleries';
import {MyGalleryContainsPhotos} from './my_gallery_contains_photos';
import {InGalleriesOnPhoto} from './in_galleries_on_photo';
import {FeatureGallery} from './feature_gallery';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from gallery microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    gallery: new Gallery(),
    photosOnGallery: new PhotosOnGallery(),
    myGalleries: new MyGalleries(),
    myGalleryContainsPhotos: new MyGalleryContainsPhotos(),
    inGalleriesOnPhoto: new InGalleriesOnPhoto(),
    featureGallery: new FeatureGallery(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
