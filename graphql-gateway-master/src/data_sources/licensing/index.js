import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {LicensingPhoto} from './licensing_photo';
import {LicensingContributor} from './licensing_contributor';
import {MyLicensingPhotos} from './my_licensing_photos';
import {MyLicensingPhotoCandidates} from './my_licensing_photo_candidates';
import {MyLicensingReleases} from './my_licensing_releases';
import {ModelRelease} from './model_release';
import {PropertyRelease} from './property_release';
import {ReleasesOnLicensingPhoto} from './releases_on_licensing_photo';
import {ModelReleaseMetadata} from './model_release_metadata';
import {ViewOnLicensingPhoto} from './view_on_licensing_photo';
import {LicensingPhotoStat} from './licensing_photo_stat';
import {AutoLicensingPhoto} from './auto_licensing_photo';
import {SuggestPhoto} from './suggest_photo';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from licensing microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    licensingPhoto: new LicensingPhoto(),
    licensingContributor: new LicensingContributor(),
    myLicensingPhotos: new MyLicensingPhotos(),
    myLicensingPhotoCandidates: new MyLicensingPhotoCandidates(),
    myLicensingReleases: new MyLicensingReleases(),
    modelRelease: new ModelRelease(),
    propertyRelease: new PropertyRelease(),
    releasesOnLicensingPhoto: new ReleasesOnLicensingPhoto(),
    modelReleaseMetadata: new ModelReleaseMetadata(),
    viewOnLicensingPhoto: new ViewOnLicensingPhoto(),
    licensingPhotoStat: new LicensingPhotoStat(),
    autoLicensingPhoto: new AutoLicensingPhoto(),
    suggestPhoto: new SuggestPhoto(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
