import {Microservice} from '../base/microservice';

import {UserSettings} from './user_settings';
import {SitewideSettingUserBlock} from './sitewide_setting_user_block';
/**
 * Microservice
 * @return {Microservice} the settings microservice
 */
export function dataSourceBuilder() {
  return new Microservice({
    userSettings: new UserSettings(),
    sitewideSettingUserBlock: new SitewideSettingUserBlock(),
  });
}
