import {Microservice} from '../base/microservice';

/* == BEGIN OF AUTO IMPORT ==*/
import {SocialMedia} from './social_media';
import {PersonalAndProfile} from './personal_and_profile';
import {UserEquipment} from './user_equipment';
import {UserSetting} from './user_setting';
import {ProfileTabs} from './profile_tabs';
import {TosAcceptance} from './tos_acceptance';
import {UserBadge} from './user_badge';
import {SocialMediaItem} from './social_media_item';
/* == END OF AUTO IMPORT ==*/

/**
 * Instantiate a set of data sources from user_profile microservice
 * @return {Object} A map of data source instances
 */
export function dataSourceBuilder() {
  return new Microservice({
    /* == BEGIN OF AUTO DATASOURCE ==*/
    socialMedia: new SocialMedia(),
    socialMediaItem: new SocialMediaItem(),
    personalAndProfile: new PersonalAndProfile(),
    userEquipment: new UserEquipment(),
    userSetting: new UserSetting(),
    profileTabs: new ProfileTabs(),
    tosAcceptance: new TosAcceptance(),
    userBadge: new UserBadge(),
    /* == END OF AUTO DATASOURCE ==*/
  });
}
